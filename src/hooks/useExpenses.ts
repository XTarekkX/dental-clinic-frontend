import { useQuery } from '@tanstack/react-query'
import { getExpenses } from '../api/expenses.api'
import { queryKeys } from '../utils/queryKeys'

interface UseExpensesParams {
  doctorId: number | null
  startDate: string
  endDate: string
  page: number
  size: number
}

export const useExpenses = ({
  doctorId,
  startDate,
  endDate,
  page,
  size,
}: UseExpensesParams) => {
  return useQuery({
    queryKey: queryKeys.expenses.list(
      doctorId ?? 0,
      startDate,
      endDate,
      page,
      size,
    ),
    queryFn: () =>
      getExpenses({
        doctorId: doctorId as number,
        startDate,
        endDate,
        page,
        size,
      }),
    enabled: doctorId !== null && doctorId > 0,
    placeholderData: (previousData) => previousData,
  })
}
