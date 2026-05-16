import { axiosInstance } from './axiosInstance'
import type { DashboardStatsResponse } from '../types/dashboard.types'

export const getDashboardStats = async (): Promise<DashboardStatsResponse> => {
  const { data } = await axiosInstance.get<DashboardStatsResponse>(
    '/api/v1/dashboard/stats',
  )
  return data
}