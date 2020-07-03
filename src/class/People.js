//人类
import { getPeoSkills, o2o, getAtkResult, getPointUnit, getPointRange, getTriggerRangeUnits, getTriggerRange } from "@/class/Tool.js";
export default class People {
  constructor() {
    this._equips = {}; //已装备的物品对象组合
    this._a = {}; //经过装备、状态统计后的能力，攻击力、命中率等
    this._ap = 6; //行动点数
    this._status = "waiting"; //当前人员状态
    // this.$peos = null;
    // this.attackRange = [];
    // this.state = "";
    // this.curPeo = null;
  }

  //更新属性
  update() {
    this.updatePeoEquips();
    this.updateAbility();
  }

  //使用peoEquips存储装备对象
  updatePeoEquips() {
    for (let key in this.equip) {
      this._equips[key] = common.getGoods(this.equip[key], "myGoods");
    }
  }

  //更新能力值
  updateAbility() {
    let lh = this._equips.leftHand;
    this._a.atk = this.pow + (lh ? lh.atk : 0);
    this._a.hit = 80 + this.agi + (lh ? lh.hit : 0);
    this._a.dod = this.agi;
    this._a.atkb = this.skill;
    this._a.fatkb = Math.round(this.skill / 2);
    this._a.hh = this.luck + (lh ? lh.hh : 0); //爆头率
    this._a.hhb = -this.luck; //被爆头率
    this._a.mor = 100 + this.will;
  }

  //执行操作
  doAction(point, skill, map, peos, elements, enemys, callBack) {
    console.log(this.name, this, "对目标", point, "执行", skill);
    console.log(this._ap);
    console.log(skill.ap);
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
        this._status = "end";
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
    this.x = point[0];
    this.y = point[1];
    map.updateBanPoints(peos, elements, enemys);
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

  //生成移动范围
  creatMoveRange(map) {
    let moveRange_ = this.getMoveRange(map);
    map.drawActionCell(moveRange_, "moveRange");
    return moveRange_;
  }
  
  //重置ap和状态
  resetStatus(){
    this._ap = 6;
    this._status = "waiting";
  }

  // //初始化事件
  // initEvent() {
  //   this.$peos.querySelectorAll(".peo").forEach($peo => {
  //     let curPeo = this.getPeoById($peo.getAttribute("id").split("_")[1]);

  //     let startX = 0;
  //     let startY = 0;
  //     let endX = 0;
  //     let endY = 0;
  //     let targetPoint = {};

  //     //触摸开始
  //     let start = function(e) {
  //       e.stopPropagation();
  //       let point = game.hasTouch ? e.touches[0] : e;
  //       game.people.curPeo = curPeo;
  //       targetPoint = { x: curPeo.x, y: curPeo.y };

  //       startX = point.pageX - curPeo.x * map.unitSize;
  //       startY = point.pageY - curPeo.y * map.unitSize;

  //       game.people.creatMoveRange(curPeo, map.banPoints);
  //       game.people.state = "moving";
  //       //$peo.addEventListener(game.touchMove, move, false);
  //       //$peo.addEventListener(game.touchEnd, end, false);
  //     }

  //     //触摸移动
  //     let move = function(e) {
  //       let point = game.hasTouch ? e.touches[0] : e;
  //       e.preventDefault();
  //       endX = point.pageX - startX;
  //       endY = point.pageY - startY;

  //       //拖动界限
  //       endX = endX <= 0 ? 0 : endX;
  //       endY = endY <= 0 ? 0 : endY;
  //       endX = endX >= (map.cols - 1) * map.unitSize ? (map.cols - 1) * map.unitSize : endX;
  //       endY = endY >= (map.rows - 1) * map.unitSize ? (map.rows - 1) * map.unitSize : endY;

  //       $peo.style.transform = "translate3d(" + endX + "px," + endY + "px,0);"
  //       // $peo.setAttribute("style", "transform:translate3d(" + endX + "px, " + endY + "px, 0px);");

  //       //计算目标坐标
  //       targetPoint = {
  //         x: parseInt(endX / map.unitSize + 1 / 2),
  //         y: parseInt(endY / map.unitSize + 1 / 2)
  //       };

  //       map.showTargetPoint(targetPoint);
  //     }

  //     //触摸结束
  //     let end = function(e) {
  //       console.log(endX,endY);
  //       if ( endX !=0 || endY != 0) {
  //         game.people.move(targetPoint);
  //       }

  //       $peo.removeEventListener(game.touchStart, end, false);
  //       $peo.removeEventListener(game.touchMove, move, false);
  //       $peo.removeEventListener(game.touchEnd, end, false);
  //     }

  //     $peo.addEventListener(game.touchStart, start, false);

  //   })

  // }

  // //通过id获取人员
  // getPeoById(id) {
  //   return game.data.peos.find(peo => peo.id == id);
  // }

  // //通过id获取人员对象元素
  // getPeoEleById(id) {
  //   return document.getElementById("peo_" + id)
  // }

}
