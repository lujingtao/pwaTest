//人类
import { getPeoSkills, o2o, getAtkResult, getPointUnit, getPointRange, getTriggerRangeUnits, getTriggerRange } from "@/class/Tool.js";
export default class People {
  constructor() {
  }

  init() {
    //非存储数据
    this._a = {  //装备、buff等加成后的能力
      atk: 0, //攻击
      hit: 0, //命中
      dod: 0, //闪避
      atkb: 0, //反击
      fatkb: 0, //先手反击
      hh: 0, //爆头率
      hhb: 0, //被爆头率
      mor: 0, //士气
      bh: 0, // 破马
      ba: 0, //破甲
      pa: 0, //穿甲
      bs: 0, //破盾
    }; 
    this._ap = 6;//行动点数
    this._state = "waiting";//当前人员状态
    this._equips = {};//已装备的物品对象组合
    this._moveRange = [];
    this._actionRange = [];
  }

  //更新属性
  update(skill) {
    this.updatePeoEquips();
    this.updateAbility(skill);
  }

  //使用peoEquips存储装备对象
  updatePeoEquips() {
    for (let key in this.equip) {
      this._equips[key] = common.getGoods(this.equip[key], "myGoods");
    }
  }

  //更新能力值
  updateAbility(skill) {
    this.setAbility(this); //身体
    let lh = this._equips.leftHand;
    if(lh){
      this.setAbility(lh); //武器
      this.setAbility(lh.effect); //武器效果
    }
    if(skill){ 
      this.setAbility(skill.effect); //使用技能
    }
    this.buffs.forEach(buff=>{ //人物所有buff
      
    })
    this._a.hit += 80; //基础命中80
    this._a.mor += 100; //基础士气100
  }
  
  setAbility(obj){
    for (let key in obj) {
      if(!this._a[key]) return;
      this._a[key] += obj[key]?;
      switch (key){
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
    }
  }

  //执行操作
  doAction(point, skill, map, peos, elements, enemys, callBack) {
    console.log(this.name, this, "对目标", point, "执行", skill);
    this._ap = this._ap - skill.ap;

    if (skill.id == -1 || skill.id == -2) {
      this.doOneAction(point, null, skill, map, peos, elements, enemys);
    } else {
      let skillRange = {}; //范围对象
      let o = data.skillRange.find(item => item.id == skill.rangeID);
      o2o(o, skillRange);
      let triggerRange = getTriggerRange(point, skillRange, map);
      console.log("技能执行范围：", triggerRange);
      let units = getTriggerRangeUnits(triggerRange, skill, peos, elements, enemys);
      console.log("技能执行范围内能实施的单位数组：", units);
      if (units.length == 0) return;
      units.forEach(unit => {
        this.doOneAction(point, unit, skill, map, peos, elements, enemys)
      })
    }
    if (callBack) callBack();
  }

  //执行单个操作
  doOneAction(point, unit, skill, map, peos, elements, enemys) {
    switch (skill.id) {
      case -1: //移动
        this.moveTo(point, map, peos, elements, enemys);
        break;
      case -2: //待机
        this._state = "end";
        break;
      case 17: //架盾

        break;
      case 6: //架盾

        break;
      case 9: //钩击

        break;
      default: //攻击

        break;
    }


  }

  //移动
  moveTo(point, map, peos, elements, enemys) {
    this._state = "waiting";
    this.x = point[0];
    this.y = point[1];
    map.updateBanPoints(peos, elements, enemys);
    this.clearRange(map);
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
    this._state = "action";
    let skillRange = {}; //范围对象
    let o = data.skillRange.find(item => item.id == skill.rangeID);
    o2o(o, skillRange);
    let effectiveRange = getPointRange([this.x, this.y], skillRange.effective, map);
    this._actionRange = effectiveRange;
    map.drawActionCell(this._actionRange, "skillRange");
    // let triggerRange = getTriggerRange(point, skillRange, map);
    // console.log("技能执行范围：", triggerRange);
  }

  //生成移动范围
  creatMoveRange(map) {
    this._state = "moving";
    this._moveRange = this.getMoveRange(map);
    map.drawActionCell(this._moveRange, "moveRange");
  }

  //重置ap和状态
  resetStatus() {
    this._state = "waiting";
    this._ap = 6;
  }

  //清除移动范围和攻击范围
  clearRange(map) {
    this._state = "waiting";
    map.clearActionCell();
    this._moveRange = [];
    this._actionRange = [];
  }

  //是否敌方人员
  isEnemy(enemys) {
    let unit = enemys.find(item => item.id == this.id);
    return unit ? true : false;
  }
}
