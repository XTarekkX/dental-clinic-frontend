import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { createOperation } from '../api/operations.api'
import { queryKeys } from '../utils/queryKeys'
import type { OperationRequest } from '../types/operation.types'

interface UseCreateOperationOptions {
  patientId: number
  onSuccess?: () => void
}

export const useCreateOperation = ({
  patientId,
  onSuccess,
}: UseCreateOperationOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: OperationRequest) => createOperation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.patients.operations(patientId),
      })
      toast.success('Operation created successfully')
      onSuccess?.()
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Failed to create operation'
      toast.error(message)
    },
  })
}