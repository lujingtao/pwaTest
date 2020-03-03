<template>
  <div component="footerNav">
    <van-tabbar v-model="active">
      <van-tabbar-item id="f_home" to="/home" icon="location-o">地图</van-tabbar-item>
      <van-tabbar-item id="f_team" to="/team" icon="friends-o">队伍</van-tabbar-item>
      <van-tabbar-item id="f_task" to="/task" icon="flag-o">任务</van-tabbar-item>
      <van-tabbar-item id="f_option" icon="setting-o">功能</van-tabbar-item>
    </van-tabbar>

    <van-action-sheet
      v-model="showOption"
      :actions="actions"
      cancel-text="取消"
      @select="onSelect"
    />
    
  </div>
</template>

<script>
  export default {
    data() {
      return {
        active: 0,
        showOption: false,
        actions:[
          { name: '存档' },
          { name: '读档' },
          { name: '设置' },
          { name: '开始菜单' }
        ]
      }
    },
    mounted() {
      if( this.$route.path.indexOf("/option")!=-1 ){
        this.active=3;
      }else if( this.$route.path.indexOf("/task")!=-1 ){
        this.active=2;
      }else if( this.$route.path.indexOf("/team")!=-1 ){
        this.active=1;
      }
      document.getElementById("f_option").onclick = () => {
        this.showOption = true
      }
    },
    methods: {
      onSelect(item){
        this.showOption=false;
        console.log(item);
        switch (item.name){
          case "存档":
            this.$router.push('/option/save');
            break;
          case "读档":
            this.$router.push('/option/load');
            break;
          case "设置":
            this.$router.push('/option/setting');
            break;
          case "开始菜单":
            this.$router.push('/');
            break;
        }
        
      }
    },
  }
</script>
