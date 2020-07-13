<template>
  <div component="Market" class="scrollWrap" style="overflow-y:hidden;">
    <section class="disTable">
      <div class="disTableCell">
        <div class="disInblock market">
          <!-- 主内容 S -->
          <section class="intro">
            <div class="in">
              <div v-if="curItem==null">
                <p>店主：</p>
                <p>欢迎来到我们的商店，请选择你的商品，良心作生意，童叟无欺。</p>
              </div>
              <div v-else>
                <p>
                  <span v-if="curItem.price>$store.state.gold" class="pull-right" style="color: #f00;">
                    ${{curItem.price}}（买不起）
                  </span>
                  <span v-else class="pull-right" style="color: #d9cc38;">
                    ${{curItem.price}}
                  </span>
                  物品：<strong>{{curItem.name}}</strong></p>
                <p class="des">描述：{{data.goods.find(g=>g.id==curItem.type).des}}</p>
                <p v-if="JSON.stringify(curItem.effect) != '{}'">
                  效果：{{JSON.stringify(curItem.effect)}}
                </p>
                <p v-if="itemSkills.length>0">
                  技能：
                  <van-tag v-for="s in itemSkills" :key="s.id" :type="s.class=='0'?'default':'success'">{{s.type}}</van-tag>
                </p>
                <ul class="attr">
                  <li>品质：{{curItem.qua}}</li>
                  <li>耐久度：{{curItem.dur}}</li>
                  <li>重量：{{curItem.wei}}</li>
                </ul>
                <ul class="attr">
                  <li>攻击力：{{curItem.atk}}</li>
                  <li>双手：{{ curItem.th==0?"否":"是" }}</li>
                  <li>破马率：{{ curItem.bh+"%"}}</li>
                  <li>破甲率：{{ curItem.ba+"%"}}</li>
                  <li>穿甲率：{{ curItem.pa+"%"}}</li>
                  <li>破盾率：{{ curItem.bs+"%"}}</li>
                  <li>命中率：{{ curItem.hit+"%"}}</li>
                  <li>爆头率：{{ curItem.hh+"%"}}</li>
                  <li>攻击范围：{{curItem.range}}</li>
                </ul>
              </div>
            </div>
            <van-button style="position: absolute;right:10px;bottom:10px;" size="small" type="primary"
              @touchend.native.prevent.stop="buyAll()">全部购买</van-button>
          </section>
          <section class="items">
            <van-grid :column-num="4" :gutter="10" class="goodsList">
              <van-grid-item v-for="item in items" :key="item.id" @click="clickItem(item)"
                :class="[ curItem==item?'cur':'', item.price>$store.state.gold?'disabled':'']">
                <Goods :item="item" :showBtn="true" :btnTxt="curType" @click_button="handleItem(item)"></Goods>
              </van-grid-item>
            </van-grid>
          </section>
          
          <van-row class="btns">
            <van-col span="12"><van-button @touchend.native.prevent.stop="setGoods('购买')" block size="small" :type="curType=='购买'?'primary':'default'"> 买 入 </van-button></van-col>
            <van-col span="12"><van-button @touchend.native.prevent.stop="setGoods('卖出')" block size="small" :type="curType=='卖出'?'primary':'default'"> 卖 出 </van-button></van-col>
          </van-row>
          <!-- 主内容 E -->
        </div>
      </div>
    </section>
    <HeaderBar></HeaderBar>
    <FooterNav></FooterNav>
  </div>
</template>
<script>
  import Goods from '@/components/Goods.vue';
  import { createGoods } from "@/class/Tool.js"
  export default {
    components: { Goods },
    data() {
      return {
        items: [],
        curItem: null,
        curType:"购买",
      }
    },
    created() {
      createGoods();
      this.setGoods("购买");
    },
    computed: {
      itemSkills() {
        let ary = [];
        this.curItem.skills.forEach(id=>{
          let skill = data.skills.find(s => s.id==id);
          if(!skill) return;
          ary.push(skill)
        })
        return ary
      }
    },
    mounted() {

    },
    methods: {
      setGoods(type){
        this.curItem = null;
        this.curType = type;
        if(type=="卖出"){
          this.items = game.curSave.myGoods;
        }else{
          this.items = game.curSave.goods;
        }
        this.items.sort((a, b) => { return a.price - b.price });
      },

      //点击物品
      clickItem(item) {
        this.curItem = item;
        if (item.price > game.curSave.gold) return;
      },
      
      //点击购买或卖出
      handleItem(item){
        if(this.curType=="购买"){
          this.buy(item)
        }else{
          this.sell(item)
        }
      },
      
      //卖出
      sell(item){
        
      },

      //购买
      buy(item) {
        if (item.price > this.$store.state.gold) return;
        //减少金钱
        game.curSave.gold -= item.price;
        //已购买的物品价值为原价的 1/5
        item.price = Math.round(item.price/5);

        //判断是否消耗品
        switch (item.type) {
          case 0:
            game.curSave.food += 100;
            break;
          case 1:
            game.curSave.tool += 100;
            break;
          case 2:
            game.curSave.medication += 100;
            break;
          case 3:
            game.curSave.arrow += 100;
            break;
          default:
            //删除curSave里面的物品
            let index = game.curSave.goods.findIndex(p => p.id == item.id);
            game.curSave.goods.splice(index, 1);
            //队伍添加物品
            game.curSave.myGoods.push(item);
            break;
        }
        this.$store.commit("updateStore");
      },

      //全部购买
      buyAll() {
        for (var i = this.items.length - 1; i >= 0; i--) {
          this.buy(this.items[i])
        }
      }
    },
  }
</script>

<style lang="scss">
  .market {
    width: 100%;
    height: 100%;
    vertical-align: top;
    color: #fff;
    font-size: 12px;

    .intro {
      height: 170px;
      border: 1px solid #777;
      text-align: left;
      line-height: 1.8;
      position: relative;

      .in {
        position: absolute;
        left: 15px;
        right: 15px;
        top: 10px;
        bottom: 10px;
        overflow-y: auto;
      }

      .van-tag {
        margin-right: 8px;
      }

      .attr {
        color: #aaa;
        display: flex;
        flex-wrap: wrap;

        li {
          width: 33.3%;
        }
      }

      p {
        margin: 0;
      }
    }
  }

  .items {
    position: absolute;
    //margin: 0 -10px;
    overflow-x: hidden;
    overflow-y: auto;
    top: 182px;
    left: 0;
    right: 0px;
    bottom: 40px;
  }

  .goodsList .lines {
    //display: none;
  }
  
  .btns{
    position: absolute;
    width: 100%;
    bottom:0;
    
  }
</style>
