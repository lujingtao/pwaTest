<template>
  <div component="Save" class="scrollWrap">
    <div class="disTable">
      <div class="disTableCell">
        <div class="disInblock files">
          <!-- 主内容 S -->
          <van-button icon="plus" :block="true" type="primary" @click="showForm" style="height: 60px;">新建</van-button>
        
          <van-panel v-for="item in saveFiles" :key="item.id" :title="item.id+':'+item.name" :desc="'存档时间:'+item.saveTime"
            @click="update(item)">
            <van-button type="default" @click.stop="del(item)">删除</van-button>
          </van-panel>
          <!-- 主内容 E -->
        </div>
      </div>
    </div>


    <van-dialog v-model="isShowForm" title="新建存档" show-cancel-button @confirm="add">
      <van-field v-model="newName" label="名称" />
    </van-dialog>

    <FooterNav></FooterNav>
  </div>
</template>

<script>
  import FooterNav from '../../components/FooterNav.vue'
  export default {
    data() {
      return {
        isShowForm: false,
        saveFiles: game.saveFiles,
        newName: "新建0"
      }
    },
    mounted() {},
    methods: {
      //新增表单-弹窗
      showForm() {
        this.newName = "新建" + (game.getMaxSaveId()+1);
        this.isShowForm = true;
      },
      //新增
      add() {
        let item = {
          id: game.getMaxSaveId() + 1,
          name: this.newName,
          saveTime: (new Date()).toLocaleString()
        };
        game.saveFiles.push(item);
        game.curSave.id = item.id;
        game.curSave.name = item.name;
        game.curSave.saveTime = item.saveTime;
        game.save( item.id, game.curSave );

      },
      //更新
      update(item) {
        this.$dialog.alert({
          message: '确定覆盖' + item.name + '?',
          showCancelButton: true,
        }).then(() => {
          item.saveTime=(new Date()).toLocaleString();
          game.save(item.id, game.curSave)
        }).catch(() => {

        });
      },
      //删除
      del(item) {
        this.$dialog.alert({
          message: '确定删除' + item.name + '?',
          showCancelButton: true,
        }).then(() => {
          let index = game.saveFiles.findIndex(f => f.id == item.id);
          game.saveFiles.splice(index, 1);
          game.removeSave(item.id);
        }).catch(() => {

        });

      }
    },
    components: {
      FooterNav
    }
  }
</script>
<style>

</style>
