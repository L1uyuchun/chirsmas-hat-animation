import Vue from 'vue'
import Router from 'vue-router'
import Animation from '@/components/animation'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Animation',
      component: Animation
    }
  ]
})
