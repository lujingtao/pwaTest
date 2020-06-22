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
        citys: [],
        divs: 30,
        nodes: []
      }
    },
    
    created() {

    },
    mounted() {
      //如果是新游戏（当前存档为空）,则创建数据
      if (game.curSave == null) {
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
          goods: []
        };
        this.$store.commit("updateStore");
        this.createNodes();
        this.createPeos();
        this.createGoods();
      }
    },

    methods: {
      //创建地图节点
      createNodes() {
        this.nodes.push(this.$refs.tree.createNode(0,2,0,0,0));
        this.$refs.tree.createNodes(this.nodes[0]);
        game.curSave.nodes = this.nodes;
        console.log("创建地图节点", game.curSave.nodes);
      },

      //创建物品
      createGoods() {
        for (let i = 0; i < game.goodsUpdateCount; i++) {
          let good = {};
          //先生成类别，根据类别赋予属性，再生成覆盖属性
          good.type = common.random(0, data.goods.length - 1);
          let o = data.goods.find(e => e.id == good.type);
          this.o2o(o, good);
          good.type = good.id;
          good.id = common.createUniqueId();
          good.name = common.getTypeName("goods", good.type) + good.qua.toString();
          good.durMax = good.dur;

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
          peo.poten = { hp: 0, pow: 0, agi: 0, skill: 0, luck: 0, will: 0, endu: 0 };
          for (let s in peo.poten) {
            peo.poten[s] = common.getNumberInAppoint([
              [0, 0.3],
              [1, 0.4],
              [2, 0.2],
              [3, 0.1]
            ]);
          }
          peo.type = peo.id;
          peo.id = common.createUniqueId();
          peo.name = common.createRandomName();
          peo.level = 0;
          peo.exp = 0;
          peo.hpMax = peo.hp;
          peo.equip = {
            head: '',
            other: '',
            body: '',
            leftHand: '',
            rightHand: '',
          };
          //数据统计相关
          peo.battles = 0;
          peo.kills = 0;
          peo.damages = 0;
          peo.hits = 0; //命中
          peo.dodges = 0; //闪避
          peo.crits = 0; //暴击

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
            if (val.indexOf("~") != -1 && k != "range") {
              let ary = val.split("~");
              target[k] = common.random(Number(ary[0]), Number(ary[1]))
            } else if (val.indexOf("[") != -1) {
              //数组
              val = val.replace("[", "").replace("]", "");
              if (val == "") {
                target[k] = [];
              } else {
                target[k] = val.split(",");
              }
            } else if (val.indexOf("{") != -1) {
              //对象
              target[k] = JSON.parse(val);
            } else {
              //字符串，描述部分读取字典表
              if (k != "des") target[k] = val;
            }
          } else {
            //数字类型
            target[k] = Number(val);
          }

        }
      },
    },
  }
</script>
