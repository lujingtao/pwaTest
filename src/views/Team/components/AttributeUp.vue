<!-- 属性升级 -->
<template>
  <div class="AttributeUp">
    <van-dialog ref="dialog" v-model="show" title="请选择3个属性" show-cancel-button :confirm-button-color="confirmButtonColor" :before-close="beforeClose" :message-align="'left'">
      <van-checkbox-group v-model="selecedValue" :max="3">
        <van-cell-group>
          <van-cell v-for="(item, index) in list" clickable :key="item.key" :title="`${item.label}`"
            @touchend.native.prevent.stop="toggle(index)">
            <template #right-icon>
              <van-checkbox :name="item" ref="checkboxes" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
    </van-dialog>
  </div>
</template>

<script>
  export default {
    components: {},
    props: ["peo"],
    data() {
      return {
        list: [],
        selecedValue: [],
        show: false,
        confirmButtonColor:"#666"
      }
    },
    created() {
      // 0星 1-2 1星 1-3 2星 2-3 3星 2-4
      //{ hp: 0, pow: 0, agi: 0, skill: 0, luck: 0, will: 0, endu: 0 };
      let str = { hp: "生命", pow: "力量", agi: "敏捷", skill: "技巧", luck: "幸运", will: "意志", endu: "耐力" };
      let up = this.peo.potenUp[0];
      for (let key in up) {
        this.list.push({
          key: key,
          val: up[key],
          label: `${str[key]} + ${up[key]}`
        })
      }
    },
    mounted() {
    },
    
    watch: {
      selecedValue(newValue, oldValue) {
        if(newValue.length>=3){
          this.confirmButtonColor="#fff";
        }else{
          this.confirmButtonColor="#666";
        }
      }
    },
    
    methods: {
      showDialog() {
        this.show = true;
      },

      //复选框切换状态
      toggle(index) {
        this.$refs.checkboxes[index].toggle();
      },
      
      //弹窗关闭前触发
      beforeClose(action, done) {
        if (action == 'cancel') { done(); return; }
        
        if(this.selecedValue.length<3){
          done(false)
        }else{
          let savePeo = game.curSave.myTeam.find( peo=>peo.id == this.peo.id);
          this.selecedValue.forEach(item=>{
            savePeo[item.key] += item.val;
            if(item.key=="hp"){ //如果是hp则，hp和hpMax都增加
              savePeo.hpMax += item.val;
              this.peo.hp += item.val;
              this.peo.hpMax += item.val;
            }
          });
          this.peo.levelPoints --;
          this.peo.potenUp.shift();
          savePeo.levelPoints = this.peo.levelPoints;
          savePeo.potenUp = JSON.parse(JSON.stringify(this.peo.potenUp));
          this.peo.updateAbility();
          this.selecedValue = [];
          
          console.log(this.peo.potenUp, savePeo.potenUp);
          done();
        }
      },


    },
  }
</script>

<style lang="scss">

</style>
