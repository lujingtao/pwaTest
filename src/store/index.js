import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    gold: 0, 
    date: "",
    food: 0,
    repair: 0,
    medication: 0,
    arrow: 0,
  },
  mutations: {
    updateStore(state, val) {
      state.date = common.formatDate(game.curSave.date);
      state.gold = game.curSave.gold;
      state.food = game.curSave.food;
      state.repair = game.curSave.repair;
      state.medication = game.curSave.medication;
      state.arrow = game.curSave.arrow;
    },
  },
  actions: {},
  modules: {}
})
