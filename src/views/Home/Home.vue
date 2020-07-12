<template>
  <div id="home">
    <div class="tree">
      <Tree :myTeam="myTeam" :nodes="nodes" ref="tree"></Tree>
    </div>
    <HeaderBar></HeaderBar>
    <FooterNav></FooterNav>
  </div>
</template>

<script>
  import Map from '@/class/Map';
  import Tree from './components/Tree.vue';
  import People from '@/class/People.js';
  export default {
    components: { Tree },
    data() {
      return {
        nodes: game.curSave.nodes,
        myTeam:[]
      }
    },

    created() {
      game.curSave.myTeam.forEach(peo => {
        let peoClone = JSON.parse(JSON.stringify(peo));
        peoClone.__proto__ = new People;
        peoClone.init("our");
        this.myTeam.push(peoClone);
      });
      console.log(this.myTeam);
    },
    mounted() {
      //战斗结束后回传的战斗结果
      this.winner = this.$route.params.winner;
      if(this.winner==1){ //胜利
        this.$refs.tree.updateCurNode(this.$store.state.targetNode);
        this.$refs.tree.createNodes(this.$store.state.targetNode);
      }
    },

    methods: {

    },
  }
</script>
