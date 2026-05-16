import { useQuery } from '@tanstack/react-query'
import {
  getPatientAppointments,
  getPatientById,
} from '../api/patients.api'
import { getNotesByPatientId } from '../api/notes.api'
import { queryKeys } from '../utils/queryKeys'

export const usePatientDetail = (patientId: number) => {
  const patientQuery = useQuery({
    queryKey: queryKeys.patients.detail(patientId),
    queryFn: () => getPatientById(patientId),
    enabled: Number.isFinite(patientId),
  })

  const appointmentsQuery = useQuery({
    queryKey: queryKeys.patients.appointments(patientId),
    queryFn: () => getPatientAppointments(patientId),
    enabled: Number.isFinite(patientId),
  })

  const notesQuery = useQuery({
    queryKey: queryKeys.patients.notes(patientId),
    queryFn: () => getNotesByPatientId(patientId),
    enabled: Number.isFinite(patientId),
  })

  return {
    patientQuery,
    appointmentsQuery,
    notesQuery,
  }
}