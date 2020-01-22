<template>
  <div id="mapWrap">
    <canvas id="map"></canvas>
  </div>
</template>

<script>
  import Map from '../class/Map.js';
  export default {
    data() {
      return {
        unitSize: 0,
        divs: 10, //竖向屏幕划分多少份
        cols: 0,
        rows: 0,
        $map: null,
        map:null,
      }
    },
    mounted() {
      this.initDatas();
      this.map.createMap(this.$map, this.unitSize, this.cols, this.rows);
      this.map.initEvent(this.$map);
    },
    methods: {

      //初始化数据
      initDatas() {
        this.$map = document.getElementById("map");
        let docHeight = document.documentElement.clientHeight;

        this.unitSize = parseInt(docHeight / this.divs);
        this.cols = Math.round(this.divs * 2);
        this.rows = Math.round(this.divs * 1.5);
        this.$map.width = this.unitSize * this.cols;
        this.$map.height = this.unitSize * this.rows;
        
        this.map = new Map;
      },

    },
    components: {

    }
  }
</script>

<style>
  #mapWrap {
    width: 100%;
    height: 100%;
    position: relative;
    /*   overflow: auto;
    overflow: auto;
    overflow: -moz-scrollbars-none;
    -webkit-overflow-scrolling:touch; */
  }

  /* .mapWrap::-webkit-scrollbar { width: 0 !important; display: none; } */
  #map {
    position: absolute;
    left: 0;
    top: 0;
    background: #333;
  }
</style>
