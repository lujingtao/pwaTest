<template>
  <div components="Team" class="team">
    <section class="info" v-if="peo">

      <PeoStatus :peo="peo"></PeoStatus>
      <table class="attrTable">
        <tr>
          <td colspan="6"><strong>能力</strong></td>
        </tr>
        <tr>
          <td class="label">攻击：</td>
          <td>{{peo._a.atk}}</td>
          <td class="label">命中：</td>
          <td>{{peo._a.hit}}%</td>
          <td class="label">闪避：</td>
          <td>{{peo._a.dod}}%</td>
        </tr>
        <tr>
          <td class="label">反击：</td>
          <td>{{peo._a.atkb}}%</td>
          <td class="label">先手反击：</td>
          <td>{{peo._a.fatkb}}%</td>
          <td class="label">暴头：</td>
          <td>{{peo._a.hh}}%</td>
        </tr>
        <tr>
          <td class="label">被暴头：</td>
          <td>{{peo._a.hhb}}%</td>
          <td class="label">士气：</td>
          <td>{{peo._a.mor}}</td>
        </tr>
      </table>
      <table class="attrTable">
        <tr>
          <td colspan="6"><strong>属性</strong></td>
        </tr>
        <tr>
          <td class="label">生命：</td>
          <td>{{peo.hp}}
            <van-rate v-model="peo.poten.hp" readonly :count="3" />
          </td>
          <td class="label">力量：</td>
          <td>{{peo.pow}}
            <van-rate v-model="peo.poten.pow" readonly :count="3" />
          </td>
          <td class="label">敏捷：</td>
          <td>{{peo.agi}}
            <van-rate v-model="peo.poten.agi" readonly :count="3" />
          </td>
        </tr>
        <tr>
          <td class="label">先攻：</td>
          <td>{{peo.skill}}
            <van-rate v-model="peo.poten.skill" readonly :count="3" />
          </td>
          <td class="label">幸运：</td>
          <td>{{peo.luck}}
            <van-rate v-model="peo.poten.luck" readonly :count="3" />
          </td>
          <td class="label">意志：</td>
          <td>{{peo.will}}
            <van-rate v-model="peo.poten.will" readonly :count="3" />
          </td>
        </tr>
        <tr>
          <td class="label">耐力：</td>
          <td>{{peo.endu}}
            <van-rate v-model="peo.poten.endu" readonly :count="3" />
          </td>
          <td class="label">移动：</td>
          <td>{{peo.move}}</td>
          <td class="label">工资：</td>
          <td>{{peo.pay}}</td>
        </tr>
      </table>

      <!-- 装备 -->
      <section class="equips" v-if="peo">
        <ul>
          <li v-for="(item,key) in peo._equips" @touchend.prevent="click_equip(key)">
            <div class="in">
              <i v-if="item" :class="['iconfont','icon-'+item.type+'-'+item.qua]"></i>
              <span v-else-if="key=='head'">头</span>
              <span v-else-if="key=='other'">饰</span>
              <span v-else-if="key=='body'">身</span>
              <span v-else-if="key=='leftHand'">左</span>
              <span v-else-if="key=='rightHand'">右</span>
            </div>
          </li>
        </ul>
      </section>

      <table class="attrTable">
        <tr>
          <td colspan="6"><strong>统计</strong></td>
        </tr>
        <tr>
          <td class="label">参战：</td>
          <td>{{peo.battles}}</td>
          <td class="label">场均击杀：</td>
          <td>{{peo.battles==0?0:(peo.kills/peo.battles).toFixed(2)}}</td>
          <td class="label">场均伤害：</td>
          <td>{{peo.battles==0?0:(peo.damages/peo.battles).toFixed(2)}}</td>
        </tr>
        <tr>
          <td class="label">场均命中：</td>
          <td>{{peo.battles==0?0:(peo.hits/peo.battles).toFixed(2)}}</td>
          <td class="label">场均闪避：</td>
          <td>{{peo.battles==0?0:(peo.dodges/peo.battles).toFixed(2)}}</td>
          <td class="label">场均暴击：</td>
          <td>{{peo.battles==0?0:(peo.crits/peo.battles).toFixed(2)}}</td>
        </tr>
      </table>
    </section>

    <section class="peos">
      <ul>
        <li v-for="item in peos" :key="item.id" :id="item.id" @touchstart="click_peo(item)" :class="peo.id==item.id?'active':''">
          <Peo :peo="item"></Peo>
        </li>
      </ul>
    </section>
    <HeaderBar></HeaderBar>
    <FooterNav></FooterNav>

    <!-- 切换装备 -->
    <SwitchEquip v-if="showSwitchEquip" :peo="peo" :equip="peo._equips[equipKey]" :equipKey="equipKey"
      @SwitchEquip_hide="SwitchEquip_hide"></SwitchEquip>
  </div>
</template>

<script>
  import People from '@/class/People.js';
  import Peo from '@/components/Peo.vue';
  import PeoStatus from './components/PeoStatus.vue';
  import SwitchEquip from './components/SwitchEquip.vue';
  export default {
    components: { Peo, SwitchEquip, PeoStatus },
    data() {
      return {
        divs: 13, //多少格
        citys: [],
        peos: [],
        peo: null,
        equipKey: '',
        showSwitchEquip: false,
      }
    },

    created() {
      let peos = game.curSave.myTeam;
      if (peos.length == 0) {
        this.$toast.fail('请先招募队员');
        return;
      }
      peos.forEach(peo=>{
        peo.__proto__ = new People;
        peo.init();
      });
      this.peos = peos;
      this.peo = peos[0];
      this.click_peo(this.peo)
    },
    mounted() {},
    methods: {

      click_peo(item) {
        this.peo = item;
        console.log("当前人物：", this.peo);
      },

      click_equip(key) {
        this.equipKey = key;
        this.showSwitchEquip = true;
      },

      //隐藏装备切换页面
      SwitchEquip_hide() {
        this.showSwitchEquip = false;
        this.peo.updateAbility();
      }
    },
  }
</script>

<style lang="scss">
  .team {
    color: #fff;
    font-size: 12px;

    .peos,
    .formation {
      border-top: 1px solid #777;
      border-bottom: 1px solid #777;
    }

    .info {
      position: absolute;
      left: 10px;
      right: 10px;
      top: 38px;
      bottom: 150px;
      overflow-y: auto;
    }

    .equips {
      margin-bottom: 15px;

      ul {
        display: grid;
        grid-template-columns: repeat(5, 20%);
        grid-template-rows: 50px;
      }

      .in {
        margin: 0 auto;
        height: 100%;
        width: 60px;
        line-height: 50px;
        border: 1px solid #777777;
        vertical-align: middle;
        text-align: center;
        border-radius: 5px;
        color: #888;

        span {
          font-size: 16px;
        }

        .iconfont {
          font-size: 30px;
          color: #fff
        }
      }
    }

    .attrTable {
      width: 100%;
      border-top: 1px solid #777;
      text-align: left;
      margin-bottom: 10px;
      ;

      .label {
        width: 60px;
        text-align: justify;
        text-align-last: justify;
      }

      .van-rate {
        transform: scale(0.7);
      }

      .van-rate__icon {
        font-size: 8px;
      }
    }

    .peos {
      position: absolute;
      left: 0;
      right: 0;
      max-height: 70px;
      padding: 5px 0;
      bottom: 60px;
      overflow-y: hidden;
      word-break: keep-all;
      white-space: nowrap;

      >ul>li {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 60px;
        margin: 5px;
        background: #222;
        line-height: 60px;
        opacity: .8;
      }

      .active {
        opacity: 1;
        position: relative;
        top: -6px;
      }
    }
  }
</style>
