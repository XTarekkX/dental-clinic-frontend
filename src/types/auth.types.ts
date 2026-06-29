export type Role = 'DOCTOR' | 'ADMIN'

export interface LoginRequest {
  username: string
  password: string
  rememberMe: boolean
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  username: string
  role: Role
  firstName: string
  lastName: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  role: Role
  firstName: string
  lastName: string
  phone?: string
  specialization?: string
  licenseNumber?: string
}

export interface CurrentUser {
  username: string
  role: Role
  firstName: string
  lastName: string
}
