<template>
  <ul>
    <li v-for="item in nodes" :key="item.id" :class="item.type" :id="'node-'+item.id">
      <a :class="'status-'+item.status" @touchend.prevent="click_node(item)">
        <i :class="'iconfont icon-'+['camp','battle','event'][item.type]"></i>
      </a>
      <Tree v-if="item.children && item.children.length>0" :nodes="item.children" :fullNodes="fullNodes"></Tree>
    </li>
  </ul>
</template>

<script>
  export default {
    name: "Tree",
    props: ['nodes','fullNodes'],
    data() {
      return {
      }
    },
    methods: {
      //点击节点
      click_node(item) {

        switch (item.status) {
          case 2:
            break;
          case 1:
            this.showDialog(item,()=>{
              this.updateCurNode(item);
            });
            break;
          default:
            this.showDialog(item,()=>{
              this.updateCurNode(item);
              this.createNodes(item);
            });
            break;
        }
      },

      //弹窗
      showDialog(item, callBack) {
          this.$dialog.confirm({
              title: '移动到' + item.id,
              message: ['营地', '战场', '事件'][item.type] + "，" + ['未探索', '已探索', '当前'][item.status],
            })
            .then(() => {
              if(callBack){
                callBack();
              }
            })
            .catch(() => {});
        },
        
        //更新当前节点
        updateCurNode(item){
          let curNode = this.getCurNode(this.fullNodes);
          curNode.status = 1;
          item.status = 2;
        },
        
        //获取当前节点
        getCurNode(ary){
          for (var i = 0; i < ary.length; i++) {
            let item = ary[i];
            if(item.status==2) return item;
            if(item.children){
              let res = this.getCurNode(item.children);
              if(res) return res;
            }
          }
        },

        //创建地图节点
        createNodes(parent, count) {
          count = count == undefined ? common.random(1, 3) : count;
          this.$set(parent, "children", [])
          //parent.children = [];
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

        createNode(type, status, depth, parentIndex, index) {
          return {
            id: depth + "-" + parentIndex + "-" + index,
            depth: depth,
            index: index,
            type: type, //0:营地， 1:战场  2:事件
            status: status, //0:未探索， 1:已探索  2:当前
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

    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;

    transition: all 0.5s;
    -webkit-transition: all 0.5s;
    -moz-transition: all 0.5s;
  }

  .tree li a.status-0 {}

  .tree li a.status-1 {
    color: #444;
  }

  .tree li a.status-2 {
    color: #55A532;
  }
</style>
