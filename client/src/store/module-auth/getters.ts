import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { AuthStateInterface } from './state'

const getters: GetterTree<AuthStateInterface, StateInterface> = {
  isAuthenticated (context) {
    return context.user !== null
  },
  userId (context) {
    return context.user?.id
  },
  userStatus (context) {
    return context.user?.status
  },
  allNotifications (context) {
    return context.allNotifications
  }
}

export default getters
