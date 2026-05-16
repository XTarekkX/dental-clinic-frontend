import type { AppointmentStatus } from '../types/appointment.types'
import type { Operation } from '../types/operation.types'

export const canCreateAppointmentOperation = (
  status: AppointmentStatus,
) => {
  return status === 'IN_PROGRESS'
}

export const shouldShowAppointmentOperationsTab = (
  status: AppointmentStatus,
  operations: Operation[],
) => {
  return status === 'IN_PROGRESS' || status === 'COMPLETED' || operations.length > 0
}