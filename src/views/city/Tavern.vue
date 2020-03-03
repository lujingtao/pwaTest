<template>
  <div component="Tavern" class="scrollWrap">
    <section class="disTable">
      <div class="disTableCell">
        <div class="disInblock files">
          <!-- 主内容 S -->
          <van-panel v-for="item in peos" :key="item.id" :title="'['+item.type+']'+item.name" :desc="'招募费用：'+item.price+' | 工资：'+item.pay"
            >
            <van-button :disabled="item.disabled" type="primary" @click="clickItem(item)">招募</van-button>
          </van-panel>
          <!-- 主内容 E -->
        </div>
      </div>
    </section>
    <HeaderBar></HeaderBar>
    <FooterBack></FooterBack>
  </div>
</template>

<script>
  import HeaderBar from '@/components/HeaderBar.vue';
  import FooterBack from '@/components/FooterBack.vue';
  export default {
    data() {
      return {
        peos: [],
        total: 0
      }
    },
    created() {
      //game.curSave = game.load(1);
      //let id = 2;
      let id = this.$route.query.id;
      this.peos = game.curSave.peos.filter(p => p.buildingId == id);
      this.updateCanBuy();
    },
    mounted() {

    },
    methods: {
      updateCanBuy(){
        this.peos.forEach(p => {
          p.disabled = p.price>game.curSave.gold?true:false;
        });
      },
      clickItem(item) {
        this.$dialog.confirm({
          title: '招募',
          message: '['+item.type+']'+item.name+'，费用：'+item.price
        }).then(() => {
          //减少金钱
          game.curSave.gold -= item.price;
          this.$store.commit("updateStore");
          //队伍添加人物
          game.curSave.myTeam.push(item);
          //删除curSave里面的人物
          let index = game.curSave.peos.findIndex( p=>p.id==item.id );
          game.curSave.peos.splice(index,1);
          //删除本页面的人物
          let index1 = this.peos.findIndex( p=>p.id==item.id );
          this.peos.splice(index1,1);
          this.updateCanBuy();
        }).catch(() => {
          // on cancel
        });
        
      },
      onSubmit() {
        console.log(this.total);
      }
    },
    components: {
      FooterBack,HeaderBar
    }
  }
</script>
<style>

</style>
