export type AppointmentStatus =
  | 'OPEN'
  | 'CHECKED_IN'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW'

export interface Appointment {
  id: number
  patientId: number
  patientFullName: string
  doctorId: number
  doctorFullName: string
  scheduledAt: string
  durationMinutes: number
  endsAt: string
  status: AppointmentStatus
  reason: string
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface AppointmentRequest {
  patientId: number
  scheduledAt: string
  durationMinutes: number
  reason: string
}

export interface AppointmentRangeParams {
  start: string
  end: string
  doctorId?: number
}