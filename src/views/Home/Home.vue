<template>
  <div id="home">
    <div class="tree">
      <Tree :nodes="nodes" :fullNodes="nodes" ref="tree"></Tree>
    </div>
    <HeaderBar></HeaderBar>
    <FooterNav></FooterNav>


  </div>
</template>

<script>
  import Map from '@/class/Map';
  import Tree from './components/Tree.vue';
  export default {
    components: { Tree },
    data() {
      return {
        nodes: game.curSave.nodes
      }
    },

    created() {

    },
    mounted() {
      //战斗结束后回传的战斗结果
      this.winner = this.$route.params.winner;
      if(this.winner==1){ //胜利
        this.$refs.tree.updateCurNode(this.$store.state.targetNode);
        this.$refs.tree.createNodes(this.$store.state.curNode);
      }
    },

    methods: {

    },
  }
</script>
