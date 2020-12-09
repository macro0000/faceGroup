import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  history: 'true',
  routes: [
    {
      path: '/',
      name: '主界面',
      component: require('@/components/MainPage').default,
      scrollBehavior: function (to, from, savedPosition) {
        if (to.hash) {
          return {
            selector: to.hash
          }
        }
        return savedPosition || { x: 0, y: 0 };
      }
    },
    {
      path: '/about',
      name: '关于我',
      component: require('@/components/About').default,
    }
  ]
})
