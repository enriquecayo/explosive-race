/**
 * router/index.ts
 *
 * Manual routes for Game Hub pages.
 */

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Downloads from '@/pages/Downloads.vue'
import Home from '@/pages/Home.vue'
import Login from '@/pages/Login.vue'
import ProfileStats from '@/pages/ProfileStats.vue'

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
    {
      path: '/profile/estadistiques',
      name: 'profile-stats',
      component: ProfileStats,
      meta: {
        requiresAuth: true,
      },
    },
  ],
})

router.beforeEach(async to => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }

  if (to.name === 'login' && authStore.isAuthenticated) {
    return { name: 'profile-stats' }
  }

  return true
})

export default router
