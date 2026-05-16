import type { AppointmentStatus } from '../types/appointment.types'

export const appointmentStatusColors: Record<AppointmentStatus, string> = {
  OPEN: '#3b82f6',
  CHECKED_IN: '#f59e0b',
  IN_PROGRESS: '#f97316',
  COMPLETED: '#10b981',
  CANCELLED: '#ef4444',
  NO_SHOW: '#6b7280',
}