import { create } from 'zustand'
import type { CurrentUser, LoginResponse } from '../types/auth.types'

const AUTH_STORAGE_KEY = 'dental-clinic-auth'

type StoredAuthState = Pick<
  AuthState,
  'accessToken' | 'refreshToken' | 'user' | 'isAuthenticated'
>

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: CurrentUser | null
  isAuthenticated: boolean
  setAuth: (payload: LoginResponse, rememberMe: boolean) => void
  clearAuth: () => void
  setAccessToken: (accessToken: string) => void
  setTokens: (accessToken: string, refreshToken: string) => void
}

const readStoredAuth = (): StoredAuthState | null => {
  const stored =
    localStorage.getItem(AUTH_STORAGE_KEY) ??
    sessionStorage.getItem(AUTH_STORAGE_KEY)

  if (!stored) {
    return null
  }

  try {
    return JSON.parse(stored) as StoredAuthState
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    sessionStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

const writeStoredAuth = (state: StoredAuthState, rememberMe: boolean) => {
  const storage = rememberMe ? localStorage : sessionStorage
  const otherStorage = rememberMe ? sessionStorage : localStorage

  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state))
  otherStorage.removeItem(AUTH_STORAGE_KEY)
}

const updateStoredTokens = (accessToken: string, refreshToken?: string) => {
  const storage = localStorage.getItem(AUTH_STORAGE_KEY)
    ? localStorage
    : sessionStorage.getItem(AUTH_STORAGE_KEY)
      ? sessionStorage
      : null

  if (!storage) {
    return
  }

  const stored = readStoredAuth()

  if (stored) {
    storage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        ...stored,
        accessToken,
        refreshToken: refreshToken ?? stored.refreshToken,
        isAuthenticated: Boolean(accessToken && (refreshToken ?? stored.refreshToken)),
      }),
    )
  }
}

const clearStoredAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY)
  sessionStorage.removeItem(AUTH_STORAGE_KEY)
}

const storedAuth = readStoredAuth()

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: storedAuth?.accessToken ?? null,
  refreshToken: storedAuth?.refreshToken ?? null,
  user: storedAuth?.user ?? null,
  isAuthenticated: storedAuth?.isAuthenticated ?? false,

  setAuth: (payload, rememberMe) => {
    const authState: StoredAuthState = {
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
      user: {
        username: payload.username,
        role: payload.role,
        firstName: payload.firstName,
        lastName: payload.lastName,
      },
      isAuthenticated: true,
    }

    writeStoredAuth(authState, rememberMe)
    set(authState)
  },

  clearAuth: () => {
    clearStoredAuth()
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    })
  },

  setAccessToken: (accessToken) => {
    updateStoredTokens(accessToken)
    set((state) => ({
      accessToken,
      isAuthenticated: Boolean(accessToken && state.refreshToken),
    }))
  },

  setTokens: (accessToken, refreshToken) => {
    updateStoredTokens(accessToken, refreshToken)
    set({
      accessToken,
      refreshToken,
      isAuthenticated: Boolean(accessToken && refreshToken),
    })
  },
}))
