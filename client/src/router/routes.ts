import { RouteRecordRaw } from 'vue-router'
import LoginForm from '../components/LoginForm.vue'
import RegisterForm from '../components/RegisterForm.vue'
import LoginBG from 'layouts/AuthTemplate.vue'
import MainLayout from 'layouts/MainLayout.vue'
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: 'home' }
  },
  {
    path: '/auth',
    component: LoginBG,
    children: [
      {
        path: '',
        name: 'login',
        component: LoginForm,
        meta: { guestOnly: true },
        props: { paddingTopValue: 300 }
      },
      {
        path: 'register',
        name: 'register',
        component: RegisterForm,
        meta: { guestOnly: true },
        props: { paddingTopValue: 150 }
      }
    ]
  },
  {
    path: '/channels',
    // channels requires auth
    meta: { requiresAuth: true },
    component: () => MainLayout,
    children: [
      { path: '', name: 'home', component: () => import('pages/ChatPage.vue') }
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
