<template>
  <section component="Peo" class="peo">
    <div class="lines">
      <span class="line hp"><i :style="{'width':hpPerc+'%'}"></i></span>
    </div>
    <div class="name">{{peo.name}}</div>
  </section>
</template>

<script>
  export default {
    data() {
      return {
      }
    },
    props:["peo"],
    computed:{
      hpPerc:function(){
       return Math.round(this.peo.hp/this.peo.hpMax*100);
      }
    },
    mounted() {
    },
    methods: {
      
    },
  }
</script>

<style lang="scss">
  .peo{
    position: relative;
    height: 100%;
    .lines{
      width: 100%;
      position: absolute;
      left:0;
      top:0;
    }
    .line{
      display: block;
      position: relative;
      width: 100%;
      background: #545454;
      height: 3px;
      i{
        display: block;
        height: 100%;
        position: absolute;
        left:0;
        top:0;
        background: #15d400;
      }
    }
    
    .name{
      font-size: 12px;
      position: absolute;
      left:0;
      bottom:0;
      background: #039fff;
      height: 20px;
      line-height: 20px;
      padding:0 5px;
    }
  }
</style>