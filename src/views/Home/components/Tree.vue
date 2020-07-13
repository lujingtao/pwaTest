<template>
  <ul>
    <li v-for="item in nodes" :key="item.id" :class="item.type" :id="'node-'+item.id">
      <a :class="'state-'+item.state" @touchend.prevent.stop="click_node(item)">
        <i :class="'iconfont icon-'+['camp','battle','event'][item.type]"></i>
        <span class="size">
          <van-icon v-for="n in item.size" name="star" />
        </span>
      </a>
      <Tree v-if="item.children && item.children.length>0" :nodes="item.children" :myTeam="myTeam"></Tree>
    </li>
  </ul>
</template>

<script>
  import { getCurNodeById, createGoods } from "@/class/Tool.js"
  export default {
    name: "Tree",
    props: ['nodes', 'myTeam'],
    data() {
      return {}
    },

    methods: {
      //点击节点
      click_node(item) {
        //当前节点不操作
        if (game.curSave.curNodeId == item.id) return;
        this.$store.commit("change_targetNode", item);

        this.showDialog(item, () => {
          game.curSave.myTeam.forEach(peo => { //人员总天数+1
            peo.dates++;
          })
          if (item.state == 1) { //已探索
            this.updateCurNode(item);
            return;
          }
          switch (item.type) { //未探索
            case 2: //事件
              this.updateCurNode(item);
              this.createNodes(item);
              break;
            case 1: //战场
              if (game.curSave.myTeam.length == 0) {
                this.$toast.fail('请先招募队员');
                return;
              }
              this.$router.push("/battle")
              //this.updateCurNode(item);
              break;
            default: //营地
              //createGoods();
              this.updateCurNode(item);
              this.createNodes(item);
              break;
          }
        });

      },

      //弹窗
      showDialog(item, callBack) {
        this.$dialog.confirm({
            title: '移动到' + item.id,
            message: ['营地', '战场', '事件'][item.type] + " [" + ['未探索', '已探索', '当前'][item.state] + "]，规模 [" + item.size +
              "]",
          })
          .then(() => {
            if (callBack) {
              callBack();
            }
          })
          .catch(() => {});
      },

      //更新当前节点
      updateCurNode(item) {
        this.recoveryHp();

        let curNode = getCurNodeById(game.curSave.curNodeId, game.curSave.nodes);
        curNode.state = 1;
        item.state = 2;
        game.curSave.curNodeId = item.id;
        game.curSave.date++;
        this.$store.commit("updateStore");
      },

      //恢复人员血量,每天恢复30%
      recoveryHp() {
        this.myTeam.forEach(peo => {
          peo.hp += Math.round(peo.hpMax * 0.3);
          peo.hp = peo.hp > peo.hpMax ? peo.hpMax : peo.hp;

          let savePeo = game.curSave.myTeam.find(p => p.id == peo.id);
          savePeo.hp = peo.hp;
          savePeo.hp = savePeo.hp > savePeo.hpMax ? savePeo.hpMax : savePeo.hp;
        })
      },

      //创建多个地图节点
      createNodes(parent, count) {
        count = count == undefined ? common.random(1, 3) : count;
        for (var i = 0; i < count; i++) {
          let type = common.getNumberInAppoint([
            [0, 0.1],
            [1, 0.7],
            [2, 0.2]
          ]);
          parent.children.push(
            this.createNode(type, 0, parent.depth + 1, parent.index, i)
          )
        }
      },

      //创建单个地图节点
      createNode(type, state, depth, parentIndex, index) {
        return {
          id: depth + "-" + parentIndex + "-" + index,
          depth: depth,
          index: index,
          type: type, //0:营地， 1:战场  2:事件
          state: state, //0:未探索， 1:已探索  2:当前
          size: common.getNumberInAppoint([
            [1, 0.1],
            [2, 0.2],
            [3, 0.4],
            [4, 0.2],
            [5, 0.1]
          ]), //规模
          children: []
        }
      }
    }
  }
</script>

<style>
  * {
    margin: 0;
    padding: 0;
  }

  .tree {
    position: absolute;
    left: 0;
    right: 0;
    top: 30px;
    bottom: 60px;
    overflow: scroll;
  }

  .tree ul {
    padding-top: 20px;
    position: relative;
    word-break: keep-all;
    white-space: nowrap;
    transition: all 0.5s;
    -webkit-transition: all 0.5s;
    -moz-transition: all 0.5s;
  }

  .tree li {
    vertical-align: top;
    display: inline-block;
    text-align: center;
    list-style-type: none;
    position: relative;
    padding: 20px 5px 0 5px;

    transition: all 0.5s;
    -webkit-transition: all 0.5s;
    -moz-transition: all 0.5s;
  }

  .tree li::before,
  .tree li::after {
    content: '';
    position: absolute;
    top: 0;
    right: 50%;
    border-top: 1px solid #444;
    width: 50%;
    height: 20px;
  }

  .tree li::after {
    right: auto;
    left: 50%;
    border-left: 1px solid #444;
  }

  .tree li:only-child::after,
  .tree li:only-child::before {
    display: none;
  }

  .tree li:only-child {
    padding-top: 0;
  }

  .tree li:first-child::before,
  .tree li:last-child::after {
    border: 0 none;
  }

  .tree li:last-child::before {
    border-right: 1px solid #444;
    border-radius: 0 5px 0 0;
    -webkit-border-radius: 0 5px 0 0;
    -moz-border-radius: 0 5px 0 0;
  }

  .tree li:first-child::after {
    border-radius: 5px 0 0 0;
    -webkit-border-radius: 5px 0 0 0;
    -moz-border-radius: 5px 0 0 0;
  }

  .tree ul ul::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    border-left: 1px solid #444;
    width: 0;
    height: 20px;
  }

  .tree li a {
    border: 1px solid #444;
    padding: 5px 10px;
    text-decoration: none;
    font-family: arial, verdana, tahoma;
    font-size: 11px;
    display: inline-block;
    position: relative;

    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;

    transition: all 0.5s;
    -webkit-transition: all 0.5s;
    -moz-transition: all 0.5s;
  }

  .tree li a.state-0 {}

  .tree li a.state-1 {
    color: #444;
  }

  .tree li a.state-2 {
    color: #55A532;
  }

  .tree li .size {
    position: absolute;
    text-align: center;
    bottom: -8px;
    left: -10px;
    right: -10px;
    transform: scale(0.6);

  }
</style>
