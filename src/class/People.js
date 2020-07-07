//人类
import { getDataItem, getPointRange, getTriggerRangeUnits, getTriggerRange } from "@/class/Tool.js";
export default class People {
  constructor() {}

  init(type) {
    //非存储数据
    this._type = type; //类型 peo\enemy\element
    this._ap = 6; //行动点数
    this._state = "waiting"; //当前人员状态，waiting\moveRange\actionRange\moving\attacking
    this._animate = ""; //动画状态，用于执行动画，例如 attacked
    this._animateDes = ""; //动画描述，例如被攻击attacked时，显示miss等文字
    this._moveRange = []; //移动范围
    this._actionRange = []; //行动范围
    this._a = {}; //装备、buff等加成后的能力
    this.initAbility();
    this._buffs = []; //存储buff对象数组
    this.initBuffs_(); //初始化buff对象数组
    this._skills = []; //存储skill对象数组
    this.initSkills_(); //初始化skill对象数组
    this._equips = { //存储装备对象组合
      head: undefined,
      other: undefined,
      body: undefined,
      leftHand: undefined,
      rightHand: undefined,
    };
    this.initEquips_();
    this.updateAbility();
  }

  //初始化能力
  initAbility() {
    //this._a.maxHp;
    this._a.atk = 0; //攻击
    this._a.hit = 0; //命中
    this._a.dod = 0; //闪避
    this._a.atkb = 0; //反击
    this._a.fatkb = 0; //先手反击
    this._a.hh = 0; //爆头率
    this._a.hhb = 0; //被爆头率
    this._a.mor = 0; //士气
    this._a.bh = 0; // 破马
    this._a.ba = 0; //破甲
    this._a.pa = 0; //穿甲
    this._a.bs = 0; //破盾
  }


  //执行操作
  doAction(point, skill, map, peos, elements, enemys, callBack) {
    console.log(this.name, this, "对目标", point, "执行", skill);
    if (this._ap < skill.ap) {
      console.log("ap不足");
      return;
    }
    let units = [];
    if (skill.id == -1 || skill.id == 99) {
      this.doOneAction(point, null, skill, map, peos, elements, enemys);
      this._ap = this._ap - skill.ap;
    } else {
      let skillRange = getDataItem("skillRange", skill.rangeID); //范围对象
      let triggerRange = getTriggerRange(point, skillRange, map);
      console.log("技能执行范围：", triggerRange);
      units = getTriggerRangeUnits(this, triggerRange, skill, peos, elements, enemys);
      console.log("技能执行范围内能实施的单位数组：", units);
      if (units.length == 0) return;
      units.forEach(unit => {
        this.doOneAction(point, unit, skill, map, peos, elements, enemys)
      })
      this._ap = this._ap - skill.ap;
    }
    game.actionTimer = setTimeout(() => {
      this.cancle(map);
      units.forEach(unit => {
        unit._animate = "";
        unit._animateDes = "";
      })
      if (callBack) callBack();
    }, 1000)
  }

  //执行单个操作
  doOneAction(point, unit, skill, map, peos, elements, enemys) {
    switch (skill.id) {
      case -1: //移动
        this.action_moveTo(point, map, peos, elements, enemys);
        break;
      case 99: //待机
        this.action_end();
        break;
      case 17: //架盾
        skill.buffs.forEach(id => {
          this.addBuff(id)
        });
        this.removeSkill(17);
        this.addSkill(18)
        break;
      case 18: //下盾
        this.removeBuff(0)
        this.removeSkill(18);
        this.addSkill(17)
        break;
      case 6: //推击
        this.action_push(point, unit, skill, map, peos, elements, enemys);
        break;
      case 9: //钩击
        this.action_pull(point, unit, skill, map, peos, elements, enemys);
        break;
      default: //攻击
        this.action_attack(unit);
        break;
    }
  }

  //钩击
  action_pull(point, unit, skill, map, peos, elements, enemys) {
    //相对于目标的中间坐标，公式为 x = (x2 + x1)/2; y = (y2 + y1)/2
    var x = (this.x + unit.x) / 2;
    var y = (this.y + unit.y) / 2;
    //如果中间坐标是障碍物，则目标眩晕1回合
    if (common.indexOf2Array([x, y], map.banPoints) != -1) {
      unit.addBuff(1);
    } else {
      unit.x = x;
      unit.y = y;
      map.updateBanPoints(peos, elements, enemys);
    }
  }

  //推击
  action_push(point, unit, skill, map, peos, elements, enemys) {
    //相对于目标的后一格坐标，公式为 x = 2 * x2 - x1; y = 2 * y2 - y1
    var x = unit.x * 2 - this.x;
    var y = unit.y * 2 - this.y;
    //如果坐标超过地图边界或者坐标是障碍物，则目标眩晕1回合
    if (x < 0 || x > map.cols || y < 0 || y > map.rows || common.indexOf2Array([x, y], map.banPoints) != -1) {
      unit.addBuff(1);
    } else {
      unit.x = x;
      unit.y = y;
      map.updateBanPoints(peos, elements, enemys);
    }
  }

  //攻击
  action_attack(unit) {
    //this._animate = "attacking";
    unit._animate = "attacked";

    //计算命中率
    let hit = this._a.hit - unit._a.dod;
    hit = hit > 100 ? 100 : hit;
    let hitRandom = common.random(1, 100);
    let isHit = hitRandom <= hit;
    console.log(`【${this.name}】攻击【${unit.name}】,【${hit},${hitRandom}】,${isHit?'命中':'miss'}`);
    if (!isHit) {
      unit._animateDes = "MISS";
      return
    };

    //计算爆头率
    let hh = this._a.hh + unit._a.hhb;
    hh = hh > 100 ? 100 : hh;
    let hhRandom = common.random(1, 100);
    let isHh = hhRandom <= hh;
    this.attackAccount(isHh ? 'head' : 'body', unit);
  }

  //攻击结算
  attackAccount(position, unit) {
    let leftHand = this._equips["leftHand"];
    let equip = unit._equips[position];
    let damage = 0;
    let equipDamage = 0;
    let weight = position == "head" ? 1.5 : 1;
    if (leftHand) { //攻击方有武器
      let pa = equip ? this._a.pa : 100;
      pa = pa > 100 ? 100 : pa;
      damage = this._a.atk * this._a.pa * weight / 100;
      equipDamage = equip ? this._a.atk * this._a.ba / 100 : 0;
    } else { //攻击方无武器
      damage = 1 * weight;
      equipDamage = equip ? 2 : 0;
    }
    damage = Math.round(damage);
    equipDamage = Math.round(equipDamage);
    unit.hp -= damage;
    if (equip) {
      equip.dur -= equipDamage;
      equip.dur = equip.dur < 0 ? 0 : equip.dur;
    }
    unit._animateDes = `-${damage}${position=='head'?'！':''}`;
    console.log(`命中【${position}】，hp：-${damage}，装备：-${equipDamage}`);

    this.checkDie(unit);
  }

  //是否死亡
  checkDie(unit) {
    unit = unit == undefined ? this : unit;
    if (unit.hp <= 0) {
      
    }
  }

  //结束
  action_end() {
    this._state = "end";
  }

  //移动
  action_moveTo(point, map, peos, elements, enemys) {
    this._state = "moving";
    this.x = point[0];
    this.y = point[1];
    map.updateBanPoints(peos, elements, enemys);
  }

  //初始化技能对象数组
  initSkills_() {
    this.skills.forEach(id => {
      this.addSkill(id)
    })
  }

  //初始化_buffs
  initBuffs_() {
    this.buffs.forEach(id => {
      this.addBuff(id)
    })
  }

  //初始化装备存储对象
  initEquips_() {
    for (let key in this.equip) {
      this.addEquip(key, common.getGoods(this.equip[key], "myGoods"))
    }
  }

  //替换装备
  switchEquip(type, cur, target) {
    this.removeEquip(type);
    this.addEquip(type, target);
  }

  //添加装备
  addEquip(type, target) {
    if (target) {
      target.skills.forEach(id => {
        this.addSkill(id)
      });
      this.equip[type] = target.id;
    }
    this._equips[type] = target;
    this.updateAbility();
  }

  //卸载装备
  removeEquip(type) {
    let equip = this._equips[type];
    if (equip) {
      equip.skills.forEach(id => {
        this.removeSkill(id)
      })
    }
    this.equip[type] = "";
    this._equips[type] = undefined;
    this.updateAbility();
  }

  //添加技能
  addSkill(id) {
    let skill = getDataItem("skills", id);
    if (skill && skill.active == 0) { //被动技能自动加上buff
      skill.buffs.forEach(id => {
        this.addBuff(id)
      })
    }
    this.addItem("skills", id);
    this.updateAbility();
  }

  //卸载技能
  removeSkill(id) {
    let skill = this._skills.find(skill => skill.id == id);
    if (skill && skill.active == 0) { //被动技能自动删除buff
      skill.buffs.forEach(id => {
        this.removeBuff(id)
      })
    }
    this.removeItem("skills", id);
    this.updateAbility();
  }

  //添加buff
  addBuff(id) {
    this.addItem("buffs", id);
    this.updateAbility();
  }

  //卸载buff
  removeBuff(id) {
    this.removeItem("buffs", id);
    this.updateAbility();
  }

  //添加表里某一项
  addItem(type, id) {
    let index = this[type].indexOf(id);
    let _index = this["_" + type].findIndex(item => item.id == id);
    if (index == -1) {
      this[type].push(id);
    }
    if (_index == -1) {
      this["_" + type].push(getDataItem(type, id));
    }
    if (_index != -1 && type == "buffs") {
      //如果存在则更新buff（重置buff回合）
      let buff = getDataItem("buffs", id);
      let _buff = this._buffs.find(item => item.id == id);
      _buff.round = buff.round;
    }
  }

  //删除表里某一项
  removeItem(type, id) {
    let index = this[type].indexOf(id);
    this[type].splice(index, 1);
    let _index = this["_" + type].findIndex(item => item.id == id);
    this["_" + type].splice(_index, 1);
  }

  //更新能力值
  updateAbility(skill) {
    this.initAbility();
    this.setAbility(this); //身体

    for (let key in this._equips) { //所有装备属性及附带效果
      let equip = this._equips[key];
      if (!equip) continue;
      if (key == "leftHand") {
        this.setAbility(equip); //主手装备属性
      }
      this.setAbility(equip.effect); //装备附带效果
    }
    if (skill) {
      this.setAbility(skill.effect); //使用技能
    }
    this._buffs.forEach(buff => { //人物所有buff
      this.setAbility(buff.effect); //buff效果
    });
    this._skills.sort((a, b) => a.id - b.id);
    this._buffs.sort((a, b) => a.id - b.id);
    this._a.hit += 80; //基础命中80
    this._a.mor += 100; //基础士气100
  }

  setAbility(obj) {
    for (let key in obj) {
      switch (key) {
        case "pow":
          this._a.atk += obj[key];
          break;
        case "agi":
          this._a.hit += obj[key];
          this._a.dod += obj[key];
          break;
        case "skill":
          this._a.atkb += obj[key];
          this._a.fatkb += Math.round(obj[key] / 2);
          break;
        case "luck":
          this._a.hh += obj[key];
          this._a.hhb -= obj[key];
          break;
        case "will":
          this._a.mor += obj[key];
          break;
      }
      if (this._a[key] == undefined) continue; //位置不能置前
      this._a[key] += obj[key];
    }
  }

  //获取周围四个点的值
  getRoundPoints(p, map) {
    var x = p[0],
      y = p[1];
    var r = [];
    if (y - 1 >= 0) { r.push([x, y - 1]) }
    if (x - 1 >= 0) { r.push([x - 1, y]) }
    if (x + 1 < map.cols) { r.push([x + 1, y]) }
    if (y + 1 < map.rows) { r.push([x, y + 1]) }
    return r
  }

  //获取可移动范围
  getMoveRange(map) {
    let _this = this;
    var openAry = [];
    //开始
    var go = function(point, moveSize) {
      var roundPoints = _this.getRoundPoints(point, map);
      for (let i = 0; i < roundPoints.length; i++) {
        var _moveSize = moveSize;
        var p = roundPoints[i];
        if (common.indexOf2Array(p, map.banPoints) == -1) {
          _moveSize--;
          if (common.indexOf2Array(p, openAry) == -1) {
            openAry.push(p);
          }
          if (_moveSize > 0) {
            go(p, _moveSize);
          }
        }
      }
    }
    go([this.x, this.y], this.move);
    return openAry;
  }

  //生成通用技能范围
  creatSkillRange(map, skill) {
    this._state = "actionRange";
    let skillRange = getDataItem("skillRange", skill.rangeID); //范围对象
    let effectiveRange = getPointRange([this.x, this.y], skillRange.effective, map);
    this._actionRange = effectiveRange;
    map.drawActionCell(this._actionRange, "skillRange");
    // let triggerRange = getTriggerRange(point, skillRange, map);
    // console.log("技能执行范围：", triggerRange);
  }

  //生成移动范围
  creatMoveRange(map) {
    this._state = "moveRange";
    this._moveRange = this.getMoveRange(map);
    map.drawActionCell(this._moveRange, "moveRange");
  }

  //重置ap和状态
  resetStatus() {
    this._state = "waiting";
    this._ap = 6;
  }

  //取消选择（清除移动范围和攻击范围）
  cancle(map) {
    this._state = this._state == "end" ? "end" : "waiting";
    this._animate = "";
    this._animateDes = "";
    this.updateAbility();
    map.clearActionCell();
    this._moveRange = [];
    this._actionRange = [];
  }

}
