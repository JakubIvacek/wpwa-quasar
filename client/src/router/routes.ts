import { RouteRecordRaw } from 'vue-router'
import LoginForm from '../components/LoginForm.vue'
import RegisterForm from '../components/RegisterForm.vue'
import LoginBG from 'layouts/AuthTemplate.vue'
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    // try redirect to home route
    redirect: () => ({ name: 'home' })
  },
  {
    path: '/auth',
    component: LoginBG,
    children: [
      {
        path: '',
        name: 'Login',
        component: LoginForm,
        meta: { guestOnly: true },
        props: { paddingTopValue: 300 }
      },
      {
        path: 'register',
        name: 'Register',
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
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('src/pages/ChannelPage.vue') }
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
