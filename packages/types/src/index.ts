// Common interfaces
export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
}

// API responses
export interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}

// Error types
export interface ApiError {
  message: string
  code: string
  status: number
}

// User related types
export interface UserProfile extends BaseEntity {
  email: string
  name: string
  walletAddress?: string
  avatarUrl?: string
}

// Auth types
export interface AuthResponse {
  token: string
  user: UserProfile
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials extends LoginCredentials {
  name: string
}

// Web3 types
export interface WalletInfo {
  address: string
  chainId: number
  network: string
}

// Test types
export interface TestResult {
  id: string
  userId: string
  score: number
  completedAt: Date
  type: 'ideology' | 'personality' | 'intelligence'
}

// API endpoints
export interface ApiEndpoints {
  auth: {
    login: string
    register: string
    verify: string
  }
  user: {
    profile: string
    update: string
  }
  tests: {
    list: string
    start: string
    submit: string
    results: string
  }
} 