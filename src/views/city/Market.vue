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
                  <span v-if="curItem.canbuy=='true'" class="pull-right" style="color: #d9cc38;">
                    ${{curItem.price}}
                  </span>
                  <span v-else class="pull-right" style="color: #f00;">
                    ${{curItem.price}}（买不起）
                  </span>物品：<strong>{{curItem.name}}</strong></p>
                <p class="des">描述：{{data.goods[curItem.typeId].des}}</p>
                <p v-if="JSON.stringify(curItem.effect) != '{}'">
                  效果：待处理
                </p>
                <p v-if="curItem.skill.length>0">
                  技能：
                  <van-tag v-for="s in curItem.skill" :key="s" :type="data.skills[s].class=='0'?'default':'success'">{{data.skills[s].type}}</van-tag>
                </p>
                <ul class="attr">
                  <li>品质：{{curItem.qua}}</li>
                  <li>耐久度：{{curItem.dur}}</li>
                  <li>重量：{{curItem.wei}}</li>
                </ul>
                <ul class="attr">
                  <li>攻击力：{{curItem.atk}}</li>
                  <li>双手：{{ curItem.th==0?"否":"是" }}</li>
                  <li>破马率：{{ parseInt(curItem.bh*100)+"%"}}</li>
                  <li>破甲率：{{ parseInt(curItem.ba*100)+"%"}}</li>
                  <li>穿甲率：{{ parseInt(curItem.bh*100)+"%"}}</li>
                  <li>破盾率：{{ parseInt(curItem.bs*100)+"%"}}</li>
                  <li>命中率：{{ parseInt(curItem.hit*100)+"%"}}</li>
                  <li>爆头率：{{ parseInt(curItem.hh*100)+"%"}}</li>
                  <li>攻击范围：{{curItem.range}}</li>
                </ul>
              </div>
            </div>
          </section>
          <section class="items">

            <van-grid :column-num="4" :gutter="10">
              <van-grid-item v-for="item in items" :key="item.id" :id="'item_'+item.id" @click="clickItem(item)"
                :canbuy="item.canbuy">
                <i :class="['iconfont','icon-'+item.typeId+'-'+item.qua]"></i>
                <span class="van-grid-item__text">{{item.name}}</span>
                <i class="price">${{item.price}}</i>
                <van-button style="display: none;" v-if="item.canbuy" type="primary" @click="buy(item)">购买</van-button>
              </van-grid-item>
            </van-grid>
          </section>
          <!-- 主内容 E -->
        </div>
      </div>
    </section>
    <HeaderBar></HeaderBar>
    <FooterBack></FooterBack>
  </div>
</template>
<script>
  import HeaderBar from '@/components/HeaderBar.vue';
  import FooterBack from '@/components/FooterBack.vue';
  export default {
    data() {
      return {
        items: [],
        curItem: null,
      }
    },
    created() {
      // game.curSave = game.load(1);
      // let id = 2;
      let id = this.$route.query.id;
      this.items = game.curSave.goods.filter(p => p.buildingId == id);
      this.items.sort((a, b) => { return a.price - b.price });
      this.updateCanBuy();
    },
    mounted() {

    },
    methods: {
      //更新能否购买状态
      updateCanBuy() {
        this.items.forEach(p => {
          p.canbuy = p.price > game.curSave.gold ? "false" : "true";
        });
      },

      //点击物品
      clickItem(item) {
        this.curItem = item;
        document.querySelectorAll(".items .van-button").forEach(e => {
          e.style.display = "none";
        });
        if (item.price > game.curSave.gold) return;
        let ele = document.querySelector("#item_" + item.id + " .van-button");
        ele.style.display = "block";
      },

      //购买
      buy(item) {
        //减少金钱
        game.curSave.gold -= item.price;

        //判断是否消耗品
        switch (item.typeId) {
          case 0:
            game.curSave.food += 100;
            break;
          case 1:
            game.curSave.repair += 100;
            break;
          case 2:
            game.curSave.medication += 100;
            break;
          case 3:
            game.curSave.arrow += 100;
            break;
          default:
            //队伍添加物品
            game.curSave.myGoods.push(item);
            break;
        }
        this.$store.commit("updateStore");

        //删除curSave里面的物品
        let index = game.curSave.goods.findIndex(p => p.id == item.id);
        game.curSave.goods.splice(index, 1);
        //删除本页面的物品
        let index1 = this.items.findIndex(p => p.id == item.id);
        this.items.splice(index1, 1);
        this.updateCanBuy();
      },
    },
    components: {
      FooterBack,
      HeaderBar
    }
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
      height: 190px;
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
        color: #999;
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

    .items {
      position: absolute;
      margin: 0 -10px;
      overflow-y: auto;
      top: 202px;
      left: 0;
      right: 0;
      bottom: 0;

      .item {
        position: relative;
      }

      .van-button {
        position: absolute;
        left: 10px;
        top: 10px;
        bottom: 10px;
        right: 10px;
        height: auto;
        padding: 0;
        width: calc(100% - 20px);
        opacity: .9;
      }

      .iconfont {
        font-size: 28px;
      }

      .van-grid-item__text {
        color: #fff;
        margin-top: 5px;
      }

      .van-grid-item__content {
        background: #333;
      }

      .van-grid-item[canbuy='false'] .van-grid-item__content {
        background: #444;
      }

      .price {
        position: absolute;
        top: 5px;
        left: 5px;
      }
    }
  }
</style>
