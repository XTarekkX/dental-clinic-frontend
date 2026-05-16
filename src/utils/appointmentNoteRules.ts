import type { AppointmentStatus } from '../types/appointment.types'
import type { Note } from '../types/note.types'

export const canCreateAppointmentNote = (status: AppointmentStatus) => {
  return status === 'IN_PROGRESS'
}

export const shouldShowAppointmentNotesTab = (
  status: AppointmentStatus,
  notes: Note[],
) => {
  return status === 'IN_PROGRESS' || status === 'COMPLETED' || notes.length > 0
}