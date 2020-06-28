//创建人物
export function createPeo(type) {
  let peo = {};
  //先生成类别，根据类别赋予属性，再生成覆盖属性
  peo.type = type;
  let o = data.peos.find(e => e.id == peo.type);
  o2o(o, peo);
  //增加潜力
  peo.poten = { hp: 0, pow: 0, agi: 0, skill: 0, luck: 0, will: 0, endu: 0 };
  for (let s in peo.poten) {
    peo.poten[s] = common.getNumberInAppoint([
      [0, 0.3],
      [1, 0.4],
      [2, 0.2],
      [3, 0.1]
    ]);
  }
  peo.type = peo.id;
  peo.id = common.createUniqueId();
  peo.name = common.createRandomName();
  peo.level = 0;
  peo.exp = 0;
  peo.hpMax = peo.hp;
  peo.equip = {
    head: '',
    other: '',
    body: '',
    leftHand: '',
    rightHand: '',
  };
  peo.x = 0,
    peo.y = 0,
    //数据统计相关
    peo.battles = 0;
  peo.kills = 0;
  peo.damages = 0;
  peo.hits = 0; //命中
  peo.dodges = 0; //闪避
  peo.crits = 0; //暴击
  return peo;
}


//创建物品
export function createGood(type) {
  let good = {};
  //先生成类别，根据类别赋予属性，再生成覆盖属性
  good.type = type;
  let o = data.goods.find(e => e.id == good.type);
  o2o(o, good);
  good.type = good.id;
  good.id = common.createUniqueId();
  good.name = common.getTypeName("goods", good.type) + good.qua.toString();
  good.durMax = good.dur;
  return good;
}

//根据数据表赋给对象属性和值
export function o2o(source, target) {
  for (let k in source) {
    let val = source[k];
    if (isNaN(val)) {
      //数字范围
      if (val.indexOf("~") != -1 && k != "range") {
        let ary = val.split("~");
        target[k] = common.random(Number(ary[0]), Number(ary[1]))
      } else if (val.indexOf("[") != -1) {
        //数组
        val = val.replace("[", "").replace("]", "");
        if (val == "") {
          target[k] = [];
        } else {
          target[k] = val.split(",");
        }
      } else if (val.indexOf("{") != -1) {
        val = val.replace(/'/g,"\"");
        //对象
        target[k] = JSON.parse(val);
      } else {
        //字符串，描述部分读取字典表
        if (k != "des") target[k] = val;
      }
    } else {
      //数字类型
      target[k] = Number(val);
    }

  }
}
