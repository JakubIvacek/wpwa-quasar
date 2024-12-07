import { User, UserStatus } from 'src/contracts'
import { MutationTree } from 'vuex'
import { AuthStateInterface } from './state'

const mutation: MutationTree<AuthStateInterface> = {
  AUTH_START (state) {
    state.status = 'pending'
    state.errors = []
  },
  AUTH_SUCCESS (state, user: User | null) {
    state.status = 'success'
    state.user = user
  },
  AUTH_ERROR (state, errors) {
    state.status = 'error'
    state.errors = errors
  },
  CHANGE_STATE (state, newState: UserStatus) {
    if (state.user){
      state.user.status = newState
    }
  },
  CHANGE_NOTIFICATIONS (state, allNotifications: boolean) {
    state.allNotifications = allNotifications
  }
}

export default mutation
