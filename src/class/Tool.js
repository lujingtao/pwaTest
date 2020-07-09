//获取字段某表指定id项目
export function getDataItem(key, id) {
  let item = {};
  let o = data[key].find(e => e.id == id);
  o2o(o, item);
  return item;
}

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
  peo.x = 0;
  peo.y = 0;
  peo.buffs = [];
  peo.skills = [-1, 99]; //技能，默认添加移动和结束技能
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
        target[k] = eval(val);
      } else if (val.indexOf("{") != -1) {
        val = val.replace(/'/g, "\"");
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

//获取人员全部技能（默认增加移动技能和结束技能）
// export function getPeoSkills(peo) {
//   let leftHandSkills = peo._equips.leftHand ? peo._equips.leftHand.skills : [];
//   let rightHandSkills = peo._equips.rightHand ? peo._equips.rightHand.skills : [];
//   let skills = [];
//   let skillsIdAry = leftHandSkills.concat(rightHandSkills);
//   skillsIdAry.unshift("-1");
//   skillsIdAry.push("99");
//   skillsIdAry.forEach(id => {
//     let skill = {};
//     let o = data.skills.find(item => item.id == id);
//     o2o(o, skill);
//     skills.push(skill)
//   });
//   return skills;
// }

//获取指定坐标的单位
export function getPointUnit(p, peos, elements, enemys) {
  for (let u of peos) {
    if (u.x == p[0] && u.y == p[1]) return u;
  }
  for (let u of elements) {
    if (u.x == p[0] && u.y == p[1]) return u;
  }
  for (let u of enemys) {
    if (u.x == p[0] && u.y == p[1]) return u;
  }
  return
}

//获取技能执行范围内，技能类型及单位类型符合的单位数组 cur:执行主体
export function getTriggerRangeUnits(cur, range, skill, peos, elements, enemys) {
  let ary = [];
  range.forEach(point => {
    let unit = getPointUnit(point, peos, elements, enemys);
    if (!unit) return;
    if ((cur._type == "our" && unit._type == "enemy" && skill.class == 1) ||
      (cur._type == "our" && unit._type == "our" && skill.class == 0) ||
      (cur._type == "enemy" && unit._type == "our" && skill.class == 1) ||
      (cur._type == "enemy" && unit._type == "enemy" && skill.class == 0)
    ) {
      ary.push(unit)
    }
  })
  return ary;
}

//获取技能触发范围 p:指定技能范围一点
export function getTriggerRange(p, skillRange, map, cur) {
  let ary = [];
  if (skillRange.type == 1) {
    //触发范围类型：中心点
    return getPointRange(p, skillRange.trigger, map);
  } else if (skillRange.type == 2) {
    //触发范围类型：枚举
    for (let item of skillRange.trigger) {
      let pRange = getPointRange([cur.x, cur.y], item, map);
      if (common.indexOf2Array([cur.x, cur.y], pRange)) return pRange;
    }
  }
}

//获取指定坐标结合坐标数组计算后的最终坐标组
export function getPointRange(p, pAry, map) {
  let ary = [];
  pAry.forEach(item => {
    let _p = [item[0] + p[0], item[1] + p[1]];
    if (0 <= _p[0] && _p[0] < map.cols && 0 <= _p[1] && _p[1] < map.rows) {
      ary.push(_p)
    }
  })
  return ary
}

//获取攻击结果值
export function getAtkResult(cur, unit, skill) {
  console.log(unit);
  let result = {
    bh: 0, //破马伤害
    ba: 0, //破甲伤害
    pa: 0, //穿甲伤害
    bs: 0, //破盾伤害
  }
  //console.log("当前人员能力，目标能力", cur._a, unit._a);
  //damge = cur._a.atk * cur_a.pa / 100

  return result;
}
