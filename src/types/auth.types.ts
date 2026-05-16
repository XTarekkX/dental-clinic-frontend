export type Role = 'DOCTOR' | 'ADMIN'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  username: string
  role: Role
  firstName: string
  lastName: string
}

export interface CurrentUser {
  username: string
  role: Role
  firstName: string
  lastName: string
}