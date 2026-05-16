import type { AppointmentStatus } from '../types/appointment.types'

export const getNextAppointmentStatuses = (
  status: AppointmentStatus,
): AppointmentStatus[] => {
  switch (status) {
    case 'OPEN':
      return ['CHECKED_IN', 'CANCELLED', 'NO_SHOW']
    case 'CHECKED_IN':
      return ['IN_PROGRESS', 'CANCELLED']
    case 'IN_PROGRESS':
      return ['COMPLETED']
    case 'COMPLETED':
    case 'CANCELLED':
    case 'NO_SHOW':
      return []
    default:
      return []
  }
}

export const formatAppointmentStatusLabel = (
  status: AppointmentStatus,
): string => {
  switch (status) {
    case 'CHECKED_IN':
      return 'Check In'
    case 'IN_PROGRESS':
      return 'Start Treatment'
    case 'COMPLETED':
      return 'Complete'
    case 'CANCELLED':
      return 'Cancel'
    case 'NO_SHOW':
      return 'No Show'
    case 'OPEN':
      return 'Open'
  }
}