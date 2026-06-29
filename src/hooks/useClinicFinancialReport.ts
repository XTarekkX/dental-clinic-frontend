import { useQuery } from '@tanstack/react-query'
import { getClinicFinancialReport } from '../api/reports.api'
import { queryKeys } from '../utils/queryKeys'

interface UseClinicFinancialReportParams {
  startDate: string
  endDate: string
}

export const useClinicFinancialReport = ({
  startDate,
  endDate,
}: UseClinicFinancialReportParams) => {
  return useQuery({
    queryKey: queryKeys.reports.clinicFinancial(startDate, endDate),
    queryFn: () => getClinicFinancialReport({ startDate, endDate }),
    enabled: Boolean(startDate && endDate),
  })
}
