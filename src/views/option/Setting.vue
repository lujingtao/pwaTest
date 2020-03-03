<template>
  <div component="Setting" class="scrollWrap">
    <div class="disTable">
      <div class="disTableCell">
        <div class="disInblock">
          <!-- 主内容S -->
          设置
          <!-- 主内容E -->
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
        showBack: 'false',
      }
    },
    mounted() {
      this.showBack = this.$route.query.showBack;
    },
    methods: {
      
    },
    components: {
      FooterNav,
      FooterBack
    }
  }
</script>
