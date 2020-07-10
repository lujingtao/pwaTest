<!-- 更换装备页面 -->
<template>
  <div components="SwitchEquip" class="SwitchEquip">
    <dl>
      <dd>
        <div class="icon"></div>
        <ul>
          <li>类别：</li>
          <li>价格：</li>
          <li>品质：</li>
          <li>耐久：</li>
          <li>重量：</li>
          <li>攻击：</li>
          <li>双手：</li>
          <li>破马：</li>
          <li>破甲：</li>
          <li>穿甲：</li>
          <li>破盾：</li>
          <li>命中：</li>
          <li>爆头：</li>
          <li>范围：</li>
          <li>技能：</li>
          <li>效果：</li>
          <li>描述：</li>
        </ul>
      </dd>
      <EquipInfo :curItem="curItem" :equipKey="equipKey"></EquipInfo>
      <EquipInfo :curItem="targetItem" :equipKey="equipKey"></EquipInfo>
      <dd>
        <div class="icon"></div>
        <ul>
          <li v-for="val in compare" :class="setCompareColor(val)">
            <span v-if="val>0">+{{val}}</span>
            <span v-else-if="val==0">-</span>
            <span v-else>{{val}}</span>
          </li>
        </ul>
      </dd>
    </dl>

    <section class="items">
      <van-grid :column-num="4" :gutter="10" class="goodsList">
        <van-grid-item v-for="item in items" :key="item.id" @touchend.native.prevent.stop="clickItem(item)"
          :class="[targetItem&&targetItem.id==item.id?'cur':'']">
          <Goods :item="item" :showBtn="true" :btnTxt="'装备'" @click_button="confirmItem"></Goods>
        </van-grid-item>
      </van-grid>
    </section>

  <van-row class="btns">
    <van-col span="12"><van-button @touchend.native.prevent.stop="click_remove()" block size="small"> 卸 载 </van-button></van-col>
    <van-col span="12"><van-button @touchend.native.prevent.stop="click_cancle()" block size="small"> 取 消 </van-button></van-col>
  </van-row>
  </div>
</template>

<script>
  import Goods from '@/components/Goods.vue';
  import EquipInfo from "./EquipInfo";
  import { peoSave } from "@/class/Tool.js";
  export default {
    components: { EquipInfo,Goods },
    props: ['peo', 'equip', 'equipKey'],
    data() {
      return {
        curItem: null, //当前装备
        targetItem: null, //选择目标装备
        items: [],
        compare: {
          type: undefined,
          price: undefined,
          qua: undefined,
          dur: undefined,
          wei: undefined,
          atk: undefined,
          th: undefined,
          bh: undefined,
          ba: undefined,
          pa: undefined,
          bs: undefined,
          hit: undefined,
          hh: undefined,
          range: undefined,
          effect: undefined,
          skill: undefined,
          des: undefined,
        },
      }
    },
    created() {
      this.curItem = this.equip;
      this.getMyGoodsMapEquipKey();
    },
    mounted() {

    },
    methods: {
      //我的物品中匹配当前装备类型
      getMyGoodsMapEquipKey() {
        let equipTypeAryStr = data.equipKeyMapGoodsType[this.equipKey];
        let equipTypeAry = equipTypeAryStr.replace("[", "").replace("]", "").split(",");
        this.items = game.curSave.myGoods.filter(item => {
          if (equipTypeAry.indexOf(String(item.type)) != -1 && !this.isPeoHasEquip(item)) {
            return item
          }
        });
        this.items.sort((a, b) => { return b.type - a.type })
      },

      //是否队员已装备该物品
      isPeoHasEquip(item) {
        for (var i = 0; i < game.curSave.myTeam.length; i++) {
          let peo = game.curSave.myTeam[i];
          if (peo.equip[this.equipKey] == item.id) return true;
        }
        return false;
      },

      //点击装备物品
      clickItem(item) {
        if (this.curItem == item) return;
        this.targetItem = item;
        this.updateCompare()
      },

      //更新对比属性
      updateCompare() {
        for (let key in this.compare) {
          if (['type', 'price', 'th', 'effect', 'skill', 'des'].indexOf(key) == -1) {
            this.compare[key] = this.targetItem[key] - (this.curItem ? this.curItem[key] : 0);
            if (['bh', 'ba', 'pa', 'bs', 'hit', 'hh'].indexOf(key) != -1) {
              this.compare[key] = this.compare[key];
            }
          }
        }
      },

      //设置对比颜色风格
      setCompareColor(val) {
        if (val == undefined) return;
        if (val > 0) return 'green';
        if (val < 0) return 'red';
      },

      //确认装备物品
      confirmItem(item) {
        this.peo.switchEquip(this.equipKey, this.curItem, this.targetItem);
        this.click_cancle();
      },
      
      //卸载
      click_remove(){
        this.peo.removeEquip(this.equipKey);
        this.click_cancle()
      },

      click_cancle() {
        peoSave(this.peo);
        this.$emit("SwitchEquip_hide")
      }
    },
    computed: {},

  }
</script>

<style lang="scss">
  .SwitchEquip {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    background: #000;

    dl {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      margin: 0;
      bottom: 245px;
      overflow-y: auto;
      display: flex;
    }

    dd {
      margin: 0;
      flex-grow: 1;
      border-right: 2px solid #000;
      line-height: 2;
      width: 25%;

      &:first-child {
        width: 60px;
      }

      &:last-child {
        width: 60px;
        border-right: 0;
      }

      li {
        min-height: 24px;
        background: #131313;
      }

      li:nth-child(2n) {
        background: rgba(0, 0, 0, 0);
      }

      li.green {
        color: #55A532;
      }

      li.red {
        color: #ff5d5d;
      }

      .icon {
        width: 60px;
        height: 50px;
        line-height: 50px;
        margin: 6px auto 6px auto;
        vertical-align: middle;
        text-align: center;
        border-radius: 5px;
        color: #888;
        border: 1px solid rgba(0, 0, 0, 0);

        span {
          font-size: 16px;
        }

        .iconfont {
          font-size: 30px;
          color: #fff
        }
      }

      .icon1 {
        border: 1px solid #777777;
      }
    }

    .items {
      top: auto;
      bottom: 44px;
      max-height: 200px;
      padding: 10px;
      background: #000;
      border-top: 1px solid #777;
      border-bottom: 1px solid #777;
      
      .price{
        display: none;
      }
      .lines{
        display: block;
      }
    }

  }
</style>
