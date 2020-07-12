<template>
  <div component="Tavern" class="scrollWrap">
    <section class="disTable">
      <div class="disTableCell">
        <div class="disInblock files">
          <!-- 主内容 S -->
          <van-panel v-for="item in peos" :key="item.id" :title="'['+common.getTypeName('peos',item.type)+']'+item.name" :desc="'招募费用：'+item.price+' | 工资：'+item.pay"
            >
            <van-button :disabled="item.price>$store.state.gold" type="primary" @click="clickItem(item)">招募</van-button>
          </van-panel>
          <!-- 主内容 E -->
        </div>
      </div>
    </section>
    <HeaderBar></HeaderBar>
    <FooterNav></FooterNav>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        peos: [],
        total: 0
      }
    },
    created() {
      // game.curSave.gold = 300;
      // this.$store.commit("updateStore");
      
      let id = this.$route.query.id;
      this.peos = game.curSave.peos;
    },
    mounted() {

    },
    methods: {
      clickItem(item) {
        this.$dialog.confirm({
          title: '招募',
          message: '['+common.getTypeName('peos',item.type)+']'+item.name+'，费用：'+item.price
        }).then(() => {
          //减少金钱
          game.curSave.gold -= item.price;
          this.$store.commit("updateStore");
          //队伍添加人物
          game.curSave.myTeam.push(item);
          //删除curSave里面的人物
          let index = game.curSave.peos.findIndex( p=>p.id==item.id );
          game.curSave.peos.splice(index,1);
        }).catch(() => {
          // on cancel
        });
        
      },
      onSubmit() {
        console.log(this.total);
      }
    },
  }
</script>
<style>

</style>
