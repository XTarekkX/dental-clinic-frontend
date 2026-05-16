import axios from 'axios'
import { axiosInstance } from './axiosInstance'
import { API_BASE_URL, API_ENDPOINTS } from '../utils/constants'
import type { LoginRequest, LoginResponse } from '../types/auth.types'

const authApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const { data } = await authApiClient.post<LoginResponse>(
    API_ENDPOINTS.auth.login,
    payload,
  )
  return data
}

export const refreshAccessToken = async (
  refreshToken: string,
): Promise<{ accessToken: string }> => {
  const { data } = await authApiClient.post<{ accessToken: string }>(
    API_ENDPOINTS.auth.refresh,
    { refreshToken },
  )
  return data
}

export const getMe = async () => {
  const { data } = await axiosInstance.get(API_ENDPOINTS.auth.me)
  return data
}

export const logout = async () => {
  const { data } = await axiosInstance.post(API_ENDPOINTS.auth.logout)
  return data
}