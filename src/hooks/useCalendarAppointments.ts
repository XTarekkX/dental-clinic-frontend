import { useQuery } from '@tanstack/react-query'
import { getAppointmentsByRange } from '../api/appointments.api'
import { queryKeys } from '../utils/queryKeys'

interface UseCalendarAppointmentsParams {
  start: string
  end: string
}

export const useCalendarAppointments = ({
  start,
  end,
}: UseCalendarAppointmentsParams) => {
  return useQuery({
    queryKey: queryKeys.appointments.calendar(start, end),
    queryFn: () => getAppointmentsByRange({ start, end }),
    enabled: Boolean(start && end),
    placeholderData: (previousData) => previousData,
  })
}