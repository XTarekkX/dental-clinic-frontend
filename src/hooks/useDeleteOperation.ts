import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { deleteOperation } from '../api/operations.api'
import { queryKeys } from '../utils/queryKeys'
import { operationDetailQueryKey } from './useOperationDetail'

interface UseDeleteOperationOptions {
  patientId?: number
  operationId?: number | null
  onSuccess?: () => void
}

export function useDeleteOperation({
  patientId,
  operationId,
  onSuccess,
}: UseDeleteOperationOptions = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (operationId: number) => deleteOperation(operationId),

    onSuccess: async (_, deletedOperationId) => {
      toast.success('Operation deleted successfully')

      queryClient.removeQueries({
        queryKey: operationDetailQueryKey(operationId ?? deletedOperationId),
      })

      if (patientId) {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.patients.operations(patientId),
        })
      }

      onSuccess?.()
    },

    onError: () => {
      toast.error('Failed to delete operation')
    },
  })
}