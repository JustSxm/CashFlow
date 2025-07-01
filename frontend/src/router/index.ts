import { useAuthStore } from '@/stores/authStore'
import LoginView from '@/views/LoginView.vue'
import { createRouter, createWebHistory } from 'vue-router'

enum RouteNames {
  Login = 'Login',
  Register = 'Register',
  Dashboard = 'Dashboard',
  Transactions = 'Transactions',
  Accounts = 'Accounts',
  Settings = 'Settings',
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: RouteNames.Login, component: LoginView },
    {
      path: '/register',
      name: RouteNames.Register,
      component: () => import('@/views/RegisterView.vue'),
    },
    {
      path: '/dashboard',
      name: RouteNames.Dashboard,
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/transactions',
      name: RouteNames.Transactions,
      component: () => import('@/views/TransactionsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/accounts',
      name: RouteNames.Accounts,
      component: () => import('@/views/AccountListView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/settings',
      name: RouteNames.Settings,
      component: () => import('@/views/SettingsView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.accessToken) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
export { RouteNames }
