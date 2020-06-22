(function() {
  //按钮类
  var common = window.common = {
    //获取随机数
    random: function(min, max) {
      return Math.round((Math.random() * (max - min)) + min);
    },
    //返回所在二维数字内的位置
    indexOf2Array: function(arry, towArrys) {
      for (let i = 0; i < towArrys.length; i++) {
        if (towArrys[i][0] == arry[0] && towArrys[i][1] == arry[1]) {
          return i;
        }
      }
      return -1;
    },
    //新建tap事件
    tap: function(callBack, ev, time) {
      ev.stopPropagation();
      var isMove = false;
      var $target = $(ev.target);
      var startPoint = {};
      var nowPoint = {};
      time = time == undefined ? 200 : time;
      $target.addClass("touchOn");
      startPoint = {
        x: ev.originalEvent.targetTouches[0].pageX,
        y: ev.originalEvent.targetTouches[0].pageY
      };
      $target.on("touchmove", function() {
        isMove = true;
      });
      $target.on("touchend", function(evEnd) {
        evEnd.stopPropagation();
        $target.removeClass("touchOn");
        $target.off("touchend");
        $target.off("touchmove");
        nowPoint = {
          x: evEnd.originalEvent.changedTouches[0].pageX,
          y: evEnd.originalEvent.changedTouches[0].pageY
        };
        //if(isMove) return;
        if (Math.abs(nowPoint.x - startPoint.x) < 5 && Math.abs(nowPoint.y - startPoint.y) < 5) {
          setTimeout(function() {
            callBack(ev)
          }, time);
        }
      });
    },


    /**
     * 生成不重叠坐标
     * min,max 坐标范围
     * ary 已有坐标数组
     * */
    creatPoint: function(min, max, ary) {
      if(ary.length>=Math.pow(max+1,2)){
        console.error("坐标已填满数组,计算超出范围!");
        return null
      }
      var p = [common.random(min, max), common.random(min, max)];
      if (common.indexOf2Array(p, ary) != -1) {
        p = common.creatPoint(min, max, ary);
      }
      return p;
    },
    //去掉所有的html标记
    removeHtmlTag: function(str) {
      return str.replace(/<[^>]+>/g, "");
    },
    //格式化游戏时间
    formatDate: function(date) {
      var d = parseInt(date / 24);
      var h = date % 24;
      return d + "天" + h + "时";
    },
    //格式化时间(秒)
    formatTime: function(time) {
      var m = parseInt(time / 60);
      var s = time % 60;
      return m + "分" + s + "秒";
    },

    //随机生成人名
    createRandomName: function() {
      var familyNames = new Array(
        "赵", "钱", "孙", "李", "周", "吴", "郑", "王", "冯", "陈",
        "褚", "卫", "蒋", "沈", "韩", "杨", "朱", "秦", "尤", "许",
        "何", "吕", "施", "张", "孔", "曹", "严", "华", "金", "魏",
        "陶", "姜", "戚", "谢", "邹", "喻", "柏", "水", "窦", "章",
        "云", "苏", "潘", "葛", "奚", "范", "彭", "郎", "鲁", "韦",
        "昌", "马", "苗", "凤", "花", "方", "俞", "任", "袁", "柳",
        "酆", "鲍", "史", "唐", "费", "廉", "岑", "薛", "雷", "贺",
        "倪", "汤", "滕", "殷", "罗", "毕", "郝", "邬", "安", "常",
        "乐", "于", "时", "傅", "皮", "卞", "齐", "康", "伍", "余",
        "元", "卜", "顾", "孟", "平", "黄", "和", "穆", "萧", "尹"
      );
      var givenNames = new Array(
        "子", "淼", "国", "夫", "堂", "甜", "敏", "尚", "贤", "祥",
        "轩", "易", "辰", "帆", "冉", "瑾", "昆", "齐", "杨", "文",
        "东", "雄", "浩", "熙", "溶", "枫", "欣", "豪", "慧", "政",
        "美", "慧", "岩", "杰", "源", "忠", "润", "汝", "嘉", "新",
        "建", "亦", "林", "冰", "佳", "涵", "禹", "淳", "泽", "洋",
        "越", "昊", "翔", "华", "晶", "凌", "溪", "涛", "怡", "毅",
        "屇", "琪", "紫", "瑞", "昕", "萌", "明", "宜", "远", "阔",
        "羽", "惠", "晨", "一", "震", "鑫", "君", "京", "莎", "汕",
        "钰", "区", "庆", "鸣", "语", "池", "添", "海", "雅", "蛮",
        "清", "诗", "乐", "典", "赫", "傲", "龙", "飞", "云", "坡"
      );
      var i = parseInt(Math.random() * 100);
      var familyName = familyNames[i];
      var j = parseInt(Math.random() * 100);
      var givenName = givenNames[j];
      return familyName + givenName;
    },
    //生成不重复id
    createUniqueId: function() {
      return Number(Math.random().toString().substr(3, 5) + Date.now()).toString(36)
    },

    //返回点击坐标
    getPoint: function(event) {
      var point = {};
      if (event.clientX != undefined) {
        point.x = event.clientX;
        point.y = event.clientY;
      } else {
        point.x = event.targetTouches[0].pageX;
        point.y = event.targetTouches[0].pageY;
      }
      return point;
    },
    //返回指定地图所在的坐标
    getMapPoint: function(event, unitSize, obj) {
      var point = common.getPoint(event);
      point.x = parseInt((point.x - obj.offsetLeft) / unitSize);
      point.y = parseInt((point.y - obj.offsetTop) / unitSize);
      return point;
    },
    //检测碰撞, a碰撞b , 误差n
    checkImpact: function(a, b, n) {
      n = n == undefined ? 0 : n;
      if (a.x - n >= b.x - a.width && a.x + n <= b.x + b.width && a.y - n >= b.y - a.height && a.y + n <= b.y + b
        .height) {
        return true;
      } else {
        return false;
      }
    },
    //获取符合正太分布随机值
    getNumberInNormalDistribution: function(mean, std_dev) {
      var u = 0.0,
        v = 0.0,
        w = 0.0,
        c = 0.0;
      do {
        u = Math.random() * 2 - 1.0;
        v = Math.random() * 2 - 1.0;
        w = u * u + v * v;
      } while (w == 0.0 || w >= 1.0)
      c = Math.sqrt((-2 * Math.log(w)) / w);
      return Math.round(mean + (u * c * std_dev));
    },
    //获取符合指定概率分布随机值 getNumberInAppoint([[0,0.7],[1,0.2],[2,0.1]]);
    getNumberInAppoint: function(ary) {
      var rand = Math.random();
      for (let i = 0; i < ary.length; i++) {
        var pro = 0;
        for (let j = 0; j <= i; j++) {
          pro += ary[j][1];
        }
        if (rand < pro) return ary[i][0];
      }
    },
    //获取符合概率递减分布随机值
    /*思路：例如生成随机数 1-3 符合概率递减
        getNumberInDecrement(3);
        则 3x+2x+1x = 100%，计算x值
        然后创建随机数rand，如果在 rand<3x%则返回1
        如果 rand< 1-(3x+2x)% 则返回2
        如果 rand< 1-(3x+2x+1x)% 则返回3
    */
    getNumberInDecrement: function(num) {
      var rand = Math.random();
      var count = 0;
      for (let i = 1; i <= num; i++) {
        count += i;
      }
      var x = 1 / count;
      for (let i = 1; i <= num; i++) {
        var xCount = 0;
        for (let j = 1; j < (num + 1 - i); j++) {
          xCount += j;
        }
        if (rand < (1 - x * xCount)) return i;
      }
    },
    
    //根据typeid获取类型名称
    getTypeName: function(table,typeId) {
      return data[table].find( item=> item.id==typeId).type;
    },
    
    //根据goodsId获取物品对象
    getGoods: function(goodsId,list) {
      if(goodsId==""||goodsId==undefined) return undefined;
      return game.curSave[list].find( item=>item.id==goodsId );
    },
    
    
  }
})();


/* 正太分布测试
   var ary = new Array(1000);
   for (let j = 0; j < ary.length; j++) {
       ary[j]=common.getNumberInNormalDistribution(2,1);
   }
   ary.sort(function(a,b){ return a-b });//从小到大排序
   ary.forEach(e=>{ if(Math.abs(e)==0){console.log(0)}else{console.log(e)} })
*/
