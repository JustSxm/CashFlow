import LoginView from '@/views/LoginView.vue'
import { createRouter, createWebHistory } from 'vue-router'

enum RouteNames {
  Login = 'Login',
  Register = 'Register',
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
  ],
})

export default router
export { RouteNames }
