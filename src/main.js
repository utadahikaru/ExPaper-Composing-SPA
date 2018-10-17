// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import store from './store'
import echart from 'comp/echart/echart.vue'

// 基本样式
import '../theme/index.css'
import '@/assets/css/style.css'
import '@/assets/css/style.scss'

// 全局组件
import headerMenu from 'comp/header-menu.vue'
import exercise from 'comp/exercise.vue'
import cusRadio from 'comp/cus-radio.vue'

// echart图表
import echarts from 'echarts'
import pie from 'comp/echart/pie.vue'
import barLandscape from 'comp/echart/bar-landscape.vue'
import barNormal from 'comp/echart/bar-normal.vue'

// 全局常量
import global from 'utils/global.js'
import util from 'utils/util.js'
import { pm } from 'utils/msg.js'

//  4个请求方法以及url
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  httpUrl
} from 'utils/fetch.js'

Vue.prototype.$echarts = echarts
Vue.prototype.global = global
Vue.prototype.pm = pm

Vue.prototype.getRequest = getRequest
Vue.prototype.postRequest = postRequest
Vue.prototype.putRequest = putRequest
Vue.prototype.deleteRequest = deleteRequest
Vue.prototype.httpUrl = httpUrl

Vue.use(util)

Vue.use(ElementUI)
Vue.config.productionTip = false

let components = [
  headerMenu,
  exercise,
  echart,
  pie,
  barLandscape,
  barNormal,
  cusRadio
]
components.map(component => {
  Vue.component(component.name, component)
})

// register   
router.beforeEach((to, from, next) => {
  store.dispatch('changePrePagePath', from.path)
  store.dispatch('changeCurrentPagePath', to.path)

  let token = store.state.user.userInfo.token
  if (token !== undefined) {
  } else if (localStorage.getItem('userInfo') !== null) {
    store.commit('setUserInfo')
    token = store.state.user.userInfo.token
  } else {
    token = ''
  }

  // 判断前往的页面是否需要权限
  if (to.meta.requireAuth === true) {
    if (token !== '') {
      if (to.name === 'login') {
        next('/home')
      } else {
        next()
      }
    } else {
      next('/auth/login')
    }
  } else {
    console.log(token);
    
    if (token !== '' && to.name === 'login') {
      next('/home')
    } else {
      next()
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
