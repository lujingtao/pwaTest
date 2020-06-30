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
          <section class="elements">
            <ul>
              <li v-for="item in elements" :key="item.id" :id="item.id" 
                :style="{'width':unitSize+'px','height':unitSize+'px','left':unitSize*item.x+'px','top':unitSize*item.y+'px','fontSize':unitSize+'px','lineHeight':unitSize+'px'}">
                <i :class="['iconfont','icon-map-ele-'+item.type]"></i>
              </li>
            </ul>
          </section>
          <!-- 敌人 -->
          <section class="peos enemys">
            <ul>
              <li v-for="peo in enemys" :key="peo.id" :id="peo.id" @touchstart="click_peo(peo)" :class="curPeo==peo?'active':''"
                :style="{'width':unitSize+'px','height':unitSize+'px','left':unitSize*peo.x+'px','top':unitSize*peo.y+'px','fontSize':unitSize+'px'}">
                <Peo :peo="peo"></Peo>
              </li>
            </ul>
          </section>
          <!-- 我方人员 -->
          <section class="peos myTeam">
            <ul>
              <li v-for="peo in peos" :key="peo.id" :id="peo.id" @touchstart="click_peo(peo)" :class="curPeo==peo?'active':''"
                :style="{'width':unitSize+'px','height':unitSize+'px','left':unitSize*peo.x+'px','top':unitSize*peo.y+'px','fontSize':unitSize+'px'}">
                <Peo :peo="peo"></Peo>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
    
    <!-- 技能 -->
    <div class="skills">
      <ul>
        <li v-for="skill in skills" :key="skill.id" @click="click_skill(skill)" :class="curSkill==skill?'cur':''" :style="{'width':unitSize+'px','height':unitSize+'px','fontSize':unitSize+'px','lineHeight':unitSize+'px'}">
          <div class="in">
            <span class="name">{{skill.type}}</span>
          </div>
        </li>
      </ul>
    </div>
    
    <!-- 底部按钮 -->
    <BottomBtns :curPeo="curPeo" :round="round" @click_cancle="click_cancle" @click_end="click_end"></BottomBtns>
  </div>
</template>

<script>
  import People from '@/class/People.js';
  import Peo from '@/components/Peo.vue';
  import BottomBtns from './components/BottomBtns.vue';
  import PeoStatus from '@/views/Team/components/PeoStatus.vue';
  import Map from "@/class/Map.js";
  import { createPeo, createGood, o2o, getPeoSkills } from "@/class/Tool.js";
  import AI from './code/AI.js';
  export default {
    components: { Peo, PeoStatus,BottomBtns },
    data() {
      return {
        peos: game.curSave.myTeam, //我方人员
        enemys: [], //临时生成敌人
        elements:[],//临时生成的地图上的元素（障碍物等）
        curPeo: null, //当前人员
        unitSize:0, //地图单位尺寸
        skills:[], //当前人员所主动技能
        curSkill:null,//当前技能
        round:1,//当前回合，单数我方，双数敌方
      }
    },
    created() {
      this.mapDiv = 9; //横向屏幕划分多少份
      this.mapSize = { xMax:this.mapDiv-1, yMax:this.mapDiv-1};
      this.map = new Map;
      this.moveRange = [];
      this.initPeos();
      this.initEnemys();
      this.initElements(); //初始化地图元素（障碍物等）
    },
    mounted() {
      this.$map = document.getElementById("map");
      this.initMap();
      
      this.AI = new AI({
        enemys:this.enemys,
        peos:this.peos,
        elements:this.elements,
        map:this.map,
      });
      
      //this.nextRound();
    },
    methods: {
      //点击人员
      click_peo(peo) {
        this.curPeo = peo;
        this.moveRange = peo.creatMoveRange(this.map);
        this.skills = getPeoSkills(peo);
        console.log("获取人员技能：",this.skills);
        this.curSkill = this.skills[0];
      },
      
      //点击技能
      click_skill(skill){
        this.curSkill = skill;
      },

      //地图点击事件
      touchMap(e) {
        let point = common.getMapPoint(e, this.unitSize, document.getElementById("mapWrap"));
        console.log(point);
        //如果是人员移动范围则移动，否则取消人员选择
        if (common.indexOf2Array(point, this.moveRange) != -1) {
          this.curPeo.moveTo(point);
          this.map.updateBanPoints(this.peos, this.enemys, this.elements);
        }else{
          this.curPeo = null;
          this.curSkill = null;
          this.skills = [];
        }
        this.map.clearActionCell();
        this.moveRange = [];
      },

      //初始化我方
      initPeos() {
        this.peos.forEach(p=>{
          p.__proto__ = new People;
          p.update();
        });
        this.putPeos("myTeam");
      },

      //初始化敌方
      initEnemys() {
        // 根据据点规模生成不同类型敌人
        let size = game.curSave.curNode.size;
        console.log("据点规模：", size);
        let types = [0, 1, 8, 9, 10]; //敌人类型
        let myTeamCount = game.curSave.myTeam.length;
        let count = common.random(myTeamCount - 1, myTeamCount);
        if (size == 2) count = myTeamCount;
        if (size == 3) { types = [0, 1, 4, 6, 7, 8, 9, 10];
          count = common.random(myTeamCount, myTeamCount + 1) }
        if (size == 4) { types = [0, 1, 2, 3, 4, 6, 7, 8, 9, 10];
          count = common.random(myTeamCount, myTeamCount + 2) }
        if (size == 5) { types = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
          count = common.random(myTeamCount + 2, myTeamCount + 4) }

        //调试模式，只有一个敌人
        count = 1;

        for (var i = 0; i < count; i++) {
          let type = types[common.random(0, types.length-1)];
          let peo = createPeo(type);
          peo.move=1; //调试模式，移动力只有1
          peo.__proto__ = new People;
          this.createEnemyEquips(peo);
          peo.updateAbility();
          this.enemys.push( peo );
        }
        this.putPeos("enemys");
        console.log("生成敌方：",this.enemys);
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
        let headTypes = [[11],[11,12],[12,13]][grade];
        let bodyType = [[8],[8,9],[9,10]][grade];
        let leftHandType = [[17, 18, 19, 20, 21],[18,19,20,21,23],[18,19,20,21,22,23]][grade];
        let rightHandType = [[14],[14,15],[15,16]][grade];
        
        let head = (grade==0 && common.random(0, 1) || grade>0) ? createGood(headTypes[common.random(0, headTypes.length - 1)]) : undefined;
        let body = createGood(bodyType[common.random(0, bodyType.length - 1)]);
        let leftHand = createGood(leftHandType[common.random(0, leftHandType.length - 1)]);
        //如果是单手武器，则可能穿戴盾牌
        let rightHand = undefined;
        if (leftHand.th == 0) {
          rightHand = common.random(0, 1) == 1 ? createGood(rightHandType[common.random(0, rightHandType.length - 1)]) :
            undefined;
        }
        
        peo.equip.head = head?head.id:"";
        peo.equip.body = body.id;
        peo.equip.leftHand = leftHand.id;
        peo.equip.rightHand = rightHand?rightHand.id:"";
        
        peo._equips.head = head?head:undefined;
        peo._equips.body = body;
        peo._equips.leftHand = leftHand;
        peo._equips.rightHand = rightHand?rightHand:undefined;
      },

      //初始化地图元素（障碍物等）
      initElements(){
        let maxCount = parseInt( ((this.mapSize.xMax+1) * (this.mapSize.yMax+1) - this.peos.length - this.enemys.length)/5); //生成数量
        
        let count = common.random(parseInt(maxCount/2),maxCount);
        
        for (let i = 0; i < count; i++) {
          let point = common.creatPoint(this.mapSize.xMax, this.mapSize.yMax, this.map.banPoints);
          //地图类型，10~19障碍物，20~29可覆盖物体（草、水等）
          let types =[10,11,20,21,22];
          let ele = {
            id:common.createUniqueId(),
            type:types[common.random(0,types.length-1)],
            x:point[0],
            y:point[1]
          }
          this.elements.push(ele);
          this.map.banPoints.push([ele.x, ele.y]);
        }
      },

      //放置人员
      putPeos(type){
        let y = type=="myTeam"?this.mapSize.yMax:0;
        let ary = type=="myTeam"?this.peos:this.enemys;
        let start = parseInt(((this.mapSize.xMax+1) - ary.length) / 2);
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
        option.$map = this.$map;
        let docWidth = document.documentElement.clientWidth;
        this.unitSize = option.unitSize = parseInt(docWidth / this.mapDiv);
        option.cols = Math.round((this.mapSize.xMax+1) * 1);
        option.rows = Math.round((this.mapSize.yMax+1) * 1);
        this.map.init(option);
        this.$map.addEventListener(game.touchStart, this.touchMap)
      },
        
      //下一回合
      nextRound(){
        console.log("下一回合");
        this.round ++;
        if(this.round%2==0){
          this.AI.start();
        }
      },
      
      //点击取消按钮
      click_cancle(){
        this.curPeo = null;
        this.curSkill = null;
        this.skills = [];
        this.map.clearActionCell();
        this.moveRange = [];
      },
      
      //点击结束回合按钮
      click_end(){
        this.click_cancle();
        this.nextRound();
      },

    },

  }
</script>

<style lang="scss">
  .battle {
    height: 100%;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .topBar{
      position: absolute;
      top:0;
      left:0;
      right:0;
      font-size: 12px;
      height: 18px;
      line-height: 18px;
      border-top:4px #0077AA solid;
      
      .round{
        display: inline-block;
        background: #0077AA;
        padding:0 10px;
        border-radius: 0 0 5px 5px;
      }
      
    }
    .topBar.enemyRound{
      border-top-color: #AA0000;
      .round{
        background: #AA0000;
      }
    }

    #mapIn {
      position: relative;
    }

    #map {
      display: block;
    }
    
    .elements{
      >ul>li{
        position: absolute;
        .iconfont{
          font-size: 1em;
          color: #444;
        }
      }
    }

    .peos {
      >ul>li {
        display: inline-block;
        position: absolute;
        transition: 0.5s;

        .name {
          display: none;
        }
      }
      
      .peo{
        background: #0077AA;
      }

      .active {
        background: #f60;
      }
    }
    
    .enemys .peo{
      background: #aa0000;
    }
    .enemys .peoAP{
      display: none;
    }

    .PeoStatus {
      position: absolute;
      top: 15px;
      right: 10px;
      left: 10px;
      .infoTop{
        padding-bottom: 5px;
      }
    }
    
    .skills{
      position: absolute;
      left:0;
      bottom:50px;
      right:0;
      
      li{
        display: inline-block;
        position: relative;
        vertical-align: top;
        
        .in{
          position: absolute;
          left:2px;
          right:2px;
          top:2px;
          bottom:2px;
          background: #0077aa;
          line-height: 0.5em;
          border-radius: 5px;
        }
        .name{
          font-size: 12px;
        }
      }
      
      .cur .in{
        background: #FF6600;
      }
    }
    
    .peoAP{
      position: absolute;
      bottom:-4px;
      left:0;
      right: 0;
      font-size: 0;
      i{
        display: inline-block;
        background: #ccc;
        width: 4px;
        height: 4px;
        margin:0 1px;
        border-radius: 10px;
        overflow: hidden;
      }
      s{
        display: block;
        width: 100%;
        height: 100%;
        background: #55A532;
      }
    }
  }
</style>
