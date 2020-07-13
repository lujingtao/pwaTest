<!-- 更换装备 - 当前装备信息展示 -->
<template>
  <dd components="EquipInfo" class="EquipInfo">
    <div class="icon icon1">
      <i v-if="curItem" :class="['iconfont','icon-'+data.goods.find(g=>g.id==curItem.type).icon]"></i>
      <span v-else-if="equipKey=='leftHand'">左</span>
      <span v-else-if="equipKey=='rightHand'">右</span>
      <span v-else-if="equipKey=='head'">头</span>
      <span v-else-if="equipKey=='body'">身</span>
      <span v-else-if="equipKey=='other'">饰</span>
    </div>

    <ul v-if="curItem">
      <li>{{data.goods.find(g=>g.id==curItem.type).type}}</li>
      <li>{{curItem.price}}</li>
      <li>{{curItem.qua}}</li>
      <li>{{curItem.dur+"/"+curItem.durMax}}</li>
      <li>{{curItem.wei}}</li>
      <li>{{curItem.atk}}</li>
      <li>{{curItem.th==0?"否":"是" }}</li>
      <li>{{curItem.bh+"%"}}</li>
      <li>{{curItem.ba+"%"}}</li>
      <li>{{curItem.pa+"%"}}</li>
      <li>{{curItem.bs+"%"}}</li>
      <li>{{curItem.hit+"%"}}</li>
      <li>{{curItem.hh+"%"}}</li>
      <li>{{curItem.range}}</li>
      <li>
        <van-tag v-for="s in curItem.skill" :key="s" :type="data.skills[s].class=='0'?'default':'success'">{{data.skills[s].type}}</van-tag>
      </li>
      <li>{{JSON.stringify(curItem.effect)}}</li>
      <li>{{data.goods.find(g=>g.id==curItem.type).des}}</li>
    </ul>

    <ul v-else>
      <li v-for="i in emptyList"></li>
    </ul>
  </dd>
</template>

<script>
  export default {
    props: ['curItem', 'equipKey'],
    data() {
      return {
        emptyList: new Array(17)
      }
    },
  }
</script>
