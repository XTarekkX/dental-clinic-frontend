import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { updateOperation } from '../api/operations.api'
import type { OperationRequest } from '../types/operation.types'
import { queryKeys } from '../utils/queryKeys'
import { operationDetailQueryKey } from './useOperationDetail'

interface UseUpdateOperationOptions {
  patientId?: number
  operationId?: number | null
  onSuccess?: () => void
}

interface UpdateOperationVariables {
  operationId: number
  payload: OperationRequest
}

export function useUpdateOperation({
  patientId,
  operationId,
  onSuccess,
}: UseUpdateOperationOptions = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ operationId, payload }: UpdateOperationVariables) =>
      updateOperation(operationId, payload),

    onSuccess: async (updatedOperation) => {
      toast.success('Operation updated successfully')

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

      onSuccess?.()
    },

    onError: () => {
      toast.error('Failed to update operation')
    },
  })
}