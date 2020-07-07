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
      <van-grid :column-num="4" :gutter="10">
        <van-grid-item v-for="item in items" :key="item.id" :id="'item_'+item.id" @touchend.native.prevent.stop="clickItem(item)" :class="[targetItem&&targetItem.id==item.id?'active':'']">
          <i :class="['iconfont','icon-'+item.type+'-'+item.qua]"></i>
          <span class="van-grid-item__text">{{item.name}}</span>
          <i class="price">${{item.price}}</i>
          <van-button type="primary" @touchend.native.prevent.stop="confirmItem(item)">装备</van-button>
          
        </van-grid-item>
      </van-grid>
    </section>

    <div class="btns">
      <van-button type="default" block @touchend.native.prevent.stop="click_cancle">取消</van-button>
    </div>
  </div>
</template>

<script>
  import EquipInfo from "./EquipInfo";
  export default {
    props: ['peo', 'equip', 'equipKey'],
    data() {
      return {
        curItem: null, //当前装备
        targetItem: null, //选择目标装备
        items: [],
        compare:{
          type:undefined,
          price:undefined,
          qua:undefined,
          dur:undefined,
          wei:undefined,
          atk:undefined,
          th:undefined,
          bh:undefined,
          ba:undefined,
          pa:undefined,
          bs:undefined,
          hit:undefined,
          hh:undefined,
          range:undefined,
          effect:undefined,
          skill:undefined,
          des:undefined,
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
        this.items.sort((a,b)=> { return b.type - a.type })
      },
      
      //是否队员已装备该物品
      isPeoHasEquip(item){
        for (var i = 0; i < game.curSave.myTeam.length; i++) {
          let peo = game.curSave.myTeam[i];
          if(peo.equip[this.equipKey] == item.id) return true;
        }
        return false;
      },

      //点击装备物品
      clickItem(item) {
        if(this.curItem == item) return;
        this.targetItem = item;
        this.updateCompare()
      },
      
      //更新对比属性
      updateCompare(){
        for (let key in this.compare) {
          if(['type','price','th','effect','skill','des'].indexOf(key)==-1){
            this.compare[key] = this.targetItem[key] - (this.curItem?this.curItem[key]:0);
            if(['bh','ba','pa','bs','hit','hh'].indexOf(key)!=-1){
              this.compare[key] = this.compare[key];
            }
          }
        }
      },
      
      //设置对比颜色风格
      setCompareColor(val){
        if(val==undefined) return;
        if(val>0) return 'green';
        if(val<0) return 'red';
      },
      
      //确认装备物品
      confirmItem(item){
        this.peo.switchEquip(this.equipKey, this.curItem, this.targetItem);
        this.click_cancle();
      },

      click_cancle() {
        this.$emit("SwitchEquip_hide")
      }
    },
    computed: {},
    components: {
      EquipInfo
    }
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
    background: #333;

    dl {
      position: absolute;
      left:0;
      top:0;
      right: 0;
      margin:0;
      bottom:245px;
      overflow-y:auto;
      display: flex;
    }

    dd {
      margin: 0;
      flex-grow: 1;
      border-right: 1px solid #444;
      line-height: 2;
      width: 25%;
      &:first-child{
        width: 60px;
      }
      &:last-child {
        width: 60px;
        border-right: 0;
      }
      
      li{
        min-height: 24px;
        background: #3e3e3e;
      }
      li:nth-child(2n){
        background: rgba(0,0,0,0);
      }
      li.green{
        color: #55A532;
      }
      li.red{
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
        border: 1px solid rgba(0,0,0,0);

        span {
          font-size: 16px;
        }
        
        .iconfont{
          font-size: 30px;
          color:#fff
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
      background: #404040;
      border-top: 1px solid #777;
      border-bottom: 1px solid #777;
      
      .van-button{
        display: none;
      }
      
      .active .van-button{
        display: block;
      }
    }

    .btns {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;

      .van-button {
        border-radius: 0;
      }
    }
  }
</style>
