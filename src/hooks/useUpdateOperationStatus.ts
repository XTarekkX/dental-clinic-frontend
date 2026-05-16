import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { updateOperationStatus } from '../api/operations.api'
import type { OperationStatus } from '../types/operation.types'
import { queryKeys } from '../utils/queryKeys'
import { operationDetailQueryKey } from './useOperationDetail'

interface UseUpdateOperationStatusOptions {
  patientId?: number
  operationId?: number | null
}

interface UpdateOperationStatusVariables {
  operationId: number
  status: OperationStatus
}

export function useUpdateOperationStatus({
  patientId,
  operationId,
}: UseUpdateOperationStatusOptions = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ operationId, status }: UpdateOperationStatusVariables) =>
      updateOperationStatus(operationId, status),

    onSuccess: async (updatedOperation) => {
      toast.success('Operation status updated')

      queryClient.setQueryData(
        operationDetailQueryKey(updatedOperation.id),
        updatedOperation,
      )

      if (patientId) {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.patients.operations(patientId),
        })
      }

      if (operationId) {
        await queryClient.invalidateQueries({
          queryKey: operationDetailQueryKey(operationId),
        })
      }
    },

    onError: () => {
      toast.error('Failed to update operation status')
    },
  })
}