//AI
import { getPeoSkills, o2o, getAtkResult } from "@/class/Tool.js";
export default class AI {
  constructor(option) {
    this.enemys = option.enemys; //敌方
    this.peos = option.peos;
    this.elements = option.elements; //决策树
    this.map = option.map;
    this.tree = []; //决策树
    this.skills = []; //所有技能
  }

  //开始
  start() {
    console.time('AI生成决策树耗时');
    console.log(this);

    this.enemys.forEach(cur => {
      console.log(cur.name + "开始行动");
      console.log("初始位置", [cur.x, cur.y]);
      this.skills = getPeoSkills(cur);
      console.log("获取所有技能", this.skills);
      this.skills.forEach(skill => {
        this.createLeaf(cur, skill);
      });
      this.tree.sort( (a,b)=> b.score - a.score);
      console.log("AI生成决策树", this.tree);
    })
    console.timeEnd('AI生成决策树耗时');
  }

  //获取单次决策队列
  createLeaf(cur, skill) {
    if (cur._ap < skill.ap) return;
    let leaf = {  };
    console.log("【", skill.type, "】当前ap，技能ap", cur._ap, skill.ap, );

    //如果是移动技能
    if (skill.id == -1) {
      let move = skill.move;
      let moveRange = cur.getMoveRange(this.map);

      console.log("移动范围", moveRange);
      let nearestEnemy = this.getNearestEnemy(cur);
      let nearestDis = this.getDistance([cur.x, cur.y], [nearestEnemy.x, nearestEnemy.y]);
      console.log("获取最近敌人", nearestEnemy, [nearestEnemy.x, nearestEnemy.y]);
      for (let p of moveRange) {
        let score = this.getMoveScore(cur, p, nearestEnemy, nearestDis);
        leaf = this.createAction(skill, p, score);
        this.tree.push(leaf);
        console.warn("创建一个新叶子：", leaf);
      }
    } else if (skill.id != -2) {
      //其它技能
      let skillRange = {}; //范围对象
      let o = data.skillRange.find(item => item.id == skill.rangeID);
      o2o(o, skillRange);

      let effectiveRange = this.getPointRange([cur.x, cur.y], skillRange.effective, this.map);
      console.log("技能有效范围：", effectiveRange)
      effectiveRange.forEach(p => {
        let triggerRange = this.getTriggerRange(p, skillRange);
        console.log("技能执行范围：", triggerRange);
        let units = this.getTriggerRangeUnits(triggerRange, skill);
        console.log("技能执行范围内能实施的单位数组：", units);
        if (units.length == 0) return;
        let score = this.getActionScore(cur, p, units, skill);
        leaf = this.createAction(skill, p, score);
        this.tree.push(leaf);
        console.warn("创建一个新叶子：", leaf);
      })
    } else {
      //结束技能
      leaf = this.createAction(skill, [cur.x, cur.y], 0);
      this.tree.push(leaf);
      console.warn("创建一个新叶子：", leaf);
    }
  }

  //获取操作得分
  getActionScore(cur, p, units, skill) {
    let score = 0;
    //ai行为结算类型account 0：独立计算 1：伤害计算
    if (skill.account == 1) {
      units.forEach(unit => {
        let damge = this.getEstimateOneDamage(cur, unit, skill);
        score += unit.hp - damge <=0?100:damge;
      });
      
    } else {
      switch (skill.id) {
        case 17: //架盾
          score = 10;
          break;
        default:
          break;
      }
    }
    return score;
  }

  //预估单个害值
  getEstimateOneDamage(cur, unit, skill) {
    let damge = 0;
    //没有武器装备，伤害为1
    if (!cur._equips.leftHand) {
      damge = 1;
    } else {
      let atk = cur._a.atk;
      //目标没有传盔甲则穿甲率为1，否则为武器穿甲率
      let pa = unit._equips.body ? cur._equips.leftHand.pa / 100 : 1;
      //技能对伤害的加成
      pa = skill.effect.pa ? pa + skill.effect.pa : pa;
      pa = pa > 1 ? 1 : pa;
      atk = skill.effect.atk ? pa + skill.effect.atk : atk;
      
      damge = Math.round(atk * pa);
    }
    console.log("预期单个伤害：",damge);
    return damge;
  }

  //获取单次移动分数
  getMoveScore(cur, m, nearestEnemy, nearestDis) {
    let score = 0;
    //则获取最近敌人及最短距离，目标点离最近敌人的距离越短，得分越大（最大为移动点数）
    let mDis = this.getDistance(m, [nearestEnemy.x, nearestEnemy.y]);
    console.log("最近敌人距离，移动目标坐标", m, "和最近敌人距离", nearestDis, mDis);
    score = nearestDis - mDis;

    //判断身旁有多少敌人，每有一个敌人则：-基础分*命中概率50% =  -50 * 50% = -25;
    let roundEnemys = this.getRoundEnemys(cur);
    //console.log("周围敌人：", roundEnemys);
    if (roundEnemys.length > 0) {
      score += roundEnemys.length * -25
    }
    return score;
  }


  //获取技能执行范围内，技能类型及单位类型符合的单位数组
  getTriggerRangeUnits(range, skill) {
    let ary = [];
    range.forEach(item => {
      let unit = this.getPointUnit(item);
      if (!unit) return;
      if ((unit.type == "peos" && skill.class == 1) ||
        unit.type == "enemys" && skill.class == 0) {
        ary.push(unit.unit)
      }
    })
    return ary;
  }

  //获取技能触发范围 p:指定技能范围一点
  getTriggerRange(p, skillRange) {
    let ary = [];
    if (skillRange.type == 1) {
      //触发范围类型：中心点
      return this.getPointRange(p, skillRange.trigger, this.map);
    } else if (skillRange.type == 2) {
      //触发范围类型：枚举
      for (let item of skillRange.trigger) {
        let pRange = this.getPointRange(p, item, this.map);
        if (common.indexOf2Array(p, pRange)) return pRange;
      }
    }
  }

  //获取坐标集合范围坐标计算后的最终坐标组
  getPointRange(p, pAry, map) {
    let ary = [];
    pAry.forEach(item => {
      let _p = [item[0] + p[0], item[1] + p[1]];
      if (0 <= _p[0] && _p[0] < map.cols && 0 <= _p[1] && _p[1] < map.rows) {
        ary.push(_p)
      }
    })
    return ary
  }

  //获取指定坐标的单位
  getPointUnit(p) {
    for (let u of this.peos) {
      if (u.x == p[0] && u.y == p[1]) return { type: "peos", unit: u };
    }
    for (let u of this.elements) {
      if (u.x == p[0] && u.y == p[1]) return { type: "elements", unit: u };
    }
    for (let u of this.enemys) {
      if (u.x == p[0] && u.y == p[1]) return { type: "enemys", unit: u };
    }
    return
  }

  //获取最近的敌人
  getNearestEnemy(cur) {
    let nearstPeo = null;
    let dis = 999999;
    this.peos.forEach(peo => {
      let _dis = this.getDistance([cur.x, cur.y], [peo.x, peo.y]);
      if (_dis <= dis) {
        dis = _dis;
        nearstPeo = peo;
      }
    })
    return nearstPeo;
  }

  //获取两点之间距离
  getDistance(p1, p2) {
    return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
  }

  //获取周围敌人
  getRoundEnemys(cur) {
    let ary = [];
    let roundPoints = cur.getRoundPoints([cur.x, cur.y], this.map);
    //console.log("获取四周坐标：", roundPoints);
    this.peos.forEach(peo => {
      common.indexOf2Array([peo.x, peo.y], roundPoints) !== -1;
      return;
      ary.push(peo);
    })
    return ary;
  }

  //创建一个操作
  createAction(skill, movePoint, score) {
    return {
      skillName:skill.type,
      skill:skill,
      movePoint: movePoint,
      score: score,
    }
  }

}
