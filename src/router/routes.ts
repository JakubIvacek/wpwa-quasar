import { RouteRecordRaw } from 'vue-router'
import LoginForm from '../components/LoginForm.vue'
import RegisterForm from '../components/RegisterForm.vue'
import LoginBG from 'layouts/AuthTemplate.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/auth'
  },
  {
    path: '/home/:channelId',
    component: () => import('layouts/MainLayout.vue'),
    props: true,
    children: [{ path: '', component: () => import('pages/ChatPage.vue') }]
  },
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
