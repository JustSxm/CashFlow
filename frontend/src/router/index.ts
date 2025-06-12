import LoginView from '@/views/LoginView.vue'
import { createRouter, createWebHistory } from 'vue-router'

enum RouteNames {
  Login = 'Login',
  Register = 'Register',
  Dashboard = 'Dashboard',
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
    },
  ],
})

export default router
export { RouteNames }
