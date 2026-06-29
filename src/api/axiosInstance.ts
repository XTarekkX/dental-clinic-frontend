import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosRequestHeaders,
} from 'axios'
import { API_BASE_URL, API_ENDPOINTS } from '../utils/constants'
import { useAuthStore } from '../store/authStore'
import type { LoginResponse } from '../types/auth.types'

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken

  if (accessToken) {
    ;(config.headers as AxiosRequestHeaders).Authorization =
      `Bearer ${accessToken}`
  }

  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined

    if (!originalRequest || error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    const { refreshToken, clearAuth, setTokens } = useAuthStore.getState()

    if (!refreshToken) {
      clearAuth()
      return Promise.reject(error)
    }

    try {
      const response = await axios.post<LoginResponse>(
        `${API_BASE_URL}${API_ENDPOINTS.auth.refresh}`,
        { refreshToken },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      const newAccessToken = response.data.accessToken
      setTokens(newAccessToken, response.data.refreshToken)

      originalRequest.headers = {
        ...(originalRequest.headers ?? {}),
        Authorization: `Bearer ${newAccessToken}`,
      } as AxiosRequestHeaders

      return axiosInstance(originalRequest)
    } catch (refreshError) {
      clearAuth()
      return Promise.reject(refreshError)
    }
  },
)
