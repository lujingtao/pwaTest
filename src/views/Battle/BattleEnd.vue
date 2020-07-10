<template>
  <div component="">
    结算
  </div>
</template>

<script>
  export default {
    data() {
      return {
        peos:[],
        enemyGoods:[]
      }
    },
    created(){
      this.peos = this.$route.params.peos;
      this.enemyGoods = this.$route.params.enemyGoods;
      console.log(this.peos);
      console.log(this.enemyGoods);
    },
    mounted() {},
    methods: {},
    components: {},
  }
</script>

<style lang="scss" scoped>
</style>
