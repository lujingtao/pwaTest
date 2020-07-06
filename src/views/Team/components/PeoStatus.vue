<!-- 人员生命、盔甲等横条信息 -->
<template>
  <div class="PeoStatus">
    <div class="infoTop">
      <span class="pull-right lv">LV<strong>{{peo.level}}</strong></span>
      <span class="name">{{peo.name}}<i>[{{common.getTypeName("peos",peo.type)}}]</i></span>
    </div>
    <ul class="lines">
      <li class="item">
        生命：<span class="line hp"><i :style="{'width':hpPerc+'%'}"></i><b>{{peo.hp+"/"+peo.hpMax}}</b></span>
      </li>
      <li class="item">
        头盔：<span class="line dur"><i :style="{'width':headPerc+'%'}"></i><b>{{headData}}</b></span>
      </li>
      <li class="item">
        盔甲：<span class="line dur"><i :style="{'width':bodyPerc+'%'}"></i><b>{{bodyData}}</b></span>
      </li>
    </ul>
    <div class="buffs">
      <van-tag v-for="item in peo._buffs" :key="item.id" type="success">
        {{ item.type }}
      </van-tag>
    </div>
  </div>
</template>

<script>
  export default {
    props: ["peo"],
    data() {
      return {
        hpPerc:0,
        headPerc:0,
        headData:"0/0",
        bodyPerc:0,
        bodyData:"0/0",
      }
    },
    mounted() {
      this.update()
    },
    watch: {
      peo: {
        handler(newValue, oldValue) {
          this.update()
        },
        deep: true
      }
    },
    methods:{
      update(){
        this.hpPerc = Math.round(this.peo.hp / this.peo.hpMax * 100);
        
        this.headPerc = this.peo._equips.head ? Math.round(this.peo._equips.head.dur / this.peo._equips.head.durMax *
          100) : 0;
        
        this.headData = this.peo._equips.head ? this.peo._equips.head.dur + "/" + this.peo._equips.head.durMax :
          "0/0";
        
        this.bodyPerc = this.peo._equips.body ? Math.round(this.peo._equips.body.dur / this.peo._equips.body.durMax *
          100) : 0;
        
        this.bodyData = this.peo._equips.body ? this.peo._equips.body.dur + "/" + this.peo._equips.body.durMax :
          "0/0";
        
      }
    }
  }
</script>

<style lang="scss">
  .PeoStatus {
    font-size: 12px;
    .infoTop {
      padding: 10px 0;
      text-align: left;
      line-height: 22px;

      .name {
        font-size: 16px;

        i {
          font-size: 14px;
          opacity: .7;
          margin-left: 10px;
          ;
        }
      }

      .lv {
        font-size: 12px;

        strong {
          font-size: 16px;
        }
      }
    }

    .lines {
      position: relative;
      text-align: left;
      line-height: 17px;
      margin-bottom: 5px;

      .item {
        position: relative;
      }
    }

    .line {
      text-align: center;
      display: block;
      position: absolute;
      left: 40px;
      right: 0;
      top: 1px;
      background: #545454;
      height: 14px;
      line-height: 14px;
      border-radius: 10px;
      overflow: hidden;

      i {
        position: absolute;
        left: 0;
        top: 0;
        display: block;
        height: 100%;
        background: #15d400;
        background-image: linear-gradient(to left, #15d400 , #0e9300);
      }

      b {
        font-weight: normal;
        position: relative;
        text-shadow: 1px 1px 0 #000;
      }
    }
    
    .buffs{
      text-align: right;
    }

    .dur {
      i {
        background: #acacac;
        background-image: linear-gradient(to left, #cfcfcf , #828282);
      }
    }
  }
</style>
