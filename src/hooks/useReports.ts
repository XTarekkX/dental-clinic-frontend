import { useQuery } from '@tanstack/react-query'
import { getReportsBundle } from '../api/reports.api'
import { queryKeys } from '../utils/queryKeys'

interface UseReportsParams {
  startDate: string
  endDate: string
}

export const useReports = ({ startDate, endDate }: UseReportsParams) => {
  return useQuery({
    queryKey: queryKeys.reports.bundle(startDate, endDate),
    queryFn: () => getReportsBundle({ startDate, endDate }),
    enabled: Boolean(startDate && endDate),
  })
}
