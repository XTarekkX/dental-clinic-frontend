import { useQuery } from '@tanstack/react-query'
import { getDashboardStats } from '../api/dashboard.api'
import { queryKeys } from '../utils/queryKeys'

export const useDashboard = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.stats,
    queryFn: getDashboardStats,
  })
}