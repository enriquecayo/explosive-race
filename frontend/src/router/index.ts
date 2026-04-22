/**
 * router/index.ts
 *
 * Manual routes for Game Hub pages.
 */

import { createRouter, createWebHistory } from 'vue-router'
import Downloads from '@/pages/Downloads.vue'
import Home from '@/pages/Home.vue'
import Login from '@/pages/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/downloads',
      name: 'downloads',
      component: Downloads,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
  ],
})

export default router
