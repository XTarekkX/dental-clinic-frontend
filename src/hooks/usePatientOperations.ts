import { useQuery } from '@tanstack/react-query'
import { getOperationsByPatientId } from '../api/operations.api'
import { queryKeys } from '../utils/queryKeys'

export const usePatientOperations = (patientId: number) => {
  return useQuery({
    queryKey: queryKeys.patients.operations(patientId),
    queryFn: () => getOperationsByPatientId(patientId),
    enabled: Number.isFinite(patientId),
  })
}