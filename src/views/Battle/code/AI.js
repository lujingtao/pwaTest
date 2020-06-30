//AI
import { getPeoSkills, o2o } from "@/class/Tool.js";
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
      console.log("初始位置",[cur.x,cur.y]);
      this.skills = getPeoSkills(cur);
      console.log("获取所有技能", this.skills);
      this.skills.forEach(skill => {
        console.warn(skill.type + "技能行动队列Start");
        this.getLeaf(cur, skill);
        console.warn(skill.type + "技能行动队列End");
      });
      console.log("AI生成决策树",this.tree);
    })
    console.timeEnd('AI生成决策树耗时')
  }

  //获取单次决策队列
  getLeaf(cur, skill) {
    let leaf = { actions: [], score: 0 };
    let ap = cur._ap;
    this.getActions(cur, ap, skill, leaf);
  }

  getActions(cur, ap, skill, leaf) {
    
    if (ap < skill.ap) return;
    console.log( "【",skill.type,"】当前ap，技能ap", ap,skill.ap,);
    ap = ap - skill.ap;
    
    //如果是移动技能
    if (skill.id == -1) {
      return;
      let move = skill.move;
      let moveRange = cur.getMoveRange(this.map);
      
      console.log("移动范围", moveRange);
      let nearestEnemy = this.getNearestEnemy(cur);
      let nearestDis = this.getDistance([cur.x,cur.y],[nearestEnemy.x,nearestEnemy.y]);
      console.log("获取最近敌人",nearestEnemy,[nearestEnemy.x,nearestEnemy.y]);
      for (let m of moveRange) {
        let score = this.getMoveScore(cur,m,nearestEnemy,nearestDis);
        let action = this.createAction(skill.id, m, score);
        let _leaf = JSON.parse(JSON.stringify(leaf));
        _leaf.actions.push(action);
        cur.x = m[0];
        cur.y = m[1];
        this.map.updateBanPoints(this.peos,this.enemys,this.elements);
        console.log("并添加操作",action,m);
        console.log("当前人物坐标：",[cur.x,cur.y]);
        for (let s of this.skills) {
          this.getActions(cur, ap, s, _leaf);
        };
      }
    } else if (skill.id != -2) { 
      //其它技能
      let skillRange = {}; //范围对象
      let o = data.skillRange.find( item=>item.id = skill.rangeID ); 
      o2o(o, skillRange);
      
      skillRange.effective.forEach( p=>{
        if(skillRange.trigger.length==0){
          //单体技能
          let unit = this.getPointUnit(p);
          console.log(unit);
          
        }else{
          //范围技能
        }
      })
      
      // let _leaf = JSON.parse(JSON.stringify(leaf));
      // _leaf.actions.push(this.createAction(0, [cur.x, cur.y], 0));
    } else { 
     //结束技能
    let _leaf = JSON.parse(JSON.stringify(leaf));
      _leaf.actions.push(this.createAction(skill.id, [cur.x, cur.y], 0));
      //计算单个叶子总分
      _leaf.actions.forEach(item=>{
        _leaf.score += item.score;
      })
      this.tree.push(_leaf);
      console.warn("创建一个新叶子：",_leaf);
    }
  }
  
  //获取单次移动分数
  getMoveScore(cur,m,nearestEnemy,nearestDis){
    let score = 0;
    //则获取最近敌人及最短距离，目标点离最近敌人的距离越短，得分越大（最大为移动点数）
    let mDis = this.getDistance(m,[nearestEnemy.x,nearestEnemy.y]);
    console.log("最近敌人距离，移动目标坐标",m,"和最近敌人距离",nearestDis,mDis);
    score = nearestDis - mDis;
    
    //判断身旁有多少敌人，每有一个敌人则：-基础分*命中概率50% =  -50 * 50% = -25;
    let roundEnemys = this.getRoundEnemys(cur);
    //console.log("周围敌人：", roundEnemys);
    if(roundEnemys.length>0){
      score += roundEnemys.length * -25
    }
    return score;
  }
  
  //获取指定坐标的单位
  getPointUnit(p){
    for (let u of this.peos) {
      if(u.x == p.x && u.y == p.y) return u;
    }
    for (let u of this.elements) {
      if(u.x == p.x && u.y == p.y) return u;
    }
    for (let u of this.enemys) {
      if(u.x == p.x && u.y == p.y) return u;
    }
    return 
  }
  
  //获取最近的敌人
  getNearestEnemy(cur){
    let nearstPeo = null;
    let dis = 999999;
    this.peos.forEach(peo=>{
      let _dis = this.getDistance([cur.x,cur.y],[peo.x,peo.y]);
      if( _dis <= dis ){
        dis = _dis;
        nearstPeo = peo;
      }
    })
    return nearstPeo;
  }
  
  //获取两点之间距离
  getDistance(p1,p2){
    return Math.abs(p1[0]-p2[0]) + Math.abs(p1[1]-p2[1]);
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
  createAction(skillID, movePoint, score) {
    return {
      skillID: skillID,
      movePoint: movePoint,
      score: score
    }
  }

}
