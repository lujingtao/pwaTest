<template>
  <div component="Start" class="disTable">
    <div class="disTableCell">
      <div class="disInblock menuBtns">
        
        <van-button icon="smile-o" :block="true" type="default" @click="newGame">新游戏</van-button>
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
      //新游戏
      newGame(){
        game.curSave=null;
        this.$router.push("/home");
      },
      //更新
      fastLoad(item) {
        this.curSave = game.load(1);
        this.$router.push("/home")
      },
    },
    components: {}
  }
</script>
<style>

</style>
