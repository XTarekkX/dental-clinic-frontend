import { axiosInstance } from './axiosInstance'
import type {
  Appointment,
  AppointmentRequest,
  AppointmentStatus,
} from '../types/appointment.types'

export const createAppointment = async (
  payload: AppointmentRequest,
): Promise<Appointment> => {
  const { data } = await axiosInstance.post<Appointment>(
    '/api/v1/appointments',
    payload,
  )
  return data
}

export const getAppointmentsByRange = async (params: {
  start: string
  end: string
}): Promise<Appointment[]> => {
  const { data } = await axiosInstance.get<Appointment[]>(
    '/api/v1/appointments',
    {
      params: {
        start: params.start,
        end: params.end,
      },
    },
  )
  return data
}

export const getAppointmentById = async (
  appointmentId: number,
): Promise<Appointment> => {
  const { data } = await axiosInstance.get<Appointment>(
    `/api/v1/appointments/${appointmentId}`,
  )
  return data
}

export const updateAppointment = async (
  appointmentId: number,
  payload: AppointmentRequest,
): Promise<Appointment> => {
  const { data } = await axiosInstance.put<Appointment>(
    `/api/v1/appointments/${appointmentId}`,
    payload,
  )
  return data
}

export const updateAppointmentStatus = async (
  appointmentId: number,
  status: AppointmentStatus,
): Promise<Appointment> => {
  const { data } = await axiosInstance.patch<Appointment>(
    `/api/v1/appointments/${appointmentId}/status`,
    null,
    {
      params: { status },
    },
  )
  return data
}