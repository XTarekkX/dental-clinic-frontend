import type { AppointmentStatus } from './appointment.types.ts'

export interface DashboardAppointmentItem {
  id: number
  patientId?: number
  patientFullName: string
  doctorId?: number
  doctorFullName?: string
  scheduledAt: string
  durationMinutes: number
  endsAt?: string
  status: AppointmentStatus
  reason: string
  notes?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface DashboardRecentPatientItem {
  id: number
  firstName: string
  lastName: string
  phone?: string | null
  email?: string | null
  createdAt?: string
}

export interface DashboardStatsResponse {
  todayTotal: number
  todayOpen: number
  todayCheckedIn: number
  todayInProgress: number
  todayCompleted: number
  todayCancelled: number
  totalActivePatients: number
  totalAppointmentsAllTime: number
  todayRevenue: number
  upcomingAppointments: DashboardAppointmentItem[]
  recentPatients: DashboardRecentPatientItem[]
}