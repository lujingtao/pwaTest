<template>
  <div class="mapWrap">
    <canvas id="map"></canvas>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        unitSize: 0,
        divs: 10, //竖向屏幕划分多少份
        cols:0,
        rows:0,
        $map: null,
      }
    },
    mounted() {
      this.initDatas();
      this.createMap(this.$map, this.unitSize, this.cols, this.rows);
    },
    methods: {
      initDatas() {
        this.$map = document.getElementById("map");
        let docWidth = document.documentElement.clientWidth;
        let docHeight = document.documentElement.clientHeight;
        console.log(docWidth, docHeight);
        this.$map.width = docWidth * 2;
        this.$map.height = docHeight * 1.5;
        this.unitSize = parseInt(docHeight / this.divs);
        this.cols = parseInt(this.$map.width / this.unitSize);
        this.rows = parseInt(this.$map.height / this.unitSize);
      },

      createMap(map, unitSize, cols, rows) {
        var ctx = map.getContext("2d");
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        
        //画x坐标线
        for (let i = 0; i < cols; i++) {
          ctx.beginPath();
          ctx.moveTo(unitSize * i + 0.5, 0);
          ctx.lineTo(unitSize * i + 0.5, unitSize * rows + 0.5);
          ctx.stroke();
        }
        //画y坐标线
        for (let i = 0; i < rows; i++) {
          ctx.beginPath();
          ctx.moveTo(0, unitSize * i + 0.5);
          ctx.lineTo(unitSize * cols + 0.5, unitSize * i + 0.5);
          ctx.stroke();
        }
        
        //偏移0.5px来修复1px像素线bug,偏移后右/下线看不到,所以再补回来
        ctx.moveTo(0, unitSize * rows - 0.5);
        ctx.lineTo(unitSize * cols - 0.5, unitSize * rows - 0.5);
        ctx.stroke();
        ctx.moveTo(unitSize * cols - 0.5, 0);
        ctx.lineTo(unitSize * cols - 0.5, unitSize * rows - 0.5);
        ctx.stroke();
      }
    },
    components: {

    }
  }
</script>

<style>
  .mapWrap{
    width: 100%;
    height: 100%;
    overflow: auto;
    overflow: -moz-scrollbars-none;
    -webkit-overflow-scrolling:auto;
  }
  .mapWrap::-webkit-scrollbar { width: 0 !important; display: none; }
  #map {
    background: #333;
  }
</style>
