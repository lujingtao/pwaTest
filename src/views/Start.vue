<template>
  <div component="Start" class="disTable" style="background: #0077AA;">
    <div class="info" v-if="versionInfo!=''" style="position: absolute; left:0; right: 0; text-align: left; padding: 10px;">
      <van-button style="float: right;" type="primary" @click="updateVersion">更新</van-button>
      {{versionInfo}}
    </div>
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
  import { createPeo, createGood, createGoods } from "@/class/Tool.js";
  import Tree from "@/views/Home/components/Tree.vue"
  export default {
    data() {
      return {
        versionInfo: "",
        timer: null,
      }
    },
    mounted() {
      let curVersion = localStorage.getItem("sw_version");
      console.log("当前版本：", curVersion);
      console.log("最新版本：", version);
      if(curVersion == null){
        localStorage.setItem("sw_version", version);
      }else{
        if (curVersion < version) {
          this.versionInfo = `当前版本：${curVersion}，最新版本：${version}`;
        }
      }
    },
    methods: {
      //更新版本
      updateVersion() {
        SW.update().then(() => {
          localStorage.setItem("sw_version", version);
          console.log("已更新版本为：", version);
          this.versionInfo = "更新成功";
          this.timer = setTimeout(() => {
            this.versionInfo = "";
          }, 3000)
        });
      },

      //新游戏
      newGame() {
        game.curSave = {
          gold: 999990,
          date: 0,
          food: 30,
          tool: 100,
          medication: 100,
          arrow: 30,
          myTeam: [],
          myGoods: [],
          peos: [],
          goods: [],
        };
        this.createNodes();
        this.createPeos();
        createGoods();
        this.$store.commit("updateStore");
        this.$router.push("/home");
      },
      //快速读档
      fastLoad(item) {
        this.curSave = game.load(1);
        if (this.curSave) {
          this.$router.push("/home")
        } else {
          alert("没有存档")
        }
      },

      //创建地图节点
      createNodes() {
        let nodes = [];
        nodes.push(Tree.methods.createNode(0, 2, 0, 0, 0));
        Tree.methods.createNodes(nodes[0]);
        game.curSave.nodes = nodes;
        game.curSave.curNodeId = nodes[0].id;
        this.$store.commit("updateStore");
        console.log("创建地图节点", game.curSave.nodes);
      },

      //创建人物
      createPeos() {
        for (let i = 0; i < game.peosUpdateCount; i++) {
          let type = common.random(0, data.peos.length - 1);
          let peo = createPeo(type);
          game.curSave.peos.push(peo);
        }
        console.log("创建人物：");
        console.log(game.curSave.peos);
      },

    },
    beforeDestroy() {
      clearTimeout(this.timer);
    },
    components: {}
  }
</script>
<style>

</style>
