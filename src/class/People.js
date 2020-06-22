//人类
export default class People {
  constructor() {
    this._equips={};
    this._a={};
    // this.$peos = null;
    // this.moveRange = [];
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
  
  // //放置人物
  // putPeos() {
  //   let html = "";
  //   game.data.peos.forEach(peo => {
  //     html += '<div class="peo" id="peo_' + peo.id + '" style="transform:translate3d(' + peo.x * game.map.unitSize +
  //       'px, ' + peo.y * game.map.unitSize +
  //       'px, 0px)">';
  //     peo.equip.forEach(id => {
  //       let good = game.data.goods.find(g => g.id == id);
  //       html += '<span class="iconfont type-' + good.type + ' icon-' + good.type + '-' + good.cate +
  //         '" style="color:'+ game.data.goodsColor[good.qua] +'; font-size:' + game.map.unitSize + 'px"></span>';
  //     });
  //     html += '</div>';
  //   });
  //   this.$peos.innerHTML = html;
  // }

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

  //       startX = point.pageX - curPeo.x * game.map.unitSize;
  //       startY = point.pageY - curPeo.y * game.map.unitSize;

  //       game.people.creatMoveRange(curPeo, game.map.forbiddenPoint);
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
  //       endX = endX >= (game.map.cols - 1) * game.map.unitSize ? (game.map.cols - 1) * game.map.unitSize : endX;
  //       endY = endY >= (game.map.rows - 1) * game.map.unitSize ? (game.map.rows - 1) * game.map.unitSize : endY;

  //       $peo.style.transform = "translate3d(" + endX + "px," + endY + "px,0);"
  //       // $peo.setAttribute("style", "transform:translate3d(" + endX + "px, " + endY + "px, 0px);");

  //       //计算目标坐标
  //       targetPoint = {
  //         x: parseInt(endX / game.map.unitSize + 1 / 2),
  //         y: parseInt(endY / game.map.unitSize + 1 / 2)
  //       };

  //       game.map.showTargetPoint(targetPoint);
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

  // //移动
  // move(point) {
  //   let $peo = this.getPeoEleById(this.curPeo.id);
  //    $peo.style.transform = "translate3d(" + point.x * game.map.unitSize + "px," + point.y * game.map.unitSize +
  //     "px,0);"
  //   this.curPeo.x = point.x;
  //   this.curPeo.y = point.y;
    
  //   game.people.state="";
  //   game.people.moveRange=[];
  //   game.map.updateForbiddenPoint();
  //   game.map.draw([], "clear")
  // }

  // //生成移动范围
  // creatMoveRange(curPeo, forbiddenPoint) {
  //   var cols = game.map.cols;
  //   var rows = game.map.rows;

  //   //获取周围四个点的值
  //   var getRoundPoints = function(p, cols) {
  //     var x = p[0],
  //       y = p[1];
  //     var r = [];
  //     if (y - 1 >= 0) { r.push([x, y - 1]) }
  //     if (x - 1 >= 0) { r.push([x - 1, y]) }
  //     if (x + 1 < cols) { r.push([x + 1, y]) }
  //     if (y + 1 < rows) { r.push([x, y + 1]) }
  //     return r
  //   }
  //   //计算可移动范围
  //   var moveRange = function(point, moveSize, forbiddenPoint) {
  //     var openAry = [point];
  //     //开始
  //     var go = function(point, moveSize) {
  //       var roundPoints = getRoundPoints(point, cols);
  //       for (let i = 0; i < roundPoints.length; i++) {
  //         var _moveSize = moveSize;
  //         var p = roundPoints[i];
  //         if (common.indexOf2Array(p, forbiddenPoint) == -1) {
  //           _moveSize--;
  //           if (common.indexOf2Array(p, openAry) == -1) {
  //             openAry.push(p);
  //           }
  //           if (_moveSize > 0) {
  //             go(p, _moveSize);
  //           }
  //         }
  //       }
  //     }
  //     go(point, moveSize);
  //     openAry.splice(openAry.indexOf(point), 1);
  //     return openAry;
  //   }

  //   this.moveRange = moveRange([curPeo.x, curPeo.y], curPeo.move, forbiddenPoint);

  //   game.map.draw(this.moveRange, "moveRange");
  //   return this.moveRange;
  // }

}
