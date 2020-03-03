<template>
  <div components="Battle" class="battle">

    <div id="mapWrap">
      <div id="mapDrag">
        <canvas id="map"></canvas>
        <section id="peos">
          <div v-for="peo in peos" :key="peo.id" class="peo" :id="'peo_'+ peo.id" :style="{transform:'translate3d('+peo.x * map.unitSize+'px,'+peo.y * map.unitSize+'px,0)', width:map.unitSize-3+'px', height:map.unitSize-3+'px', lineHeight:map.unitSize+'px'}">

            <span v-for="g in peo.equip_" :key="g.id" :class="['iconfont','type-'+g.type,'icon-'+g.type+'-'+g.face]"
              :style="{fontSize:map.unitSize+'px'}">
            </span>
            <span class="maxHp">
              <span class="hp" :style="{width:peo.hp/peo.maxHp*100 +'%'}"></span>
            </span>
            <span class="name">{{peo.name}}</span>
          </div>
        </section>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        divs: 12, //竖向屏幕划分多少份
        $peos: null,
        $map: null,
        peos: game.data.peos,
        map: game.map,
      }
    },
    created() {

    },
    mounted() {
      this.initDatas();
      game.map.init();
      //game.people.putPeos();
      game.people.initEvent();
    },
    methods: {

      //初始化数据
      initDatas() {
        this.peos.forEach(peo => {
          peo.equip_ = [];
          peo.equip.forEach(id => {
            let good = game.data.goods.find(g => g.id == id);
            peo.equip_.push(good);
          });

        });

        game.map.$map = document.getElementById("map");
        game.map.$mapDrag = document.getElementById("mapDrag");
        game.people.$peos = document.getElementById("peos");
        let docHeight = document.documentElement.clientHeight;

        game.map.unitSize = parseInt(docHeight / this.divs);
        game.map.cols = Math.round(this.divs * 1);
        game.map.rows = Math.round(this.divs * 1.2);
        game.map.$map.width = game.map.unitSize * game.map.cols;
        game.map.$map.height = game.map.unitSize * game.map.rows;

      },

    },
    components: {

    }
  }
</script>

<style lang="scss">
  .battle {
    #peos {
      position: absolute;
      left: 0;
      top: 0;
    }

    .peo {
      position: absolute;
      left: 0;
      top: 0;
      transition: 400ms;
      background: #0077AA;
      overflow: hidden;
      margin: 2px 0 0 2px;
    }

    .peo .iconfont {
      display: block;
      color: #fff;
      position: absolute;
      left: -1px;
      top: 0;
      text-shadow: #000 1px 1px 0px;
      z-index: 1;
      transform: scale(0.8);
    }

    .peo .hp,
    .peo .maxHp {
      display: block;
      overflow: hidden;
      height: 3px;
      background: #55A532;
    }

    .peo .maxHp {
      background: #1e3a11;
    }

    .peo .type-4 {
      z-index: 0;
      color: #aaa;
      text-shadow: none;
      transform: scale(0.7);
    }

    .peo .name {
      position: absolute;
      left: 0;
      bottom: 0;
      font-size: 12px;
      height: 14px;
      line-height: 14px;
      z-index: 2;
      color: #fff;
      text-shadow: #000 1px 1px 0;
    }
  }
</style>
