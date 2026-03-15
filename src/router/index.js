import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/Register.vue')
  },
  {
    path: '/guide',
    name: 'guide',
    component: () => import('@/views/FitnessGuide.vue')
  },
  {
    path: '/equipment',
    name: 'equipment',
    component: () => import('@/views/EquipmentGuide.vue')
  },
  {
    path: '/calorie-calculator',
    name: 'calorieCalculator',
    component: () => import('@/views/CalorieCalculator.vue')
  },
  {
    path: '/fitness-plan',
    name: 'fitnessPlan',
    component: () => import('@/views/FitnessPlan.vue')
  },
  {
    path: '/gym-stores',
    name: 'gymStores',
    component: () => import('@/views/GymStores.vue')

  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/UserProfile.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.name === 'login' && token) {
    next('/')
  } else {
    next()
  }
})

export default router
