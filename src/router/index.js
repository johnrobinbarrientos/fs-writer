import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/pages/Main'
import Auth from '@/pages/Auth'
import ExportCharacters from '@/pages/ExportCharacters'
import ExportBook from '@/pages/reports/ExportBook'
import ExportScenes from '@/pages/ExportScenes'

import StoreAuth from '@/stores/auth'

Vue.use(Router)

function checkAuth (to, from, next) {
  // } else {
  // check if route is protected
  if (to.meta.protected) {
    var isAuthenticated = StoreAuth.state.isAuthenticated
    console.log('routerjs-isAuthenticated:' + isAuthenticated)
    if (isAuthenticated) {
      next() // allow to enter route
    } else {
      next('/auth') // go to '/auth';
    }
  } else {
    next()
  }
  // }
}
let routeList = [
  {
    path: '/',
    name: 'Main',
    beforeEnter: checkAuth,
    component: Main,
    meta: { protected: true }
  },
  {
    path: '/auth',
    name: 'Auth',
    beforeEnter: checkAuth,
    component: Auth,
    meta: { protected: false }
  }
]

const MWAlist = [
  {
    path: '/export-characters',
    name: 'ExportCharacters',
    component: ExportCharacters,
    meta: { protected: false }
  },
  {
    path: '/export-book',
    name: 'ExportBook',
    component: ExportBook,
    meta: { protected: false }
  },
  {
    path: '/export-scenes',
    name: 'ExportScenes',
    component: ExportScenes,
    meta: { protected: false }
  }
]

if (process.env.NODE_ENV !== 'production') {
  routeList = routeList.concat(MWAlist)
}

export default new Router({
  routes: routeList
})
