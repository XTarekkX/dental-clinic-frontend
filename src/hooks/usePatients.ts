import { useQuery } from '@tanstack/react-query'
import { getPatients } from '../api/patients.api'
import { queryKeys } from '../utils/queryKeys'

interface UsePatientsParams {
  page: number
  size: number
  search: string
}

export const usePatients = ({ page, size, search }: UsePatientsParams) => {
  return useQuery({
    queryKey: queryKeys.patients.list(page, size, search),
    queryFn: () => getPatients({ page, size, search }),
    placeholderData: (previousData) => previousData,
  })
}