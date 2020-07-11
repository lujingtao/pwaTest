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
      
      //调试时使用，默认读取第一个存档
      if(!game.curSave){
        game.curSave = game.load(1);
        if(!game.curSave&&this.$route.path!="/"){
          this.$router.push("/");
          return;
        };
        this.$store.commit("updateStore");
      }
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
.clearfix:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
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
  background: #000;
  color: #fff;
  text-align: center;
}
  
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
  background: #232323;
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
// #mapWrap {
//   width: 100%;
//   height: 100%;
//   position: relative;
// }
// #mapDrag{
//   position: absolute;
//   left: 0;
//   top: 0;
// }

//覆盖默认样色
.van-tabbar{
  background: #232323;
  color:#fff;
}
.van-tabbar-item{
  color: #fff;
}
.van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after{
  border-width:0;
}
.van-tag{
  margin:0 2px;
}
.van-button--default{
  border-color: #666;
}

.van-panel,
.van-cell-group{
  background: none;
}
.van-dialog,
.van-button--default,
.van-action-sheet__cancel, 
.van-action-sheet__item,
.van-popup,
.van-action-sheet__cancel::before,
.van-cell{
  background: #222;
  color: #fff;
}
.van-cell:not(:last-child)::after{
  border:0
}
.van-dialog__message--has-title{
  color: #fff;
}
.van-action-sheet__cancel:active, .van-action-sheet__item:active{
  background: #000000;
}
.van-popup--bottom .van-hairline--top::after{
  border:0;
}
.van-action-sheet__item{
  border-bottom: 1px solid #666;
}
</style>
