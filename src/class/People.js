//人类
export default class People {
  constructor() {
    this._equips={}; //已装备的物品对象组合
    this._a={}; //经过装备、状态统计后的能力，攻击力、命中率等
    this._ap=6; //行动点数
    // this.$peos = null;
    // this.attackRange = [];
    // this.state = "";
    // this.curPeo = null;
  }
  
  //更新属性
  update(){
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
    this._a.atk = this.pow + (lh?lh.atk:0);
    this._a.hit = 100 + this.agi + (lh?lh.hit:0);
    this._a.dod = this.agi;
    this._a.atkb = this.skill;
    this._a.fatkb = Math.round(this.skill/2);
    this._a.hh = this.luck + (lh?lh?.hh:0);
    this._a.hhb = -this.luck;
    this._a.mor = 100 + this.will;
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

  //移动
  moveTo(point) {
    this.x = point[0];
    this.y = point[1];
  }

  //生成移动范围
  creatMoveRange(map) {
    var cols = map.cols;
    var rows = map.rows;

    //获取周围四个点的值
    var getRoundPoints = function(p, cols) {
      var x = p[0],
        y = p[1];
      var r = [];
      if (y - 1 >= 0) { r.push([x, y - 1]) }
      if (x - 1 >= 0) { r.push([x - 1, y]) }
      if (x + 1 < cols) { r.push([x + 1, y]) }
      if (y + 1 < rows) { r.push([x, y + 1]) }
      return r
    }
    //计算可移动范围
    var moveRange = function(point, moveSize, banPoints) {
      var openAry = [point];
      //开始
      var go = function(point, moveSize) {
        var roundPoints = getRoundPoints(point, cols);
        for (let i = 0; i < roundPoints.length; i++) {
          var _moveSize = moveSize;
          var p = roundPoints[i];
          if (common.indexOf2Array(p, banPoints) == -1) {
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
      go(point, moveSize);
      openAry.splice(openAry.indexOf(point), 1);
      return openAry;
    }
    //let _banPoints = map.banPoints.filter();
    let moveRange_ = moveRange([this.x, this.y], this.move, map.banPoints);

    map.drawActionCell(moveRange_, "moveRange");
    moveRange = null;
    return moveRange_;
  }

}
