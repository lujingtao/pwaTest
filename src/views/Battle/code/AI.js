//AI
import { getPeoSkills, o2o, getDataItem, getAtkResult, getPointUnit, getPointRange, getTriggerRangeUnits, getTriggerRange} from "@/class/Tool.js";
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
  start( cur, actionEndCallBack, aiEndcallBack ) {
    if(cur._state=="end"){
      if(aiEndcallBack) aiEndcallBack();
      return;
    }
    console.time('AI生成决策树耗时');
    this.tree = [];
    console.log(cur, cur.name, "开始行动");
    console.log("初始位置", [cur.x, cur.y]);
    // this.skills = getPeoSkills(cur);
    // console.log("获取所有技能", this.skills);
    cur._skills.forEach(skill => {
      this.createLeaf(cur, skill);
    });
    this.tree.sort((a, b) => b.score - a.score);
    console.warn( cur.name, "AI生成决策树", this.tree);
    console.timeEnd('AI生成决策树耗时');
    let action = this.getRandomAction(this.tree);
    cur.doAction( action.point, action.skill, ()=>{
      if( actionEndCallBack() ){ //如果游戏结束，则断开
        return;
      }
      if(cur._state=="end"){
        if(aiEndcallBack) aiEndcallBack();
      }else{
        this.start( cur, actionEndCallBack, aiEndcallBack)
      }
    } );
  }

  //获取单次决策队列
  createLeaf(cur, skill) {
    if (cur._ap < skill.ap) return;
    let leaf = {};
    //console.log("【", skill.type, "】当前ap，技能ap", cur._ap, skill.ap, );

    //如果是移动技能
    if (skill.id == -1) {
      let move = skill.move;
      let moveRange = cur.getMoveRange();

      //console.log("移动范围", moveRange);
      let nearestEnemy = this.getNearestEnemy(cur);
      let nearestDis = this.getDistance([cur.x, cur.y], [nearestEnemy.x, nearestEnemy.y]);
      //console.log("获取最近敌人", nearestEnemy, [nearestEnemy.x, nearestEnemy.y]);
      for (let p of moveRange) {
        let score = this.getMoveScore(cur, p, nearestEnemy, nearestDis);
        leaf = this.createAction(skill, p, score);
        this.tree.push(leaf);
        //console.warn("创建一个新叶子：", leaf);
      }
    } else if (skill.id != 99) {
      //其它技能
      let skillRange =  getDataItem("skillRange", skill.rangeID); //范围对象

      let effectiveRange = getPointRange([cur.x, cur.y], skillRange.effective, this.map);
      //console.log("技能有效范围：", effectiveRange)
      effectiveRange.forEach(p => {
        let triggerRange = getTriggerRange(p, skillRange, this.map);
        //console.log("技能执行范围：", triggerRange);
        let units = getTriggerRangeUnits( cur, triggerRange, skill, this.peos, this.elements, this.enemys );
        //console.log("技能执行范围内能实施的单位数组：", units);
        if (units.length == 0) return;
        let score = this.getActionScore(cur, p, units, skill);
        leaf = this.createAction(skill, p, score);
        this.tree.push(leaf);
        //console.warn("创建一个新叶子：", leaf);
      })
    } else {
      //结束技能
      leaf = this.createAction(skill, [cur.x, cur.y], 0);
      this.tree.push(leaf);
      //console.warn("创建一个新叶子：", leaf);
    }
  }

  //获取操作得分
  getActionScore(cur, p, units, skill) {
    let score = 0;
    //ai行为结算类型account 0：独立计算 1：伤害计算
    if (skill.account == 1) {
      units.forEach(unit => {
        score += this.getEstimateOneScore(cur, unit, skill);
      });

    } else {
      switch (skill.id) {
        case 17: //架盾
          score = 10;
          break;
        case 18: //下盾
          score = 0;
          break;
        default:
          break;
      }
    }
    return score;
  }

  //预估单个害值
  getEstimateOneScore(cur, unit, skill) {
    console.log("人员：", cur, "目标：", unit, "技能：", skill);
    let result = {
      bh: 0, //破马伤害
      ba: 0, //破甲伤害
      pa: 0, //穿甲伤害
      bs: 0, //破盾伤害
    }

    //没有武器装备，伤害为1
    if (!cur._equips.leftHand) {
      result.pa = 1;
      result.bh = 1;
      result.ba = 1;
      result.bs = 1;
      return result.pa;
    }
    let headPaDamage = this.getOnePaDamage(cur, unit, skill, "head");
    let bodyPaDamage = this.getOnePaDamage(cur, unit, skill, "body");
    console.log("预期穿甲伤害，头/身", headPaDamage, bodyPaDamage);

    let maxPa = headPaDamage > bodyPaDamage ? headPaDamage : bodyPaDamage;
    //穿甲得分为伤害占当前生命的百分比
    result.pa = maxPa / unit.hp * 100;

    console.log("预期单个分数：", result.pa);
    return result.pa;
  }

  //预算单个头部/身体伤害
  getOnePaDamage(cur, unit, skill, type) {
    let damge = 0;
    let atk = cur._a.atk;
    //目标没有传盔甲则穿甲率为100
    let pa = unit._equips[type] ? cur._equips.leftHand.pa : 100;
    //技能对穿甲加成
    pa = (skill.effect.pa ? pa + skill.effect.pa : pa) / 100;
    pa = pa > 1 ? 1 : pa;
    //技能攻击加成
    atk = skill.effect.atk ? atk + skill.effect.atk : atk;
    //技能命中加成
    let hit = cur._a.hit - unit._a.dod;
    hit = (skill.effect.hit ? hit + skill.effect.hit : hit) / 100;
    hit = hit > 1 ? 1 : hit;
    //技能爆头加成
    let hh = cur._a.hh - unit._a.hhb;
    hh = (skill.effect.hh ? hh + skill.effect.hh : hh) / 100;
    hh = hh > 1 ? 1 : hh;

    //伤害 = 攻击 * 穿甲 * 命中概率 * 爆头概率（身体或头部） * 系数（头部1.5,身体1）
    damge = Math.round(atk * pa * hit * (type == "body" ? 1 - hh : hh) * (type == "body" ? 1 : 1.5));
    //debugger
    return damge;
  }

  //获取单次移动分数
  getMoveScore(cur, m, nearestEnemy, nearestDis) {
    let score = 0;
    //则获取最近敌人及最短距离，目标点离最近敌人的距离越短，得分越大（最大为移动点数）
    let mDis = this.getDistance(m, [nearestEnemy.x, nearestEnemy.y]);
    //console.log("最近敌人距离，移动目标坐标", m, "和最近敌人距离", nearestDis, mDis);
    score = nearestDis - mDis;

    //判断身旁有多少敌人，每有一个敌人则：-基础分*命中概率50% =  -50 * 50% = -25;
    let roundEnemys = this.getRoundEnemys(cur);
    //console.log("周围敌人：", roundEnemys);
    if (roundEnemys.length > 0) {
      score += roundEnemys.length * -25
    }
    return score;
  }

  //从决策树中前3个决策按概率随机一个行动
  getRandomAction(tree) {
    
    let totalScore = 0;
    let randomAry = [];
    for (var i = 0; i < tree.length; i++) {
      if (i > 2 || tree[i].score<0 ) break;
      totalScore += tree[i].score;
    }
    
    if(totalScore == 0){
      console.log("决策树中前3个决策总分为0，返回第一个决策", 0);
      return tree[0];
    }

    for (var i = 0; i < tree.length; i++) {
      if (i > 2 || tree[i].score<0 ) break;
      randomAry.push([i, tree[i].score / totalScore])
    }
    let index = common.getNumberInAppoint(randomAry);
    console.log("决策树中前3个决策概率/随机结果", randomAry, index);
    return tree[index];
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
    let roundPoints = cur.getRoundPoints([cur.x, cur.y]);
    //console.log("获取四周坐标：", roundPoints);
    this.peos.forEach(peo => {
      common.indexOf2Array([peo.x, peo.y], roundPoints) !== -1;
      return;
      ary.push(peo);
    })
    return ary;
  }

  //创建一个操作
  createAction(skill, point, score) {
    return {
      skillName: skill.type,
      skill: skill,
      point: point,
      score: score,
    }
  }

}
