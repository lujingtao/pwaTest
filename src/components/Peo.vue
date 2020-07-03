<template>
  <section component="Peo" class="peo">
    <ul class="lines">
      <li class="item">
        <span class="line hp"><i :style="{'width':hpPerc+'%'}"></i></span>
      </li>
      <li class="item">
        <span class="line dur"><i :style="{'width':headPerc+'%'}"></i></span>
      </li>
      <li class="item">
        <span class="line dur"><i :style="{'width':bodyPerc+'%'}"></i></span>
      </li>
    </ul>
    <span v-if="peo._equips" class="equips">
      <i v-if="peo._equips.body" :class="['body', 'iconfont','icon-'+peo._equips.body.type+'-'+peo._equips.body.qua]"></i>
      <i v-if="peo._equips.leftHand" :class="['leftHand', 'iconfont','icon-'+peo._equips.leftHand.type+'-'+peo._equips.leftHand.qua]"></i>
      <i v-if="peo._equips.rightHand" :class="['rightHand', 'iconfont','icon-'+peo._equips.rightHand.type+'-'+peo._equips.rightHand.qua]"></i>
    </span>
    <div class="name">{{peo.name}}</div>
    <span class="peoAP">
      <i v-for="i in 6">
        <s v-show="i<=peo._ap"></s>
      </i>
    </span>
  </section>
</template>

<script>
  export default {
    data() {
      return {
        hpPerc: 0,
        headPerc: 0,
        bodyPerc: 0,
      }
    },
    props: ["peo"],
    watch: {
      peo: {
        handler(newValue, oldValue) {
          console.log("peo属性变更");
          console.log(newValue);
          this.update()
        },
        deep: true
      }
    },
    mounted() {
      this.update()
    },
    methods: {
      update() {
        this.hpPerc = Math.round(this.peo.hp / this.peo.hpMax * 100);

        this.headPerc = this.peo._equips && this.peo._equips.head ? Math.round(this.peo._equips.head.dur / this.peo._equips
          .head.durMax *
          100) : 0;

        this.bodyPerc = this.peo._equips && this.peo._equips.body ? Math.round(this.peo._equips.body.dur / this.peo._equips
          .body.durMax *
          100) : 0;
      }
    },
  }
</script>

<style lang="scss">
  .peo {
    position: absolute;
    top: 2px;
    bottom: 1px;
    right: 1px;
    left: 2px;

    .lines {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      text-align: left;
      line-height: 12px;

      .item {
        position: relative;
      }
    }

    .line {
      text-align: center;
      display: block;
      background: #545454;
      height: 2px;
      border-bottom: 1px solid #000;

      i {
        display: block;
        height: 100%;
        background: #15d400;
      }
    }

    .dur i {
      background: #b9b9b9;
    }

    .name {
      font-size: 12px;
      position: absolute;
      left: 0;
      bottom: 0;
      background: #039fff;
      height: 20px;
      line-height: 20px;
      padding: 0 5px;
    }

    .iconfont {
      position: absolute;
      top: 6px;
      left: 0.25em;
      font-size: 0.7em;
      opacity: 0.5;
    }

    .leftHand {
      opacity: 1;
      text-shadow: 1px 1px 2px #000;
    }

    .rightHand {
      font-size: .4em;
      left: auto;
      top: auto;
      right: -5px;
      bottom: -2px;
      color: #fff;
      opacity: 1;
      text-shadow: 1px 1px 2px #000;
    }
  }
</style>
