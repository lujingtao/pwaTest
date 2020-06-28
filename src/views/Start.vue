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
  import { createPeo, createGood} from "@/class/Tool.js";
  import Tree from "@/views/Home/components/Tree.vue"
  export default {
    data() {
      return {}
    },
    mounted() {
    },
    methods: {
      //新游戏
      newGame(){
        game.curSave = {
          gold: 999990,
          date: 0,
          food: 30,
          repair: 100,
          medication: 100,
          arrow: 30,
          myTeam: [],
          myGoods: [],
          peos: [],
          goods: [],
          curNode:null
        };
        this.createNodes();
        this.createPeos();
        this.createGoods();
        this.$store.commit("updateStore");
        this.$router.push("/home");
      },
      //更新
      fastLoad(item) {
        this.curSave = game.load(1);
        this.$router.push("/home")
      },
      
      //创建地图节点
      createNodes() {
        let nodes=[];
        nodes.push(Tree.methods.createNode(0,2,0,0,0));
        Tree.methods.createNodes(nodes[0]);
        game.curSave.nodes = nodes;
        game.curSave.curNode = nodes[0];
        console.log("创建地图节点", game.curSave.nodes);
      },
      
      //创建物品
      createGoods() {
        for (let i = 0; i < game.goodsUpdateCount; i++) {
          let type = common.random(0, data.goods.length - 1);
          let good = createGood(type);
          game.curSave.goods.push(good);
        }
        console.log("创建物品：");
        console.log(game.curSave.goods);
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
    components: {}
  }
</script>
<style>

</style>
