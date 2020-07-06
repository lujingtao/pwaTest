//人类
import { getDataItem, getPointRange, getTriggerRangeUnits, getTriggerRange } from "@/class/Tool.js";
export default class People {
  constructor() {
  }

  init() {
    //非存储数据
    this._ap = 6;//行动点数
    this._state = "waiting";//当前人员状态，waiting、moving、activing
    this._moveRange = [];
    this._actionRange = [];
    this._a = {};//装备、buff等加成后的能力
    this.initAbility();
    this._buffs=[];
    this.initBuffs_(); //初始化buffs
    this._equips = {}; //已装备的物品对象组合
    this.updateEquips_();
  }

  //更新属性
  // update(skill) {
  //   this.updatePeoEquips();
  //   this.updateAbility(skill);
  // }
  
  //初始化能力
  initAbility(){
    //this._a.maxHp;
    
    this._a.atk=0; //攻击
    this._a.hit=0; //命中
    this._a.dod=0; //闪避
    this._a.atkb=0; //反击
    this._a.fatkb=0; //先手反击
    this._a.hh=0; //爆头率
    this._a.hhb=0; //被爆头率
    this._a.mor=0; //士气
    this._a.bh=0; // 破马
    this._a.ba=0; //破甲
    this._a.pa=0; //穿甲
    this._a.bs=0; //破盾
    //this._a.move=
  }
  
  //初始化_buffs
  initBuffs_(){
    this.buffs.forEach(id=>{
      this._buffs.push(getDataItem("buffs",id))
    })
  }

  //更新装备装备存储对象
  updateEquips_() {
    for (let key in this.equip) {
      this._equips[key] = common.getGoods(this.equip[key], "myGoods");
    }
    this.updateAbility();
  }
  
  //更新装备
  updateEquip(type,id){
    this.equip[type] = id;
    this.updateEquips_();
  }

  //更新能力值
  updateAbility(skill) {
    this.initAbility();
    this.setAbility(this); //身体
    let lh = this._equips.leftHand;
    if(lh){
      this.setAbility(lh); //武器
      this.setAbility(lh.effect); //武器效果
    }
    if(skill){ 
      this.setAbility(skill.effect); //使用技能
    }
    this._buffs.forEach(buff=>{ //人物所有buff
      this.setAbility(buff.effect); //buff效果
    });
    this._a.hit += 80; //基础命中80
    this._a.mor += 100; //基础士气100
  }
  
  setAbility(obj){
    for (let key in obj) {
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
      if(!this._a[key]) continue; //位置不能置前
      this._a[key] += obj[key];
    }
  }

  //执行操作
  doAction(point, skill, map, peos, elements, enemys, callBack) {
    console.log(this.name, this, "对目标", point, "执行", skill);
    if (skill.id == -1 || skill.id == -2) {
      this.doOneAction(point, null, skill, map, peos, elements, enemys);
      this._ap = this._ap - skill.ap;
    } else {
      let skillRange = getDataItem("skillRange",skill.rangeID); //范围对象
      let triggerRange = getTriggerRange(point, skillRange, map);
      console.log("技能执行范围：", triggerRange);
      let units = getTriggerRangeUnits( this, triggerRange, skill, peos, elements, enemys);
      console.log("技能执行范围内能实施的单位数组：", units);
      if (units.length == 0) return;
      units.forEach(unit => {
        this.doOneAction(point, unit, skill, map, peos, elements, enemys)
      })
      this._ap = this._ap - skill.ap;
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
        this.end(map);
        break;
      case 17: //架盾
        this.addBuffs(skill.buffs)
        break;
      case 6: //推击

        break;
      case 9: //钩击

        break;
      default: //攻击
        this.attack(unit);
        break;
    }


  }
  
  //攻击
  attack(unit){
    //计算命中率
    let hit = this._a.hit - unit._a.dod;
    hit = hit>100?100:hit;
    let hitRandom = common.random(1,100);
    let isHit = hitRandom<=hit;
    console.log(this.name + "攻击" + unit.name,"【",hit,hitRandom,"】",isHit?"命中":"miss" );
    if(!isHit) return;
    let leftHand = this._equips["leftHand"];
    let head = unit._equips["head"];
    let body = unit._equips["body"];
    
    if(!leftHand){
      unit.hp--;
      if(head){
        head.dur--;
      }
      if(body){
        body.dur--;
      }
      return;
    }
    //计算爆头率
    let hh = this._a.hh + unit._a.hhb;
    hh = hh>100?100:hh;
    let hhRandom = common.random(1,100);
    let isHh = hhRandom<=hh;
    
    if(isHh){ //攻击头部
      let head = unit._equips["head"];
      if(head){
        //head.dur -= 
      }else{
        
      }
      //目标没有传盔甲则穿甲率为100
      let pa = unit._equips["head"] ? this._a.pa : 100;
      
    }else{ //攻击身体
      
    }
  }
  
  //结束
  end(map){
    this._state = "end";
    this.cancle(map);
  }

  //移动
  moveTo(point, map, peos, elements, enemys) {
    this._state = "waiting";
    this.x = point[0];
    this.y = point[1];
    map.updateBanPoints(peos, elements, enemys);
    this.cancle(map);
  }
  
  //添加buff，先检查是否存在buff，如果存在则更新buff（重置buff回合）
  addBuffs(buffsAry){
    buffsAry.forEach( id=>{
      if( this.buffs.indexOf(id) == -1){
        this.buffs.push(id);
        this._buffs.push(getDataItem("buffs",id));
      }else{
        let buff = getDataItem("buffs",id);
        let _buff = this._buffs.find( item=> item.id == id);
        _buff.round = buff.round;
      }
    });
    this.updateAbility();
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
    this._state = "activing";
    let skillRange = getDataItem("skillRange",skill.rangeID); //范围对象
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

  //取消选择（清除移动范围和攻击范围）
  cancle(map) {
    this._state = this._state =="end"?"end":"waiting";
    this.updateAbility();
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
