import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Index from '../pages/Index'
import MV from '../pages/MV'

//const Mplayer = resolve => require(['../components/Mplayer'], resolve)

export default new Router({
  //mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [
    { path: '/', component: Index, name: 'index', meta: {keepAlive: true} },
    { path: '/mv/:id', component: MV, name: 'mv', meta: {keepAlive: false} }
  ]
})
