<template>
  <Header component="HeaderBar" class="headerBar">
    <div style="padding:0 10px">
      <span class="pull-right">
        <label><i class="iconfont icon-gold"></i>{{$store.state.gold}}</label>
        <label><i class="iconfont icon-0-0"></i>{{$store.state.food}}</label>
        <label><i class="iconfont icon-1-0"></i>{{$store.state.repair}}</label>
        <label><i class="iconfont icon-2-0"></i>{{$store.state.medication}}</label>
        <label><i class="iconfont icon-3-0"></i>{{$store.state.arrow}}</label>
      </span>
      <label>第{{$store.state.date}}天</label>
    </div>
  </Header>
</template>

<script>
  export default {
    data() {
      return {
      }
    },
    mounted() {
    },
    methods: {
      
    },
  }
</script>
