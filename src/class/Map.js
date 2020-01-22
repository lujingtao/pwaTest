//地图类
export default class Map {
  constructor($map) {
    this.$map = $map;
  }
  //创建地图
  createMap(map, unitSize, cols, rows) {
    var ctx = map.getContext("2d");
    ctx.strokeStyle = "#555";
    ctx.lineWidth = 1;

    //画x坐标线
    for (let i = 0; i < cols; i++) {
      ctx.beginPath();
      ctx.moveTo(unitSize * i + 0.5, 0);
      ctx.lineTo(unitSize * i + 0.5, unitSize * rows + 0.5);
      ctx.stroke();
    }
    //画y坐标线
    for (let i = 0; i < rows; i++) {
      ctx.beginPath();
      ctx.moveTo(0, unitSize * i + 0.5);
      ctx.lineTo(unitSize * cols + 0.5, unitSize * i + 0.5);
      ctx.stroke();
    }

    //偏移0.5px来修复1px像素线bug,偏移后右/下线看不到,所以再补回来
    ctx.moveTo(0, unitSize * rows - 0.5);
    ctx.lineTo(unitSize * cols - 0.5, unitSize * rows - 0.5);
    ctx.stroke();
    ctx.moveTo(unitSize * cols - 0.5, 0);
    ctx.lineTo(unitSize * cols - 0.5, unitSize * rows - 0.5);
    ctx.stroke();
  }
  
  //初始化事件
  initEvent(touchArea) {
    var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion);
    var hasTouch = 'ontouchstart' in window && !isTouchPad;
    var touchStart = hasTouch ? 'touchstart' : 'mousedown';
    var touchMove = hasTouch ? 'touchmove' : 'mousemove';
    var touchEnd = hasTouch ? 'touchend' : 'mouseup';
    var startX = 0;
    var startY = 0;
  
    var start = function(e) {
      console.log("touchStart");
      var point = hasTouch ? e.touches[0] : e;
      startX = point.pageX - Number(touchArea.style.left.replace("px", ""));
      startY = point.pageY - Number(touchArea.style.top.replace("px", ""));
    }
  
    var move = function(e) {
      var point = hasTouch ? e.touches[0] : e;
      e.preventDefault();
      touchArea.style.left = point.pageX - startX + "px";
      touchArea.style.top = point.pageY - startY + "px";
    }
    touchArea.addEventListener(touchStart, start, false);
    touchArea.addEventListener(touchMove, move, false);
  }
  
}
