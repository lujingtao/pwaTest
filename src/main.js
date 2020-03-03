import Data from './class/data/data.json'
window.data = Data;
import Game from './class/Game.js'
window.game = new Game;
game.init();
import './class/Common.js'
import './class/tool/lz-string.js'


import Vue from 'vue'
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);

import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

Vue.config.productionTip = false;
Vue.prototype.data = window.data;
Vue.prototype.game = window.game;

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
