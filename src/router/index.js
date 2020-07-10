import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home/Home.vue'
import Battle from '../views/Battle/Battle.vue'
import BattleEnd from '../views/Battle/BattleEnd.vue'
import Team from '../views/Team/Team.vue'
import Option_Save from '../views/Option/Save.vue'
import Option_Load from '../views/Option/Load.vue'
import Option_Setting from '../views/Option/Setting.vue'
import City_market from '../views/City/Market.vue'
import City_tavern from '../views/City/Tavern.vue'
import Start from '../views/Start.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    meta: { title: '开始' },
    component: Start
  },
  {
    path: '/Home',
    meta: { title: '世界地图' },
    component: Home
  },
  {
    path: '/Team',
    meta: { title: '队伍' },
    component: Team
  },
  {
    path: '/Battle',
    meta: { title: 'Battle' },
    component: Battle
  },
  {
    path: '/BattleEnd',
    meta: { title: 'BattleEnd' },
    component: BattleEnd,
    name:'BattleEnd'
  },
  {
    path: '/Option/Save',
    meta: { title: '存档' },
    component: Option_Save
  },
  {
    path: '/Option/Load',
    meta: { title: '读档' },
    component: Option_Load
  },
  {
    path: '/Option/Setting',
    meta: { title: '设置' },
    component: Option_Setting
  },
  {
    path: '/City/market',
    meta: { title: '市集' },
    component: City_market
  },
  {
    path: '/City/tavern',
    meta: { title: '酒馆' },
    component: City_tavern
  },
]

const router = new VueRouter({
  routes
})

export default router
