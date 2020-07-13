<template>
  <section component="Goods" class="goods">
    <ul class="lines">
      <li class="item"><span class="line"><i :style="{'width':Math.round(this.item.dur / this.item.durMax * 100)+'%'}"></i><b>{{item.dur+"/"+item.durMax}}</b></span>
      </li>
    </ul>
    <i :class="['iconfont','icon-'+data.goods.find(g=>g.id==item.type).icon]"></i>
    <span class="van-grid-item__text">{{item.name}}</span>
    <i class="price">${{item.price}}</i>
    <van-icon v-show="selected" name="success" />
    <van-button v-if="showBtn" type="primary" @touchend.native.prevent.stop="click_button(item)">{{btnTxt}}</van-button>
  </section>
</template>

<script>
  export default {
    data() {
      return {
        perc: 0,
      }
    },
    props: ["item","showBtn","btnTxt","goodsSelects"],
    computed: {
      selected() {
        if(!this.goodsSelects) return false;
        return this.goodsSelects.indexOf(this.item.id)!=-1 
      }
    },
    mounted() {
    },
    methods: {
      click_button(item){
        this.$emit("click_button",item)
      }
    },
    
    beforeDestroy() {
    }
  }
</script>

<style lang="scss">
  .goodsList {
    padding-left: 0 !important;
    margin-right: -10px;
    .goods{
      padding-top: 10px;
    }
    
    .van-icon-success{
      position: absolute;
      right: -5px;
      bottom:-5px;
      color: #ff0;
      font-size: 30px;
    }
      
    .van-button {
      display: none;
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
      display: block;
      font-size: 30px;
    }
      
    .van-grid-item__text {
      color: #fff;
      margin-top: 5px;
    }
      
    .van-grid-item__content {
      padding: 8px;
      background: #121212;
    }
      
    .van-grid-item.disabled .van-grid-item__content {
      background: #333;
    }
    
    .cur .van-button{
      display: block;
    }
    .disabled .van-button{
      display: none;
    }
      
    .price {
      display: block;
      // position: absolute;
      // top: 28px;
      // left: 5px;
      // right: 5px;
      font-size: 14px;
    }
    
    .lines {
      position: absolute;
      left:6px;
      right: 6px;
      top:6px;
      text-align: left;
      font-size: 12px;
    }
  
    .line {
      text-align: center;
      display: block;
      background: #545454;
      height: 8px;
      line-height: 8px;
      border-radius: 10px;
  
      i {
        position: absolute;
        left: 0;
        top: 0;
        border-radius: 10px;
        display: block;
        height: 100%;
        background: #15d400;
        background-image: linear-gradient(to left, #15d400 , #0e9300);
      }
  
      b {
        font-weight: normal;
        position: relative;
        text-shadow: 1px 1px 0 #000;
      }
    }
    
  }
</style>
