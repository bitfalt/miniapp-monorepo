import { api } from './base'
import { auth as authRoutes } from '@/config/routes'

export interface User {
  id: string
  email: string
  name: string
  walletAddress?: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials extends LoginCredentials {
  name: string
}

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<AuthResponse>(
      authRoutes.signIn(),
      credentials
    )
    return response.data
  },

  register: async (credentials: RegisterCredentials) => {
    const response = await api.post<AuthResponse>(
      authRoutes.register(),
      credentials
    )
    return response.data
  },

  verifyEmail: async (token: string) => {
    const response = await api.post<{ message: string }>(
      '/api/verify/email',
      { token }
    )
    return response.data
  },

  resetPassword: async (email: string) => {
    const response = await api.post<{ message: string }>(
      '/api/auth/reset-password',
      { email }
    )
    return response.data
  },

  updatePassword: async (token: string, password: string) => {
    const response = await api.post<{ message: string }>(
      '/api/auth/update-password',
      { token, password }
    )
    return response.data
  },
} 