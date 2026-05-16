import { create } from 'zustand'
import type { CurrentUser, LoginResponse } from '../types/auth.types'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: CurrentUser | null
  isAuthenticated: boolean
  setAuth: (payload: LoginResponse) => void
  clearAuth: () => void
  setAccessToken: (accessToken: string) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,

  setAuth: (payload) =>
    set({
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
      user: {
        username: payload.username,
        role: payload.role,
        firstName: payload.firstName,
        lastName: payload.lastName,
      },
      isAuthenticated: true,
    }),

  clearAuth: () =>
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    }),

  setAccessToken: (accessToken) =>
    set((state) => ({
      accessToken,
      isAuthenticated: Boolean(accessToken && state.refreshToken),
    })),
}))