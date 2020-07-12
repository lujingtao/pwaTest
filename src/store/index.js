import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    gold: 0, 
    date: 0,
    food: 0,
    tool: 0,
    medication: 0,
    arrow: 0,
    curNodeId:"", //当前节点Id
    targetNode:null, //用户点击的目标节点
  },
  mutations: {
    updateStore(state, val) {
      if(!game.curSave) return;
      state.date = game.curSave.date;
      state.gold = game.curSave.gold;
      state.food = game.curSave.food;
      state.tool = game.curSave.tool;
      state.medication = game.curSave.medication;
      state.arrow = game.curSave.arrow;
      state.curNodeId = game.curSave.curNodeId;
    },
    
    change_targetNode(state, val){
      state.targetNode = val;
    }
  },
  actions: {},
  modules: {}
})
