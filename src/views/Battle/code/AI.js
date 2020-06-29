//AI
import { getPeoSkills } from "@/class/Tool.js";
import { getMoveRange } from "@/class/People.js";
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
    this.enemys.forEach(cur => {
      console.log(cur.name + "开始行动");
      this.skills = getPeoSkills(cur);
      console.log("获取所有技能", this.skills);
      this.skills.forEach(skill => {
        let leaf = this.getLeaf(cur, skill);
        if (leaf) this.tree.push(leaf);
      })
    })
  }

  //获取单次决策队列
  getLeaf(cur, skill) {
    let leaf = { actions: [], score: 0 };
    let ap = cur._ap;
    console.warn("创建单个行动队列");
    this.getActions(cur, ap, skill, leaf.actions);
    console.warn("结束单个行动队列",leaf.actions);
    //console.log("行动队列", leaf.actions);
    //leaf = this.getActions

    return leaf;
  }

  getActions(cur, ap, skill, actions) {
    console.log(ap,skill.ap,skill.type);
    if (ap < skill.ap) return;
    console.log("执行");

    //如果是移动技能
    if (skill.id == -1) {
      let move = skill.move;
      let moveRange = cur.getMoveRange(this.map);
      console.log("移动范围", moveRange);
      //判断身旁有多少敌人，每有一个敌人则：-基础分*命中概率50% =  -50 * 50% = -25;
      let roundEnemys = this.getRoundEnemys(cur);
      console.log("周围敌人：", roundEnemys);
      let score = Number(roundEnemys.length * -25);
      forMove:
      for (let m of moveRange) {
        let action = this.createAction(skill.id, m, score);
        actions.push(action);
        console.log("添加操作：",action);
        ap = ap - skill.ap;
        for (let s of this.skills) {
          let end = this.getActions(cur, ap, s, actions);
          if(end){
            return true;
            break;
          }
        };
      }
    } else if (skill.id != -2) { 
      actions.push(this.createAction(0, [cur.x, cur.y], 0));
    } else { //结束
      actions.push(this.createAction(skill.id, [cur.x, cur.y], 0));
      return true;
    }
  }

  //获取周围敌人
  getRoundEnemys(cur) {
    let ary = [];
    let roundPoints = cur.getRoundPoints([cur.x, cur.y], this.map);
    console.log("获取四周坐标：", roundPoints);
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
