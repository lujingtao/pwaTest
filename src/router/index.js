import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Battle from '../views/Battle.vue'
import Team from '../views/Team.vue'
import option_Save from '../views/option/Save.vue'
import option_Load from '../views/option/Load.vue'
import option_Setting from '../views/option/Setting.vue'
import city_home from '../views/city/Home.vue'
import city_market from '../views/city/Market.vue'
import city_tavern from '../views/city/Tavern.vue'
import city_board from '../views/city/Board.vue'
import Start from '../views/Start.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    meta: { title: '开始' },
    component: Team
  },
  {
    path: '/home',
    meta: { title: '世界地图' },
    component: Home
  },
  {
    path: '/Team',
    meta: { title: '队伍' },
    component: Team
  },
  {
    path: '/battle',
    meta: { title: '战场' },
    component: Battle
  },
  {
    path: '/option/Save',
    meta: { title: '存档' },
    component: option_Save
  },
  {
    path: '/option/Load',
    meta: { title: '读档' },
    component: option_Load
  },
  {
    path: '/option/Setting',
    meta: { title: '设置' },
    component: option_Setting
  },
  {
    path: '/city/home',
    meta: { title: '城市首页' },
    component: city_home
  },
  {
    path: '/city/board',
    meta: { title: '任务板' },
    component: city_board
  },
  {
    path: '/city/market',
    meta: { title: '市集' },
    component: city_market
  },
  {
    path: '/city/tavern',
    meta: { title: '酒馆' },
    component: city_tavern
  },
]

const router = new VueRouter({
  routes
})

export default router
