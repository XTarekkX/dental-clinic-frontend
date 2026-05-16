import { axiosInstance } from './axiosInstance'
import type { PaginatedResponse } from '../types/common.types'
import type {
  Patient,
  PatientRequest,
  PatientsQueryParams,
} from '../types/patient.types'
import type { Appointment } from '../types/appointment.types'
import type { Note } from '../types/note.types'

export const getPatients = async (
  params: PatientsQueryParams,
): Promise<PaginatedResponse<Patient>> => {
  const { data } = await axiosInstance.get<PaginatedResponse<Patient>>(
    '/api/v1/patients',
    {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 10,
        search: params.search?.trim() || undefined,
      },
    },
  )

  return data
}

export const getPatientById = async (id: number): Promise<Patient> => {
  const { data } = await axiosInstance.get<Patient>(`/api/v1/patients/${id}`)
  return data
}

export const getPatientAppointments = async (
  id: number,
): Promise<Appointment[]> => {
  const { data } = await axiosInstance.get<Appointment[]>(
    `/api/v1/patients/${id}/appointments`,
  )
  return data
}

export const getPatientNotes = async (id: number): Promise<Note[]> => {
  const { data } = await axiosInstance.get<Note[]>(
    `/api/v1/patients/${id}/notes`,
  )
  return data
}

export const createPatient = async (
  payload: PatientRequest,
): Promise<Patient> => {
  const { data } = await axiosInstance.post<Patient>('/api/v1/patients', payload)
  return data
}