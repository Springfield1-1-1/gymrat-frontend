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
  },
  {
    path: '/admin',
    component: () => import('@/views/admin/AdminLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/admin/dashboard'
      },
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('@/views/admin/Dashboard.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('@/views/admin/UserManagement.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'equipment',
        name: 'admin-equipment',
        component: () => import('@/views/admin/EquipmentManagement.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'stores',
        name: 'admin-stores',
        component: () => import('@/views/admin/StoreManagement.vue'),
        meta: { requiresAdmin: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.meta.requiresAdmin) {
    // 需要管理员权限的路由
    if (!token) {
      next('/login')
    } else if (user.role !== 'admin') {
      // 普通用户尝试访问管理员页面，重定向到首页
      console.warn('⚠️ 非管理员尝试访问:', to.path)
      next('/')
    } else {
      next()
    }
  } else if (to.name === 'login' && token) {
    // 已登录用户访问登录页，根据角色跳转
    if (user.role === 'admin') {
      next('/admin/dashboard')
    } else {
      next('/')
    }
  } else {
    next()
  }
})

export default router
