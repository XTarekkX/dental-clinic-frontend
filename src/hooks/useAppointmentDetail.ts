import { useQuery } from '@tanstack/react-query'
import { getAppointmentById } from '../api/appointments.api'
import { queryKeys } from '../utils/queryKeys'

export const useAppointmentDetail = (
  appointmentId: number | null,
  enabled = true,
) => {
  return useQuery({
    queryKey:
      appointmentId !== null
        ? queryKeys.appointments.detail(appointmentId)
        : ['appointments', 'detail', 'none'],
    queryFn: () => getAppointmentById(appointmentId as number),
    enabled: enabled && appointmentId !== null,
  })
}