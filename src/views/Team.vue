<template>
  <div components="Team" class="team">
    <section class="info">

    </section>
    <section class="peos">
      <ul>
        <li v-for="item in peos" :key="item.id">
          {{ item.name }}
        </li>
      </ul>
    </section>
    <section class="formation">
      <div class="title">
        <span class="pull-right">请安排阵型</span>
        <strong>阵型</strong>
      </div>
      
      <div id="mapWrap">
        <div id="mapDrag" style="transform: translate3d(0px,0px,0px);">
          <canvas id="map"></canvas>
          <div class="citys">
            <van-icon name="shop-o" v-for="city in citys" :key="city.id" class="city" :id="'city_'+ city.id" :style="{transform:'translate3d('+city.x * map.unitSize+'px,'+city.y * map.unitSize+'px,0)', width:map.unitSize*city.size+'px', height:map.unitSize*city.size+'px', lineHeight:map.unitSize*city.size+'px', fontSize:map.unitSize*city.size+'px'}"
              @click="clickCity(city.id)" />
          </div>
        </div>
      </div>
    </section>

    <HeaderBar></HeaderBar>
    <FooterNav></FooterNav>
  </div>
</template>

<script>
  import HeaderBar from '@/components/HeaderBar.vue';
  import FooterNav from '@/components/FooterNav.vue';
  import Map from '@/class/Map';
  export default {
    data() {
      return {
        divs: 13, //多少格
        map: new Map,
        citys: [],
        peos:[],
      }
    },
    created() {
      game.curSave = game.load(1);
      this.peos = game.curSave.myTeam;
    },
    mounted() {
      this.initDatas();
      this.map.init({
        $map :document.getElementById("map"),
        $mapDrag :document.getElementById("mapDrag"),
        unitSize :60,
        cols :this.divs,
        rows :3,
        dragY:false,
      });
    },
    methods: {

      //初始化数据
      initDatas() {

      },
    },
    components: {
      FooterNav,
      HeaderBar
    }
  }
</script>

<style lang="scss">
  .team {
    color: #fff;
    font-size: 12px;
    .peos,.formation{
      border-top:1px solid #777;
      border-bottom:1px solid #777;
    }
    .peos{
      position: absolute;
      left:0;
      right: 0;
      height: 60px;
      padding:10px 0;
      background: #404040;
      bottom:231px;
      overflow-x: auto;
      ul{
        white-space: nowrap;
      }
      li{
        display: inline-block;
        width: 60px;
        height: 60px;
        margin-left:10px;
        background: #222;
        line-height: 60px;
      }
    }
    .formation {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 60px;
      height: 161px;
      background: #444;
      .title{
        line-height: 30px;
        text-align: left;
        padding:0 10px;
        color: #999;
        strong{
          font-size: 14px;
          color: #fff;
        }
      }
      #mapWrap {
        background: #222;
        top: 30px;
        bottom: 10px;
        right: 10px;
        left: 10px;
        overflow: hidden;
        width: auto;
        position: absolute;
        height: 121px;
      }

    }
  }
</style>
