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
        nodes:game.curSave.nodes
      }
    },
    
    created() {

    },
    mounted() {
     
    },

    methods: {
      
    },
  }
</script>
