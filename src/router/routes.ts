import { RouteRecordRaw } from 'vue-router'
import LoginForm from '../components/LoginForm.vue'
import RegisterForm from '../components/RegisterForm.vue'
import LoginBG from 'layouts/AuthTemplate.vue'
import HomeLayout from 'layouts/HomeLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ChatPage.vue') }]
  },
  {
    path: '/home',
    component: HomeLayout
  }, // AUTH ROUTES /AUTH
  {
    path: '/auth',
    component: LoginBG,
    children: [
      {
        path: '',
        name: 'Login',
        component: LoginForm,
        props: { paddingTopValue: 300 }
      },
      {
        path: 'register',
        name: 'Register',
        component: RegisterForm,
        props: { paddingTopValue: 150 }
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
