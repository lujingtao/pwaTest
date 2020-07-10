<template>
  <div components="Battle" class="battle">
    <!-- 顶部状态条 -->
    <div class="topBar" :class="round%2==0?'enemyRound':''">
      <span class="round">第{{round}}回合 [ {{round%2==0?'敌方':'我方'}} ]</span>
    </div>
    <!-- 当前人员状态 -->
    <PeoStatus v-if="curPeo" :peo="curPeo"></PeoStatus>
    <div id="mapWrap">
      <div id="mapDrag" style="transform: translate3d(0px,0px,0px);">
        <div id="mapIn">
          <!-- 地图 -->
          <canvas id="map"></canvas>
          <!-- 地图上的元素 -->
          <ul class="elements">
            <li v-for="item in elements" :key="item.id" :id="item.id" :style="{'width':unitSize+'px','height':unitSize+'px','left':unitSize*item.x+'px','top':unitSize*item.y+'px','fontSize':unitSize+'px','lineHeight':unitSize+'px'}">
              <i :class="['iconfont','icon-map-ele-'+item.type]"></i>
            </li>
          </ul>
          <!-- 敌人 -->
          <ul class="peos enemys">
            <li v-for="peo in enemys" :key="peo.id" :id="peo.id" :class="[curPeo==peo?'active':'', peo._state=='end'?'end':'']"
              :style="{'width':unitSize+'px','height':unitSize+'px','left':unitSize*peo.x+'px','top':unitSize*peo.y+'px','fontSize':unitSize+'px'}">
              <Peo :peo="peo"></Peo>
              <span class="hit" v-if="curPeo && common.indexOf2Array([peo.x,peo.y], curPeo._actionRange) != -1">{{(curPeo.hit - peo.dod)+"%"}}</span>
            </li>
          </ul>
          <!-- 我方人员 -->
          <ul class="peos myTeam">
            <li v-for="peo in peos" :key="peo.id" :id="peo.id" :class="[curPeo==peo?'active':'', peo._state=='end'?'end':'']"
              :style="{'width':unitSize+'px','height':unitSize+'px','left':unitSize*peo.x+'px','top':unitSize*peo.y+'px','fontSize':unitSize+'px'}">
              <Peo :peo="peo"></Peo>
            </li>
          </ul>
          <!-- 地图覆盖层，用于地图交互 -->
          <section id="mapMask" @touchstart.stop="click_map($event)"></section>
        </div>
      </div>
    </div>

    <!-- 技能 -->
    <div class="skills">
      <ul v-if="curPeo">
        <li v-for="skill in curPeo._skills" :key="skill.id" @click="click_skill(skill)" :class="curSkill==skill?'cur':''"
          :style="{'width':unitSize+'px','height':unitSize+'px','fontSize':unitSize+'px','lineHeight':unitSize+'px'}">
          <div :class="['in',(curPeo._state=='end' || curPeo._ap < skill.ap)?'disabled':'']">
            <span class="peoAP">
              <i v-for="i in skill.ap"><s></s></i>
            </span>
            <span class="name">{{skill.type}}</span>
          </div>
        </li>
      </ul>
    </div>

    <!-- 底部按钮 -->
    <BottomBtns :curPeo="curPeo" :round="round" @click_cancle="click_cancle" @click_end="click_end"></BottomBtns>
    <FooterNav></FooterNav>

    <!-- 透明遮罩层（用于执行行动动画时，页面所有元素不能交互） -->
    <div id="animateMask"></div>
    
    
  </div>
</template>

<script>
  import People from '@/class/People.js';
  import Peo from '@/components/Peo.vue';
  import BottomBtns from './components/BottomBtns.vue';
  import PeoStatus from '@/views/Team/components/PeoStatus.vue';
  import Map from "@/class/Map.js";
  import { createPeo, createGood, getPeoSkills, getPointUnit } from "@/class/Tool.js";
  import AI from './code/AI.js';
  export default {
    components: { Peo, PeoStatus, BottomBtns },
    data() {
      return {
        peos: [], //我方人员
        enemys: [], //临时生成敌人
        elements: [], //临时生成的地图上的元素（障碍物等）
        curPeo: null, //当前人员
        unitSize: 0, //地图单位尺寸
        skills: [], //当前人员所主动技能
        curSkill: null, //当前技能
        round: 0, //当前回合，单数我方，双数敌方
      }
    },
    created() {
      this.enemyGoods = []; //存储临时生成的敌人装备，用于结算奖励
      this.mapDiv = 9; //横向屏幕划分多少份
      this.mapSize = { xMax: this.mapDiv - 1, yMax: this.mapDiv - 1 };
      this.map = new Map;
      this.initPeos();
      this.initEnemys();
      this.initElements(); //初始化地图元素（障碍物等）
    },
    mounted() {
      this.$map = document.getElementById("map");
      //this.$mapMask = document.getElementById("mapMask");
      this.initMap();

      this.AI = new AI({
        enemys: this.enemys,
        peos: this.peos,
        elements: this.elements,
        map: this.map,
      });

      this.nextRound();
    },
    methods: {

      //点击技能
      click_skill(skill) {
        this.curPeo.cancle();
        if (this.curPeo._state == "end" || this.curPeo._ap < skill.ap) return;
        this.curSkill = skill;
        this.curPeo.updateAbility(skill);
        if (skill.id == -1) {
          this.curPeo.creatMoveRange();
        } else{
          if(skill.rangeID==0){ //自身使用技能
            this.curPeo.doAction([this.curPeo.x,this.curPeo.y], this.curSkill, this.actionCallBack)
          }else{
            this.curPeo.creatSkillRange(skill);
          }
        }
      },

      //地图点击事件
      click_map(e) {
        //敌方回合点击无效
        if (this.round % 2 == 0) return;
        let point = common.getMapPoint(e, this.unitSize, document.getElementById("mapWrap"));
        let unit = getPointUnit(point, this.peos, this.elements, this.enemys);
        console.log("点击坐标：", point, "坐标单位：", unit);

        //已有人员激活
        if (this.curPeo) {
          //如果是移动状态
          if (this.curPeo._state == "moveRange") {
            if (common.indexOf2Array(point, this.curPeo._moveRange) != -1) {
              //如果是敌人则无效
              if (this.curPeo._type == "enemy") return;
              this.curPeo.doAction(point, this.curSkill, this.actionCallBack)
            } else {
              this.checkUnit(unit);
            }
          } else {
            //如果是行动状态
            if (common.indexOf2Array(point, this.curPeo._actionRange) != -1) {
              //如果是敌人则无效
              if (this.curPeo._type == "enemy") return;
              this.curPeo.doAction(point, this.curSkill, this.actionCallBack)
            } else {
              this.checkUnit(unit);
            }
          }
        } else {
          //没有人员激活
          this.checkUnit(unit)
        }

      },
      
      //执行动作后的回调事件
      actionCallBack(){
        this.curSkill = null;
        if( !this.isGameOver() ){
          this.setEnd(this.peos);
          if (this.isRoundEnd(this.peos)) {
            this.nextRound()
          }
        }
      },
      
      //根据当前Ap情况自动结束自身回合
      setEnd(ary){
        ary.forEach(peo=>{
          let end = true;
          for (let i = 0; i < peo._skills.length-1; i++) {
            if( peo._ap>0 && peo._skills[i].ap <= peo._ap){
              end = false;
              break;
            }
          }
          peo._state = end?"end":peo._state;
        })
      },

      //删除阵亡单位
      removeDieUnit(ary) {
        for (let i = ary.length - 1; i >= 0; i--) {
          if (ary[i].hp <= 0) {
            ary.splice(i, 1);
            this.map.updateBanPoints(this.peos, this.elements, this.enemys);
          }
        }
      },

      //是否游戏结束
      isGameOver() {
        this.removeDieUnit(this.peos);
        this.removeDieUnit(this.enemys);
        if( this.peos.length>0 || this.enemys.length>0 ) return;
        let winer = this.peos.length == 0?2:1;
        let str = winer==1?"战斗结束，我方胜利":"战斗结束，我方失败";
        this.$dialog.alert({
          message: str,
        }).then(() => {
          this.$router.push({name:'BattleEnd', params:{ peos:this.peos, enemyGoods:this.enemyGoods}}))
        });
        return true;
      },

      //检测点击点是否存在单位
      checkUnit(unit) {
        if (unit) {
          this.click_unit(unit)
        } else {
          this.click_cancle()
        }
      },

      //点击单位
      click_unit(unit) {
        if (unit._type == "our" || unit._type == "enemy") {
          this.curPeo = unit;
          //this.skills = getPeoSkills(this.curPeo);
          this.click_skill(this.curPeo._skills[0])
        } else {
          this.click_cancle()
        }
      },

      //初始化我方
      initPeos() {
        game.curSave.myTeam.forEach(peo => {
          let peoClone = JSON.parse(JSON.stringify(peo));
          peoClone.__proto__ = new People;
          peoClone.init("our", this.map, this.peos, this.elements, this.enemys);
          this.peos.push(peoClone);
        });
        console.log("我方", this.peos);
        this.putPeos("myTeam");
      },

      //初始化敌方
      initEnemys() {
        // 根据据点规模生成不同类型敌人
        let size = game.curSave.curNode.size;
        game.battleTempEnemys = [];
        console.log("据点规模：", size);
        let types = [0, 1, 8, 9, 10]; //敌人类型
        let myTeamCount = game.curSave.myTeam.length;
        let count = common.random(myTeamCount - 1, myTeamCount);
        if (size == 2) count = myTeamCount;
        if (size == 3) {
          types = [0, 1, 4, 6, 7, 8, 9, 10];
          count = common.random(myTeamCount, myTeamCount + 1)
        }
        if (size == 4) {
          types = [0, 1, 2, 3, 4, 6, 7, 8, 9, 10];
          count = common.random(myTeamCount, myTeamCount + 2)
        }
        if (size == 5) {
          types = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
          count = common.random(myTeamCount + 2, myTeamCount + 4)
        }

        //调试模式，只有二个敌人
        count = 2;
        for (var i = 0; i < count; i++) {
          let type = types[common.random(0, types.length - 1)];
          let peo = createPeo(type);
          game.battleTempEnemys.push( JSON.parse(JSON.stringify(peo)) );
          peo.__proto__ = new People;
          peo.init("enemy", this.map, this.peos, this.elements, this.enemys);
          this.createEnemyEquips(peo);
          peo.updateAbility();
          this.enemys.push(peo);
        }
        this.putPeos("enemys");
        console.log("生成敌方：", this.enemys);
      },

      //根据敌方类型创建装备并穿戴
      createEnemyEquips(peo) {
        //低级敌人（农民等）穿戴轻型装备，中级敌人--中型装备，高级敌人--重型装备
        if ([0, 1, 8, 9, 10].indexOf(peo.type) != -1) {
          this.createEnemyEquip(peo, 0)
        } else if ([4, 6, 7].indexOf(peo.type) != -1) {
          this.createEnemyEquip(peo, 1)
        } else {
          this.createEnemyEquip(peo, 2)
        }
      },

      //根据敌方级别创建装备并穿戴
      createEnemyEquip(peo, grade) {
        let headTypes = [
          [11],
          [11, 12],
          [12, 13]
        ][grade];
        let bodyType = [
          [8],
          [8, 9],
          [9, 10]
        ][grade];
        let leftHandType = [
          [17, 18, 19, 20, 21],
          [18, 19, 20, 21, 23],
          [18, 19, 20, 21, 22, 23]
        ][grade];
        let rightHandType = [
          [14],
          [14, 15],
          [15, 16]
        ][grade];

        let head = (grade == 0 && common.random(0, 1) || grade > 0) ? createGood(headTypes[common.random(0, headTypes.length -
          1)]) : undefined;
        let body = createGood(bodyType[common.random(0, bodyType.length - 1)]);
        let leftHand = createGood(leftHandType[common.random(0, leftHandType.length - 1)]);
        //如果是单手武器，则可能穿戴盾牌
        let rightHand = undefined;
        if (leftHand.th == 0) {
          rightHand = common.random(0, 1) == 1 ? createGood(rightHandType[common.random(0, rightHandType.length - 1)]) :
            undefined;
        }

        this.peoAddEquip(peo, "head", head);
        this.peoAddEquip(peo, "body", body);
        this.peoAddEquip(peo, "leftHand", leftHand);
        this.peoAddEquip(peo, "rightHand", rightHand);
      },

      //敌方人物穿戴装备
      peoAddEquip(peo, key, equip) {
        if (!equip) return;
        peo.addEquip(key, equip);
        this.enemyGoods.push(equip)
      },

      //初始化地图元素（障碍物等）
      initElements() {
        let maxCount = parseInt(((this.mapSize.xMax + 1) * (this.mapSize.yMax + 1) - this.peos.length - this.enemys.length) /
          5); //生成数量

        let count = common.random(parseInt(maxCount / 2), maxCount);
        //调试，count=0
        count = 0;

        for (let i = 0; i < count; i++) {
          let point = common.creatPoint(this.mapSize.xMax, this.mapSize.yMax, this.map.banPoints);
          //地图类型，10~19障碍物，20~29可覆盖物体（草、水等）
          let types = [10, 11, 20, 21, 22];
          let ele = {
            id: common.createUniqueId(),
            type: types[common.random(0, types.length - 1)],
            x: point[0],
            y: point[1],
            _type: "element"
          }
          this.elements.push(ele);
          this.map.banPoints.push([ele.x, ele.y]);
        }
      },

      //放置人员
      putPeos(type) {
        let y = type == "myTeam" ? this.mapSize.yMax : 0;
        let ary = type == "myTeam" ? this.peos : this.enemys;
        let start = parseInt(((this.mapSize.xMax + 1) - ary.length) / 2);
        start = start < 0 ? 0 : start;
        ary.forEach((p, i) => {
          p.x = start + i;
          p.y = y;
          this.map.banPoints.push([p.x, p.y]);
        })
      },

      //初始化地图
      initMap() {
        let option = {};
        option.peos = this.peos;
        option.elements = this.elements;
        option.enemys = this.enemys;
        option.$map = this.$map;
        let docWidth = document.documentElement.clientWidth;
        this.unitSize = option.unitSize = parseInt(docWidth / this.mapDiv);
        option.cols = Math.round((this.mapSize.xMax + 1) * 1);
        option.rows = Math.round((this.mapSize.yMax + 1) * 1);
        this.map.init(option);
        
        //this.$mapMask.addEventListener(game.touchStart, this.click_map)
      },

      //下一回合
      nextRound() {
        this.round++;
        console.warn("第" + this.round + "回合，" + (this.round % 2 == 0 ? "敌方" : "我方") + "开始");
        if (this.round % 2 == 0) {
          this.resetStatusAndCheckBuffs(this.enemys)
          this.AI.start(this.enemys[0], this.isGameOver, () => {
            this.aiEndCallBack(0)
          });
        } else {
          this.resetStatusAndCheckBuffs(this.peos)
        }
      },

      //ai回调
      aiEndCallBack(i) {
        i++;
        if (this.isRoundEnd(this.enemys)) {
          this.nextRound();
          return;
        }
        this.AI.start(this.enemys[i], this.isGameOver, () => {
          this.aiEndCallBack(i)
        });
      },

      //检查是否回合结束
      isRoundEnd(ary) {
        let count = ary.length;
        ary.forEach(peo => {
          if (peo._state == "end") {
            count--;
          }
        });
        return count <= 0
      },

      //重置ap和状态
      resetStatusAndCheckBuffs(units) {
        units.forEach(unit => {
          unit.resetStatus();
          unit.checkBuffs();
        })
      },

      //点击取消按钮
      click_cancle() {
        if (this.curPeo) {
          this.curPeo.cancle();
          this.curPeo = null;
        }
        this.curSkill = null;
        this.skills = [];
      },

      //点击结束回合按钮
      click_end() {
        this.peos.forEach(peo=>{
          peo.action_end()
        })
        this.click_cancle();
        this.nextRound();
      },

    },
    beforeDestroy() {
    }
  }
</script>

<style lang="scss">
  .battle {
    height: 100%;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;

    .topBar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      font-size: 12px;
      height: 18px;
      line-height: 18px;
      border-top: 4px #0077AA solid;

      .round {
        display: inline-block;
        background: #0077AA;
        padding: 0 10px;
        border-radius: 0 0 5px 5px;
      }

    }

    .topBar.enemyRound {
      border-top-color: #AA0000;

      .round {
        background: #AA0000;
      }
    }

    #mapIn {
      position: relative;
    }

    #map {
      display: block;
    }

    #mapMask {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
    }

    .elements {
      >li {
        position: absolute;

        .iconfont {
          font-size: 1em;
          color: #444;
        }
      }
    }

    .peos {
      >li {
        display: inline-block;
        position: absolute;
        opacity:1;
        transform:rotate(0deg) scale(1,1);

        .name {
          display: none;
        }
      }

      .peo {
        background: #0077AA;
      }

      .active {
        background: #f60;
      }

      .end {
        .peo .mask {
          display: block;
        }
      }

      .hit {
        font-size: .4em;
        position: absolute;
        left: 0;
        right: 0;
        top: 31%;
        //text-shadow: 1px 1px 0 #000;
      }
    }

    .enemys .peo {
      background: #aa0000;
    }

    .enemys .peoAP {
      //display: none;
    }

    .PeoStatus {
      position: absolute;
      top: 15px;
      right: 10px;
      left: 10px;

      .infoTop {
        padding-bottom: 5px;
      }
    }

    .skills {
      position: absolute;
      left: 0;
      bottom: 97px;
      right: 0;

      li {
        display: inline-block;
        position: relative;
        vertical-align: top;

        .in {
          position: absolute;
          left: 2px;
          right: 2px;
          top: 2px;
          bottom: 2px;
          background: #0077aa;
          line-height: 0.5em;
          border-radius: 5px;

        }

        .peoAP {
          bottom: 3px;
          opacity: .5;

          s {
            background: #fff;
          }
        }

        .name {
          font-size: 12px;
        }

        .disabled {
          background: #666 !important;
        }
      }

      .cur .in {
        background: #FF6600;
      }

    }

    .peoAP {
      position: absolute;
      height: 4px;
      bottom: -4px;
      left: 0;
      right: 0;
      font-size: 0;

      i {
        vertical-align: top;
        display: inline-block;
        background: #ccc;
        width: 4px;
        height: 4px;
        margin: 0 1px;
        border-radius: 10px;
        overflow: hidden;
      }

      s {
        display: block;
        width: 100%;
        height: 100%;
        background: #55A532;
      }
    }

    #animateMask {
      display: none;
      z-index: 99;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0);
    }
  }
</style>
