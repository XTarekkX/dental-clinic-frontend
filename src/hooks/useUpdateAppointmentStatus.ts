import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { updateAppointmentStatus } from '../api/appointments.api'
import { queryKeys } from '../utils/queryKeys'
import type { AppointmentStatus } from '../types/appointment.types'

interface UseUpdateAppointmentStatusOptions {
  patientId?: number
  appointmentId?: number | null
  calendarRange?: { start: string; end: string }
  onSuccess?: () => void
}

export const useUpdateAppointmentStatus = (
  options?: UseUpdateAppointmentStatusOptions,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      appointmentId,
      status,
    }: {
      appointmentId: number
      status: AppointmentStatus
    }) => updateAppointmentStatus(appointmentId, status),

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

      toast.success('Appointment status updated')
      options?.onSuccess?.()
    },

    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to update appointment status'
      toast.error(message)
    },
  })
}