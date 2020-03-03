<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        active: 0
      }
    },
    created() {

    },
    mounted() {

    },
    methods: {

    },
    components: {

    }
  }
</script>



<style lang="scss">
i{
  font-style: normal;
}
.pull-right{
  float: right;
}
.pull-left{
  float: left;
}
  
html,body,#app{
  margin:0;
  padding:0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: #333;
}
  
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  
}
.disTable{
  display: table;
  width:100%;
  height:100%;
  .disTableCell{
    width: 100%;
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    .disInblock{
      display: inline-block;
    }
  }
}

.scrollWrap{
  position: absolute;
  left:10px;
  top:40px;
  right:10px;
  bottom:60px;
  overflow-y: auto;
}
//顶部
.headerBar{
  position: fixed;
  top:0;
  left:0;
  width:100%;
  height: 30px;
  line-height: 30px;
  color:#fff;
  background: #444;
  font-size: 12px;
  text-align: left;
  .pull-right label{
    margin-left: 10px;
  }
  .iconfont{
    font-size: 12px;
  }
}

//存取档相关
.files {
  width: 100%;
  text-align: left;
  display: inline-block;
  .van-panel {
    margin: 0 0 10px 0;
    border-radius: 2px;
    overflow: hidden;
    position: relative;
  }

  .van-panel .van-button {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
  }
}

.menuBtns {
  width: 70%;
  .van-button {
    margin: 20px 0;
    text-align: left;
  }
}

//地图相关
#mapWrap {
  width: 100%;
  height: 100%;
  position: relative;
}
#mapDrag{
  position: absolute;
  left: 0;
  top: 0;
}

//覆盖默认样色
.van-tabbar{
  background: #444;
  color:#fff;
}
.van-tabbar-item{
  color: #fff;
}
.van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after{
  border-width:0;
}

</style>
