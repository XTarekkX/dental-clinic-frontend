import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { createAppointment } from '../api/appointments.api'
import { queryKeys } from '../utils/queryKeys'
import type { AppointmentRequest } from '../types/appointment.types'

interface UseCreateAppointmentOptions {
  patientId?: number
  onSuccess?: () => void
}

export const useCreateAppointment = (
  options?: UseCreateAppointmentOptions,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AppointmentRequest) => createAppointment(payload),
    onSuccess: () => {
      if (options?.patientId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.patients.appointments(options.patientId),
        })
      }

      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.stats,
      })

      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.all,
      })

      toast.success('Appointment created successfully')
      options?.onSuccess?.()
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to create appointment'
      toast.error(message)
    },
  })
}