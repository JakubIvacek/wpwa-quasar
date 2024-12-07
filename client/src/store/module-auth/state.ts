import { User } from 'src/contracts'

export interface AuthStateInterface {
  user: User | null,
  status: 'pending' | 'success' | 'error',
  errors: { message: string, field?: string }[]
  allNotifications: boolean
}

function state (): AuthStateInterface {
  return {
    user: null,
    status: 'pending',
    errors: [],
    allNotifications: true
  }
}

export default state
