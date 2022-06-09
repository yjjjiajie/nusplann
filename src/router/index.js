import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  
  {
    path: '/moduleinfo',
    name: 'moduleinfo',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../components/moduleinfo/ModuleInfo.vue')
  },
  {
    path: '/acadplan',
    name: 'acadplan',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../components/acadplan/AcadPlan.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
