import { useQuery } from '@tanstack/react-query'
import { getOperationById } from '../api/operations.api'

export const operationDetailQueryKey = (operationId?: number | null) => [
  'operation',
  operationId,
]

export function useOperationDetail(operationId?: number | null) {
  return useQuery({
    queryKey: operationDetailQueryKey(operationId),
    queryFn: () => getOperationById(operationId as number),
    enabled: Boolean(operationId),
  })
}