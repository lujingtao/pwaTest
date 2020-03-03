<template>
  <div component="Load" class="scrollWrap">
    <div class="disTable">
      <div class="disTableCell">
        <div class="disInblock files">
          <!-- 主内容 S -->
          <van-panel v-for="item in saveFiles" :key="item.id" :title="item.id+':'+item.name" :desc="'存档时间:'+item.saveTime"
            @click="clickItem(item)">
          </van-panel>
          <!-- 主内容 E -->
        </div>
      </div>
    </div>

    <div v-if="showBack=='true'">
      <FooterBack></FooterBack>
    </div>
    <div v-else>
      <FooterNav></FooterNav>
    </div>
  </div>
</template>

<script>
  import FooterBack from '../../components/FooterBack.vue'
  import FooterNav from '../../components/FooterNav.vue'
  export default {
    data() {
      return {
        isShowForm: false,
        saveFiles: game.saveFiles,
        showBack: 'false',
      }
    },
    mounted() {
      this.showBack = this.$route.query.showBack;
    },
    methods: {

      //更新
      clickItem(item) {
        game.curSave = game.load(item.id);
        this.$router.push('/home')
      }
    },
    components: {
      FooterNav,
      FooterBack
    }
  }
</script>
