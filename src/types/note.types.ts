export interface Note {
  id: number
  patientId: number
  doctorId: number
  doctorFullName: string
  appointmentId: number | null
  appointmentDate: string | null
  content: string
  createdAt: string
  updatedAt: string
}

export interface NoteRequest {
  patientId: number
  appointmentId?: number | null
  content: string
}