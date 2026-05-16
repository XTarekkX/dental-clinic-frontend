export type OperationStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED'

export interface Operation {
  id: number
  patientId: number
  doctorId: number
  doctorFullName: string
  appointmentId: number | null
  operationType: string
  dentalProblem: string
  treatmentPlan: string
  toothNumber: string | null
  status: OperationStatus
  notes: string | null
  performedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface OperationRequest {
  patientId: number
  appointmentId?: number | null
  operationType: string
  dentalProblem: string
  treatmentPlan: string
  toothNumber?: string | null
  status: OperationStatus
  notes?: string | null
}