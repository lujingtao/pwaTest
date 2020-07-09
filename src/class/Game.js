import Map from '../class/Map.js';

export default class Game {
  constructor() {
    this.hasTouch = '';
    this.touchStart = '';
    this.touchMove = '';
    this.touchEnd = '';
    this.saveFiles = []; //所有存档
    this.curSave = null; //当前存档内容
    this.peosUpdateCount = 8; //人员刷新数量
    this.goodsUpdateCount = 20; //商品刷新数量
    this.animateTimer = null; //战斗场景人物动画计时器
    this.animateDuration = 0;  //战斗场景人物动画时长
  }
  //初始化
  init() {
    let isTouchPad = (/hp-tablet/gi).test(navigator.appVersion);
    this.hasTouch = 'ontouchstart' in window && !isTouchPad;
    this.touchStart = this.hasTouch ? 'touchstart' : 'mousedown';
    this.touchMove = this.hasTouch ? 'touchmove' : 'mousemove';
    this.touchEnd = this.hasTouch ? 'touchend' : 'mouseup';

    this.initSaveFiles();
  }

  //存档、载档 ==================
  //获取已有存档
  initSaveFiles() {
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key.indexOf("myGameSave_File_") != -1) {
        let id = key.split("myGameSave_File_")[1];
        let file = this.load(id);
        game.saveFiles.push({
          id:file.id,
          name:file.name,
          gameDate:file.gameDate,
          saveTime:file.saveTime
        });
      }
    }
  };
  
  //获取存档最大id
  getMaxSaveId(){
    let max = 0;
    game.saveFiles.forEach(item=>{
      max = item.id>max?item.id:max;
    });
    return max;
  }

  //存档、载档
  save(savefileId, json, callback) {
    json.saveTime = (new Date()).toLocaleString();
    var key = this.webStorageKey(savefileId);
    var data = LZString.compressToBase64(JSON.stringify(json));
    localStorage.setItem(key, data);
    if (!!callback) { callback() }
  };

  load(savefileId) {
    var key = this.webStorageKey(savefileId);
    var data = localStorage.getItem(key);
    if(data){
      return JSON.parse(LZString.decompressFromBase64(data));
    }else{
      console.warn("读取存档失败，找不到id为"+savefileId+"的存档。");
      return undefined
    }
    
  };

  removeSave(savefileId) {
    var key = this.webStorageKey(savefileId);
    localStorage.removeItem(key);
  };

  webStorageKey(savefileId) {
    if (savefileId < 0) {
      return 'myGameSave_Config';
    } else if (savefileId === 0) {
      return 'myGameSave_Global';
    } else {
      return 'myGameSave_File_' + savefileId;
    }
  };


}
