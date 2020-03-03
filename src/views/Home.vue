<template>
  <div id="home">
    <div id="mapWrap">
      <div id="mapDrag">
        <canvas id="map"></canvas>
        <div class="citys">
          <van-icon name="shop-o" v-for="city in citys" :key="city.id" class="city" :id="'city_'+ city.id" :style="{transform:'translate3d('+city.x * map.unitSize+'px,'+city.y * map.unitSize+'px,0)', width:map.unitSize*city.size+'px', height:map.unitSize*city.size+'px', lineHeight:map.unitSize*city.size+'px', fontSize:map.unitSize*city.size+'px'}" @click="clickCity(city.id)"/>
        </div>
      </div>
    </div>
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
        divs: 30, //竖向屏幕划分多少份
        map: new Map,
        citys: []
      }
    },
    created() {
      //如果是新游戏（当前存档为空）,则创建数据
      if (game.curSave == null) {
        game.curSave = {
          gold:999990,
          date:"",
          food:30,
          repair:100,
          medication:100,
          arrow:30,
          myTeam:[],
          myGoods:[],
          peos:[],
          goods:[],
          buildings:[]
        };
        this.$store.commit("updateStore");
        this.createBuilding();
        this.createPeos();
        this.createGoods();
      }else{
        this.citys = game.curSave.buildings
      }
    },
    mounted() {
      this.initDatas();
      this.map.init();
    },
    methods: {
      //创建物品
      createGoods(){
        for (let i = 0; i < game.goodsUpdateCount; i++) {
          let good = {};
          //先生成类别，根据类别赋予属性，再生成覆盖属性
          good.typeId = common.random(0, data.goods.length - 1);
          let o = data.goods.find(e => e.id == good.typeId);
          this.o2o(o, good);

          good.id = common.createUniqueId();
          good.name = good.type.toString()+good.qua.toString();
          good.buildingId = common.random(1, game.createCityCount);

          game.curSave.goods.push(good);
        }
        console.log("创建物品：");
        console.log(game.curSave.goods);
      },
      
      //创建人物
      createPeos() {
        for (let i = 0; i < game.peosUpdateCount; i++) {
          let peo = {};
          //先生成类别，根据类别赋予属性，再生成覆盖属性
          peo.type = common.random(0, data.peos.length - 1);
          let o = data.peos.find(e => e.id == peo.type);
          this.o2o(o, peo);
          //增加潜力
          peo.poten = { hp:0,pow:0,agi:0,fatk:0,luck:0,will:0,edu:0 };
          for (let s in peo.poten) {
            peo.poten[s] = common.getNumberInAppoint([[1,0.6],[2,0.3],[3,0.1]]);
          }

          peo.id = common.createUniqueId();
          peo.name = common.createRandomName();
          peo.buildingId = common.random(1, game.createCityCount);

          game.curSave.peos.push(peo);
        }
        console.log("创建人物：");
        console.log(game.curSave.peos);
      },

      //根据数据表赋给对象属性和值
      o2o(source, target) {
        for (let k in source) {
          let val = source[k];
          if (isNaN(val)) {
            //数字范围
            if (val.indexOf("~") != -1 && k!="range") {
              let ary = val.split("~");
              target[k] = common.random(Number(ary[0]), Number(ary[1]))
            } else if (val.indexOf("[") != -1) {
              //数组
              val = val.replace("[","").replace("]","");
              if(val==""){
                target[k]=[];
              }else{
                target[k] = val.split(",");
              }
            } else if (val.indexOf("{") != -1) {
              //对象
              target[k] = JSON.parse(val);
            } else {
              //字符串，描述部分读取字典表
              if(k!="des") target[k] = val;
            }
          } else {
            //数字类型
            target[k] = Number(val);
          }

        }
      },

      //创建建筑物
      createBuilding() {
        let city_ = data.building[0];
        let numRange = city_.size.split('~');
        let pointAry = [];

        //创建城市
        for (let i = 1; i < game.createCityCount + 1; i++) {
          let city = {};
          city.id = i;
          city.type = city_.type;
          city.name = city.type + i;
          city.en = city_.en;
          city.parentId = -1;
          city.size = common.random(numRange[0], numRange[1]);
          //随机不重复坐标
          //let point = common.creatPoint(10, this.divs - 10, pointAry);
          let point = [5 * i, 15];
          pointAry.push(point);
          city.x = point[0];
          city.y = point[1];
          city.children = [];

          //根据城市规模创建城市附属建筑
          for (let j = 0; j < city.size; j++) {
            let child = {};
            child.id = i * 10 + j;
            child.parentId = i;
            child.type = data.building[j + 2].type;
            child.name = child.type;
            child.en = data.building[j + 2].en;
            city.children.push(child);
          }
          game.curSave.buildings.push(city);
        }
        this.citys = game.curSave.buildings;
        console.log("创建建筑物：");
        console.log(game.curSave.buildings);
      },


      //初始化数据
      initDatas() {
        this.map.$map = document.getElementById("map");
        this.map.$mapDrag = document.getElementById("mapDrag");
        let docHeight = document.documentElement.clientHeight - 50;

        this.map.unitSize = parseInt(docHeight / this.divs);
        this.map.cols = Math.round(this.divs * 1);
        this.map.rows = Math.round(this.divs * 1);
        this.map.$map.width = this.map.unitSize * this.map.cols;
        this.map.$map.height = this.map.unitSize * this.map.rows;
      },
      //点击城市事件
      clickCity(id) {
        this.$router.push("/city/home?id=" + id)
      },

    },
    components: {
      FooterNav,HeaderBar
    }
  }
</script>

<style>
  #citys {
    position: absolute;
    left: 0;
    top: 0;
  }
  
  .cityMenu {
    width: 70%;
  }

  .cityMenu h5 {
    font-size: 18px;
    margin: 15px 0
  }

  .citys .van-icon {
    position: absolute;
    left: 0;
    top: 0;
    color: #fff;
    background: #222222;
  }
</style>
