import LoginForm from '../components/LoginForm.vue';
import RegisterForm from '../components/RegisterForm.vue';
import LoginBG from "components/authBG.vue";

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ]
  },

  // AUTH ROUTES /AUTH
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
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
