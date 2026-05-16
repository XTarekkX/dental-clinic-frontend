import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { createPatient } from '../api/patients.api'
import { queryKeys } from '../utils/queryKeys'
import type { PatientRequest } from '../types/patient.types'

interface UseCreatePatientOptions {
  onSuccess?: () => void
}

export const useCreatePatient = (options?: UseCreatePatientOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: PatientRequest) => createPatient(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.patients.all,
      })
      toast.success('Patient created successfully')
      options?.onSuccess?.()
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to create patient'
      toast.error(message)
    },
  })
}