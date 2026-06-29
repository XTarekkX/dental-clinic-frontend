import { useQuery } from '@tanstack/react-query'
import { getPatientAppointments } from '../api/patients.api'
import { queryKeys } from '../utils/queryKeys'

export const usePatientAppointments = (patientId: number | null) => {
  return useQuery({
    queryKey: patientId
      ? queryKeys.patients.appointments(patientId)
      : queryKeys.patients.appointments(0),
    queryFn: () => getPatientAppointments(patientId as number),
    enabled: patientId !== null && Number.isFinite(patientId) && patientId > 0,
  })
}
