export interface ApiToken {
  type: 'bearer'
  token: string
  expires_at?: string
  expires_in?: number
}

export interface RegisterData {
  email: string
  first_name: string
  last_name: string
  nickname: string
  // status: 'online'
  password: string
  passwordConfirmation: string
}

export interface LoginCredentials {
  nickname: string
  password: string
  remember: boolean
}

export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  nickname: string
  status: string
  createdAt: string,
  updatedAt: string
}
