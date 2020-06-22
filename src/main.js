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
import 'vant/lib/icon/local.css';
Vue.use(Vant);

import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import HeaderBar from '@/components/HeaderBar.vue';
import FooterBack from '@/components/FooterBack.vue';
import FooterNav from '@/components/FooterNav.vue';

Vue.config.productionTip = false;
Vue.prototype.data = window.data;
Vue.prototype.game = window.game;
Vue.prototype.common = window.common;

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

Vue.component("HeaderBar",HeaderBar)
Vue.component("FooterBack",FooterBack)
Vue.component("FooterNav",FooterNav)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
