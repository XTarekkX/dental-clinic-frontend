import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getNotesByPatientId } from '../api/notes.api'
import { queryKeys } from '../utils/queryKeys'

export const useAppointmentNotes = (
  patientId: number | null,
  appointmentId: number | null,
  enabled = true,
) => {
  const notesQuery = useQuery({
    queryKey:
      patientId !== null
        ? [...queryKeys.patients.notes(patientId), 'appointment-linked']
        : ['patients', 'notes', 'none'],
    queryFn: () => getNotesByPatientId(patientId as number),
    enabled: enabled && patientId !== null,
  })

  const notes = useMemo(() => {
    const allNotes = notesQuery.data ?? []
    if (appointmentId === null) return []
    return allNotes.filter((note) => note.appointmentId === appointmentId)
  }, [notesQuery.data, appointmentId])

  return {
    ...notesQuery,
    notes,
  }
}