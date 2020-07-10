<template>
  <div component="BattleEnd" class="BattleEnd">
    <h3 class="title">{{winner==1?"胜利":"战败"}}</h3>

    <!-- 经验结算 -->
    <section v-show="page==1" class="page pageExp">
      <div class="in">
        <ul>
          <li v-for="peo in peos" :key="peo.id">
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
        <van-button block type="default"> 奖 励 </van-button>
      </div>
    </section>

    <!-- 奖励结算 -->
    <section v-show="page==2" class="page pageExp">
      <div class="in">
        <van-grid :column-num="4" :gutter="10" class="goodsList">
          <van-grid-item v-for="item in enemyGoods" :key="item.id" @touchend.native.prevent.stop="clickItem(item)"
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
        <van-button block type="default"> 确 定 </van-button>
      </div>
    </section>

  </div>
</template>

<script>
  import Peo from '@/components/Peo.vue';
  import Goods from '@/components/Goods.vue';
  export default {
    data() {
      return {
        page: 1,
        peos: [],
        enemyGoods: [],
        goodsSelects: [],
      }
    },
    created() {
      this.winner = this.$route.params.winner;
      this.peos = this.$route.params.peos;
      this.enemyGoods = this.$route.params.enemyGoods;

      this.selectAll(true);
    },
    computed: {
      count() {
        return game.curSave.myGoods.length + this.goodsSelects.length
      }
    },
    mounted() {},
    methods: {
      
      selectAll(isTrue){
        if(isTrue){
          this.goodsSelects = [];
          this.enemyGoods.forEach(goods => {
            this.goodsSelects.push(goods.id)
          })
        }else{
          this.goodsSelects = [];
        }
        
      },
      
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
      >li {
        overflow: hidden;
        border: 1px solid #444;
        border-radius: 5px;
        text-align: left;
        margin-bottom: 10px;
        padding:10px;
        font-size: 14px;

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
      }
    }
  }
</style>
