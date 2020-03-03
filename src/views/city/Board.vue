<template>
  <div component="Start" class="disTable">
    <div class="disTableCell">
      <div class="disInblock menuBtns">
        
        <van-button icon="smile-o" :block="true" type="default" to="home">新游戏</van-button>
        <van-button icon="peer-pay" :block="true" type="default" @click="fastLoad">快速读档</van-button>
        <van-button icon="peer-pay" :block="true" type="default" to="/option/load?showBack=true">读档</van-button>
        <van-button icon="setting-o" :block="true" type="default" to="/option/setting?showBack=true">设置</van-button>
        
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    mounted() {},
    methods: {
      //更新
      fastLoad(item) {

      },
    },
    components: {}
  }
</script>
<style>

</style>
