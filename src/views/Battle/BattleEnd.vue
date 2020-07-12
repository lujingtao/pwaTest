<template>
  <div component="BattleEnd" class="BattleEnd">
    <h3 class="title">{{winner==1?"胜利":"战败"}}</h3>

    <!-- 经验结算 -->
    <section v-show="page==1" class="page pageExp">
      <div class="in">
        <ul>
          <li v-for="peo in peos" :key="peo.id" class="clearfix">
            <div class="lv">
              LV{{peo.level}}
            </div>
            <div v-show="peo.level-peo._level>0" class="lvUp">
              <van-icon name="upgrade" /><span class="num">{{peo.level-peo._level}}</span>
            </div>
            <div class="pic">
              <Peo :peo="peo"></Peo>
            </div>
            <div class="con">
              <p>击杀：<span>{{peo._kills}}</span></p>
              <p>伤害：<span>{{peo._damages}}</span></p>
              <p>经验：<span>{{peo._exp}}</span></p>
            </div>
            
          </li>
        </ul>
      </div>
      <div class="btns">
        <van-button @touchend.native.prevent.stop="page=2" block type="default"> 奖 励 </van-button>
      </div>
    </section>

    <!-- 奖励结算 -->
    <section v-show="page==2" class="page pageExp">
      <div class="in">
        <van-grid :column-num="4" :gutter="10" class="goodsList">
          <van-grid-item v-for="item in rewardGoods" :key="item.id" @touchend.native.prevent.stop="clickItem(item)"
            :class="['']">
            <Goods :item="item" :showBtn="false" :goodsSelects="goodsSelects"></Goods>
          </van-grid-item>
        </van-grid>
      </div>
      <div class="btns">
        <div style="overflow: hidden; margin-bottom: 10px;">
          <van-button v-show="goodsSelects.length!=0" @touchend.native.prevent.stop="selectAll(false)" size="small" class="pull-right" type="default"> 清除 </van-button>
          <van-button v-show="goodsSelects.length==0" @touchend.native.prevent.stop="selectAll(true)" size="small" class="pull-right" type="default"> 全选 </van-button>
          当前背包：{{count}}/{{game.packageMaxCount}}
        </div>
        <van-button @touchend.native.prevent.stop="click_confirm" block type="default"> 确 定 </van-button>
      </div>
    </section>

  </div>
</template>

<script>
  import Peo from '@/components/Peo.vue';
  import Goods from '@/components/Goods.vue';
  import {createGood,peoSave} from '@/class/Tool.js';
  export default {
    data() {
      return {
        page: 1,
        peos: [],
        enemys: [],
        rewardGoods: [], //被击杀的敌人的装备 + 奖励
        goodsSelects: [],
      }
    },
    created() {
      this.winner = this.$route.params.winner;
      this.peos = this.$route.params.peos;
      this.enemys = this.$route.params.enemys;
      this.totalExp = 0; //总经验
      
      this.accountReward();
    },
    computed: {
      count() {
        return game.curSave.myGoods.length + this.goodsSelects.length
      }
    },
    mounted() {},
    methods: {
      
      //结算奖励
      accountReward(){
        //战胜，加入战斗金币奖励等
        if(this.winner==1){
          let gold = createGood(-1);
          let size = this.$store.state.targetNode.size;
          gold.price = (100 + common.random(-20,20)) * size * size ;
          gold.name = "$"+gold.price;
          this.rewardGoods.push(gold);
        }
        
        //加入被击杀敌人的装备
        this.enemys.forEach( peo=>{
          if(peo.hp>0) return;
          this.totalExp += peo.killExp;
          for (let key in peo._equips) {
           let equip = peo._equips[key];
           if(equip){
             this.rewardGoods.push(equip)
           }
          }
        })
        
        this.selectAll(true);
        
        //经验、等级结算
        this.peos.forEach(peo=>{
          peo._level = peo.level;
          peo._exp = Math.round(this.totalExp/this.peos.length);
          peo.exp += peo._exp;
          peo.level = peo.getLevel();
          let levelUps = peo.level - peo._level;
          //peo.levelPoints += levelUps;
          for (let i = 1; i <= levelUps; i++) {
            peo.addLevelPoint(peo._level + i);
            peo.addSkillPoint(peo._level + i);
          }
          peo.battles ++;
        })
      },
      
      //确定并退出结算
      click_confirm(){
        this.peos.forEach(peo=>{
          peoSave(peo);
        })
        this.rewardGoods.forEach((goods=>{
          if(goods.type==-1){ //如果是金币
            game.curSave.gold += goods.price;
          }else{
            game.curSave.myGoods.push(goods);
          }
        }));
        this.$store.commit("updateStore");
        this.$router.push({name:'Home', params:{winner:this.winner}})
      },
      
      //全选\取消选择物品
      selectAll(isTrue){
        if(isTrue){
          this.goodsSelects = [];
          this.rewardGoods.forEach(goods => {
            this.goodsSelects.push(goods.id)
          })
        }else{
          this.goodsSelects = [];
        }
      },
      
      //点击物品
      clickItem(item) {
        let index = this.goodsSelects.indexOf(item.id);
        if(index==-1){
          this.goodsSelects.push(item.id)
        }else{
          this.goodsSelects.splice(index,1)
        }
      }
    },
    components: { Peo, Goods },
  }
</script>

<style lang="scss">
  .BattleEnd {
    .title {
      font-size: 30px;
      padding-top: 20px;
    }

    .page {
      position: absolute;
      top: 90px;
      bottom: 0;
      right: 10px;
      left: 10px;

      .in {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 100px;
        top: 0;
        overflow-x: hidden;
        overflow-y: auto;
      }

      .btns {
        text-align: left;
        position: absolute;
        bottom: 10px;
      }
    }

    .goodsList .price {
      display: none;
    }

    .goodsList .lines {
      display: block;
    }

    .pageExp .in>ul {
      margin-top:-10px;
      >li {
        border: 1px solid #444;
        border-radius: 5px;
        text-align: left;
        margin: 20px 0;
        padding:10px;
        font-size: 14px;
        position: relative;

        .pic {
          position: relative;
          width: 60px;
          height: 60px;
          float: left;
          margin-right: 15px;
        }

        .con {
          overflow: hidden;
        }
        
        .lv{
          float: right;
          line-height: 60px;
          font-size: 16px;
        }
        
        .lvUp{
          position: absolute;
          right: 0;
          top:-10px;
          font-size: 22px;
          color: #ff0;
        }
      }
    }
  }
</style>
