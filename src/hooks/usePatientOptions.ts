import { useQuery } from '@tanstack/react-query'
import { getPatients } from '../api/patients.api'
import { queryKeys } from '../utils/queryKeys'

export const usePatientOptions = () => {
  return useQuery({
    queryKey: queryKeys.patients.list(0, 1000, ''),
    queryFn: () => getPatients({ page: 0, size: 1000, search: '' }),
  })
}