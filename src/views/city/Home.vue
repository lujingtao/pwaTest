<template>
  <div component="Home" class="disTable">
    <div class="disTableCell">
      <div class="disInblock menuBtns">
        <h5 style="color: #fff;margin-top:0;">{{city.name}}</h5>
        <van-button :block="true" v-for="item in city.children" :key="item.id" type="default" @click="clickCity(item)">{{item.name}}</van-button>
        </van-popup>
      </div>
    </div>
    <HeaderBar></HeaderBar>
    <FooterNav></FooterNav>
  </div>
</template>

<script>
  import HeaderBar from '@/components/HeaderBar.vue';
  import FooterNav from '@/components/FooterNav.vue';
  export default {
    data() {
      return {
        city: {},
      }
    },
    created() {
      let cityId = this.$route.query.id;
      this.city = game.curSave.buildings.find(c => c.id == cityId);
    },
    mounted() {

    },
    methods: {
      //点击城市事件
      clickCity(item) {
        this.$router.push("/city/"+item.en+"?id=" + item.parentId)
      },
    },
    components: {
      FooterNav,HeaderBar
    }
  }
</script>
<style>

</style>
