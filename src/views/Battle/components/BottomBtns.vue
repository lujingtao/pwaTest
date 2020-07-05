<template>
  <div class="btns">
    <van-button v-show="curPeo" @click="click_cancle" type="default" size="small">取消</van-button>
    <van-button v-show="round%2!=0" @click="click_end" type="default" size="small">结束</van-button>
    <van-button @click="click_menu" type="default" size="small">菜单</van-button>

    <van-action-sheet v-model="showOption" :actions="actions" cancel-text="取消" @select="onSelect" />
  </div>
</template>

<script>
  export default {
    props: ["curPeo", "round"],
    data() {
      return {
        active: 0,
        showOption: false,
        actions: [
          { name: '撤退' },
          { name: '开始菜单' }
        ]
      }
    },
    methods: {
      click_cancle() {
        this.$emit("click_cancle")
      },

      click_end() {
        this.$dialog.confirm({
            message: '结束回合',
          })
          .then(() => {
            this.$emit("click_end")
          })
          .catch(() => {
            // on cancel
          });
      },

      click_menu() {
        this.showOption = true;
      },

      onSelect(item) {

        switch (item.name) {
          case "撤退":
            this.$dialog.confirm({
                message: '确定撤退吗？',
              })
              .then(() => {
                this.$router.push('/home');
              })
              .catch(() => {
                // on cancel
              });

            break;
          case "开始菜单":
            this.$dialog.confirm({
                message: '确定返回开始菜单？',
              })
              .then(() => {
                this.$router.push('/');
              })
              .catch(() => {
                // on cancel
              });
            break;
        }

      }
    }
  }
</script>

<style lang="scss" scoped>
  .btns {
    position: absolute;
    bottom: 57px;
    left: 0;
    right: 0;

    .van-button {
      margin: 0 5px;
    }
  }
</style>
