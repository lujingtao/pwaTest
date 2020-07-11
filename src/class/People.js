//人类
import { getDataItem, getPointRange, getTriggerRangeUnits, getTriggerRange } from "@/class/Tool.js";
import Animate from "@/class/Animate.js";
let animate = new Animate;
export default class People {
  constructor() {}

  init(type, map, peos, elements, enemys) {
    //非存储数据
    this._type = type; //类型 peo\enemy\element
    this._map = map;
    this._peos = peos;
    this._elements = elements;
    this._enemys = enemys;
    this._ap = 6; //行动点数
    this._state = "waiting"; //当前人员状态，waiting\moveRange\actionRange\moving\attacking
    this._moveRange = []; //移动范围
    this._actionRange = []; //行动范围
    this._damages = 0; //单场伤害，统计相关
    this._dodges = 0; //单场闪避，
    this._hits = 0; //单场命中，
    this._hhs = 0; //单场暴击，
    this._kills = 0; //单场击杀，
    this._exp = 0; //单场经验，
    this._level = 0; //战争结算时存储旧的等级，用来获取升了多少级
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
    let ary = this._type == "our" ? game.curSave.myTeam : game.battleTempEnemys;
    let unit = ary.find(unit => unit.id == this.id);

    this.hpMax = unit.hpMax;
    this.pow = unit.pow;
    this.agi = unit.agi;
    this.skill = unit.skill;
    this.luck = unit.luck;
    this.will = unit.will;
    this.endu = unit.endu;
    this.move = unit.move;

    this.atk = 0; //攻击
    this.hit = 0; //命中
    this.dod = 0; //闪避
    this.atkb = 0; //反击
    this.fatkb = 0; //先手反击
    this.hh = 0; //爆头率
    this.hhb = 0; //被爆头率
    this.mor = 0; //士气
    this.bh = 0; // 破马
    this.ba = 0; //破甲
    this.pa = 0; //穿甲
    this.bs = 0; //破盾
  }


  //执行操作
  doAction(point, skill, callBack) {
    console.log("【" + this.name + "】", this, "对目标", point, "执行", "【" + skill.type + "】", skill);
    if (this._ap < skill.ap) {
      console.log("ap不足");
      return;
    }
    let units = [];

    if (skill.id == -1 || skill.id == 99) { //如果是移动或结束
      animate.start(this, point, skill, this._map, () => {
        this._ap = this._ap - skill.ap;
        this.doOneAction(point, null, skill);
        this.animateCallBack(callBack);
      })
    } else { //其它技能
      let skillRange = getDataItem("skillRange", skill.rangeID); //范围对象
      let triggerRange = getTriggerRange(point, skillRange, this._map, this);
      console.log("技能执行范围：", triggerRange);
      units = getTriggerRangeUnits(this, triggerRange, skill, this._peos, this._elements, this._enemys);
      console.log("技能执行范围内能实施的单位数组：", units);
      if (units.length == 0) return;
      animate.start(this, point, skill, this._map, () => {
        this._ap = this._ap - skill.ap;
        units.forEach((unit, index) => {
          let attackResult = this.doOneAction(point, unit, skill);
          if (attackResult) {
            animate.attacked(this, unit, this._map, attackResult, () => { //最后一个目标执行完动画后再对整个动画回调
              if (index == units.length - 1) {
                this.animateCallBack(callBack);
              }
            })
          } else {
            this.animateCallBack(callBack);
          }
        })
      })
    }
    this._map.clearActionCell();
  }

  //动画结束后回调
  animateCallBack(callBack) {
    this.cancle();
    let $animateMask = document.getElementById("animateMask");
    $animateMask.style.display = "none";
    if (callBack) callBack();
  }

  //执行单个操作
  doOneAction(point, unit, skill) {
    switch (skill.id) {
      case -1: //移动
        this.action_moveTo(point)
        break;
      case 99: //待机
        this.action_end();
        break;
      case 18: //下盾
        skill.buffs.forEach(id => {
          this.removeBuff(id)
        });
        this.removeSkill(18);
        this.addSkill(17)
        break;
      case 17: //架盾
        skill.buffs.forEach(id => {
          this.addBuff(id)
        });
        this.removeSkill(17);
        this.addSkill(18)
        break;
      case 13: //旋风斩
        return this.action_attack(unit);
        break;
      case 9: //钩击
        this.action_pull(unit);
        break;
      case 6: //推击
        this.action_push(unit);
        break;
      default: //攻击
        return this.action_attack(unit);
        break;
    }
  }

  //钩击
  action_pull(unit) {
    //相对于目标的中间坐标，公式为 x = (x2 + x1)/2; y = (y2 + y1)/2
    var x = (this.x + unit.x) / 2;
    var y = (this.y + unit.y) / 2;
    //如果中间坐标是障碍物，则目标眩晕1回合
    if (common.indexOf2Array([x, y], this._map.banPoints) != -1) {
      unit.addBuff(1);
    } else {
      unit.x = x;
      unit.y = y;
      this._map.updateBanPoints();
    }
  }

  //推击
  action_push(unit) {
    //相对于目标的后一格坐标，公式为 x = 2 * x2 - x1; y = 2 * y2 - y1
    var x = unit.x * 2 - this.x;
    var y = unit.y * 2 - this.y;
    //如果坐标超过地图边界或者坐标是障碍物，则目标眩晕1回合
    if (x < 0 || x > this._map.cols || y < 0 || y > this._map.rows || common.indexOf2Array([x, y], this._map.banPoints) !=
      -1) {
      unit.addBuff(1);
    } else {
      unit.x = x;
      unit.y = y;
      this._map.updateBanPoints();
    }
  }

  /*
    攻击
    返回计算结果，用于执行动画{ type: 0, position: "head\body\rightHand", damage: 0, equipDamage: 0 }
    type 0:miss  1:伤害  2:死亡
  */
  action_attack(unit) {
    //如果目标处于架盾状态，则只能攻击盾牌
    if (unit.buffs.indexOf(0) != -1) {
      return this.attackAccount(unit, "rightHand");
    }

    //计算命中率
    let hit = this.hit - unit.dod;
    hit = hit > 100 ? 100 : hit;
    let hitRandom = common.random(1, 100);
    let isHit = hitRandom <= hit;
    console.log(`【${this.name}】攻击【${unit.name}】,【${hit},${hitRandom}】,${isHit?'命中':'miss'}`);
    if (!isHit) {
      unit._dodges++;
      return { type: 0, position: "", damage: 0, equipDamage: 0 }
    };

    //计算爆头率
    let hh = this.hh + unit.hhb;
    hh = hh > 100 ? 100 : hh;
    let hhRandom = common.random(1, 100);
    let isHh = hhRandom <= hh;
    return this.attackAccount(unit, isHh ? 'head' : 'body');
  }

  //攻击结算
  attackAccount(unit, position) {
    let leftHand = this._equips["leftHand"];
    let equip = unit._equips[position];
    let damage = 0;
    let equipDamage = 0;
    let weight = position == "head" ? 1.5 : 1;
    if (leftHand) { //攻击方有武器
      if (position == "rightHand") { //如果攻击盾牌
        equipDamage = this.atk * this.ba / 100;
      } else {
        let pa = equip ? this.pa : 100;
        pa = pa > 100 ? 100 : pa;
        damage = this.atk * this.pa * weight / 100;
        equipDamage = equip ? this.atk * this.ba / 100 : 0;
      }
    } else { //攻击方无武器
      damage = 1 * weight;
      equipDamage = equip ? 2 : 0;
    }
    damage = Math.round(damage);
    equipDamage = Math.round(equipDamage);
    unit.hp -= damage;
    unit.hp = unit.hp < 0 ? 0 : unit.hp;
    if (equip) {
      equip.dur -= equipDamage;
      equip.dur = equip.dur < 0 ? 0 : equip.dur;
    }
    console.log(`命中【${position}】，hp：-${damage}，装备：-${equipDamage}`);
    if (unit.hp <= 0) {
      console.log("【" + this.name + "】", this, "击杀了", "【" + unit.name + "】",
        unit);
    }

    this._hits++;
    this._damages = this._damages + damage + equipDamage;
    this._hhs = this._hhs + (position == "head" ? 1 : 0);
    this._kills = this.kills + (unit.hp <= 0 ? 1 : 0)
    return { type: unit.hp <= 0 ? 2 : 1, position: position, damage: damage, equipDamage: equipDamage }
  }

  //结束
  action_end() {
    this._state = "end";
  }

  //移动
  action_moveTo(point) {
    this._state = "moving";
    this.x = point[0];
    this.y = point[1];
    this._map.updateBanPoints();
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
        this.removeSkill(id, true)
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
  removeSkill(id, isRemoveEquip) {
    let skill = this._skills.find(skill => skill.id == id);
    if (skill && (isRemoveEquip || skill.active == 0)) { //被动技能 或者 卸载装备 情况下自动删除buff
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

  //检查buffs，根据buff状态执行相关操作
  checkBuffs() {
    this._buffs.forEach(buff => {
      if (buff.roundUnit == "time" && buff.round > 0) {
        switch (buff.id) {
          case 1: //眩晕，自动跳过当前回合
            this.action_end();
            break;
        }
        buff.round--;
        if (buff.round <= 0) {
          this.removeBuff(buff.id)
        }
      }
    })
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
    if (index != -1) {
      this[type].splice(index, 1);
    }
    let _index = this["_" + type].findIndex(item => item.id == id);
    if (_index != -1) {
      this["_" + type].splice(_index, 1);
    }
  }

  //更新能力值
  updateAbility(skill) {
    this.initAbility();
    //this.setAbility(this); //身体

    for (let key in this._equips) { //所有装备属性及附带效果
      let equip = this._equips[key];
      if (!equip) continue;
      if (key == "leftHand") {
        this.setAbility(equip, "leftHand"); //主手装备属性
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
    this.atk += this.pow;
    this.hit += this.agi;
    this.dod += this.agi;
    this.atkb += this.skill;
    this.fatkb += Math.round(this.skill / 2);
    this.mor += this.will;
    this.hit += 80; //基础命中80
    this.mor += 100; //基础士气100
  }

  setAbility(obj, type) {
    if (type == "leftHand") {
      this.atk = obj.atk;
      this.bh = obj.bh;
      this.ba = obj.ba;
      this.pa = obj.pa;
      this.bs = obj.bs;
      this.hit = obj.hit;
      this.hh = obj.hh;
    } else {
      for (let key in obj) {
        if (this[key] == undefined) continue; //位置不能置前
        this[key] += obj[key];
      }
    }
  }
  
  //统计总经验得出升级级数
  getLevel(){
    let exp = this.exp;
    let lv = 0;
    for (let i = 0; i < data.exp.length; i++) {
      exp -= data.exp[i];
      if(exp<0){
         lv = i-1;
         break;
      }
    }
    return lv;
  }

  //获取周围四个点的值
  getRoundPoints(p) {
    var x = p[0];
    var y = p[1];
    var r = [];
    if (y - 1 >= 0) { r.push([x, y - 1]) }
    if (x - 1 >= 0) { r.push([x - 1, y]) }
    if (x + 1 < this._map.cols) { r.push([x + 1, y]) }
    if (y + 1 < this._map.rows) { r.push([x, y + 1]) }
    return r
  }

  //获取可移动范围
  getMoveRange() {
    let _this = this;
    var openAry = [];
    //开始
    var go = function(point, moveSize) {
      var roundPoints = _this.getRoundPoints(point);
      for (let i = 0; i < roundPoints.length; i++) {
        var _moveSize = moveSize;
        var p = roundPoints[i];
        if (common.indexOf2Array(p, _this._map.banPoints) == -1) {
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
    go = null;
    return openAry;
  }

  //生成通用技能范围
  creatSkillRange(skill) {
    this._state = "actionRange";
    let skillRange = getDataItem("skillRange", skill.rangeID); //范围对象
    let effectiveRange = getPointRange([this.x, this.y], skillRange.effective, this._map);
    this._actionRange = effectiveRange;
    this._map.drawActionCell(this._actionRange, "skillRange");
    // let triggerRange = getTriggerRange(point, skillRange, this._map);
    // console.log("技能执行范围：", triggerRange);
  }

  //生成移动范围
  creatMoveRange() {
    this._state = "moveRange";
    this._moveRange = this.getMoveRange();
    this._map.drawActionCell(this._moveRange, "moveRange");
  }

  //重置ap和状态
  resetStatus() {
    this._state = "waiting";
    this._ap = 6;
  }

  //取消选择（清除移动范围和攻击范围）
  cancle() {
    this._state = this._state == "end" ? "end" : "waiting";
    this.updateAbility();
    this._map.clearActionCell();
    this._moveRange = [];
    this._actionRange = [];
  }

}
