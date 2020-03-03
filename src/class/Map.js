//地图类
export default class Map {
  constructor() {
    this.$map = null;
    this.$mapDrag = null;
    this.unitSize = 0;
    this.cols = 0;
    this.rows = 0;
    this.ctx = null;
    this.dragY = true; //地图能否竖向拖拽
    this.forbiddenPoint = [];
  }
  //初始化
  init(option) {
    this.$map = option.$map;
    this.$mapDrag = option.$mapDrag;
    this.unitSize = option.unitSize;
    this.cols = option.cols;
    this.rows = option.rows;
    this.dragY = option.dragY == undefined?true:false;
    this.$map.width = this.unitSize * this.cols;
    this.$map.height = this.unitSize * this.rows;

    this.createMap();
    this.initEvent(this.$mapDrag);
    //this.updateForbiddenPoint();
  }
  //创建地图
  createMap() {
    this.ctx = this.$map.getContext("2d");
    this.ctx.strokeStyle = "#555";
    this.ctx.lineWidth = 1;

    //画x坐标线
    for (let i = 0; i < this.cols; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.unitSize * i + 0.5, 0);
      this.ctx.lineTo(this.unitSize * i + 0.5, this.unitSize * this.rows + 0.5);
      this.ctx.stroke();
    }
    //画y坐标线
    for (let i = 0; i < this.rows; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, this.unitSize * i + 0.5);
      this.ctx.lineTo(this.unitSize * this.cols + 0.5, this.unitSize * i + 0.5);
      this.ctx.stroke();
    }

    //偏移0.5px来修复1px像素线bug,偏移后右/下线看不到,所以再补回来
    this.ctx.moveTo(0, this.unitSize * this.rows - 0.5);
    this.ctx.lineTo(this.unitSize * this.cols - 0.5, this.unitSize * this.rows - 0.5);
    this.ctx.stroke();
    this.ctx.moveTo(this.unitSize * this.cols - 0.5, 0);
    this.ctx.lineTo(this.unitSize * this.cols - 0.5, this.unitSize * this.rows - 0.5);
    this.ctx.stroke();
  }

  //初始化事件
  initEvent(touchArea) {
    let this_= this;
    let startX = 0;
    let startY = 0;

    let start = function(e) {
      e.stopPropagation();
      console.log("dragStart");
      let point = game.hasTouch ? e.touches[0] : e;
      startX = point.pageX - Number(touchArea.style.transform.split("px,")[0].split("(")[1]);
      startY = point.pageY - Number(touchArea.style.transform.split("px,")[1]);
      
      //拖拽人物
      // if(game.people.state=="moving"){
      //   let targetPoint = common.getMapPoint(e,game.map.unitSize,game.map.$mapDrag);
      //   if(common.indexOf2Array( [targetPoint.x,targetPoint.y], game.people.moveRange )!=-1){
      //     game.people.move(targetPoint);
      //   }else{
      //     game.people.state="";
      //     game.map.draw([],"clear")
      //   }
      // }
      
      touchArea.addEventListener(game.touchMove, move, false);
      touchArea.addEventListener(game.touchEnd, end, false);
    }

    let move = function(e) {
      let point = game.hasTouch ? e.touches[0] : e;
      e.preventDefault();
      
      if(this_.dragY){
        touchArea.style.transform = "translate3d(" + (point.pageX - startX) + "px," + (point.pageY - startY) + "px,0px);"
      }else{
        touchArea.style.transform = "translate3d(" + (point.pageX - startX) + "px,0px,0px)";
      }
    }

    let end = function(e) {
      touchArea.removeEventListener(game.touchStart, end, false);
      touchArea.removeEventListener(game.touchMove, move, false);
      touchArea.removeEventListener(game.touchEnd, end, false);
    }

    touchArea.addEventListener(game.touchStart, start, false);

  }

  //移动目标位置高亮
  showTargetPoint(point) {
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        if (x == point.x && y == point.y) {
          this.ctx.fillStyle = "#f00";
        } else {
          this.ctx.fillStyle = "#444";
        }
        this.ctx.fillRect(this.unitSize * point.x + 1, this.unitSize * point.y + 1, this.unitSize - 1, this.unitSize -
          1);
      }
    }
  }
  
  //绘制地图
  draw(ary, type) {
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        if (ary != undefined && common.indexOf2Array([x, y], ary) != -1) {
          this.ctx.fillStyle = type == "attackRange" ? "#f00" : "#479c41";
        }else{
          this.ctx.fillStyle = "#333";
        }
        this.ctx.fillRect(this.unitSize * x + 5, this.unitSize * y + 5, this.unitSize - 10, this.unitSize -
          10);
      }
    }
  }
  
  //更新禁止坐标
  updateForbiddenPoint(){
    this.forbiddenPoint=[];
    game.data.peos.forEach( peo=>{
      this.forbiddenPoint.push([peo.x,peo.y])
    })
  }

}
