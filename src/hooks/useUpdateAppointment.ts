import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { updateAppointment } from '../api/appointments.api'
import { queryKeys } from '../utils/queryKeys'
import type { AppointmentRequest } from '../types/appointment.types'

interface UseUpdateAppointmentOptions {
  patientId?: number
  appointmentId?: number | null
  calendarRange?: { start: string; end: string }
  onSuccess?: () => void
}

export const useUpdateAppointment = (
  options?: UseUpdateAppointmentOptions,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      appointmentId,
      payload,
    }: {
      appointmentId: number
      payload: AppointmentRequest
    }) => updateAppointment(appointmentId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.stats,
      })

      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.all,
      })

      if (options?.appointmentId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.appointments.detail(options.appointmentId),
        })
      }

      if (options?.patientId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.patients.appointments(options.patientId),
        })
      }

      if (options?.calendarRange) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.appointments.calendar(
            options.calendarRange.start,
            options.calendarRange.end,
          ),
        })
      }

      toast.success('Appointment updated successfully')
      options?.onSuccess?.()
    },

    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Failed to update appointment'
      toast.error(message)
    },
  })
}