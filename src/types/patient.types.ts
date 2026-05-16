export type Gender = 'MALE' | 'FEMALE' | 'OTHER'

export interface Patient {
  id: number
  firstName: string
  lastName: string
  age: number
  dateOfBirth: string
  gender: Gender
  phone: string
  email: string
  address: string
  bloodType: string
  allergies: string
  emergencyContact: string
  emergencyPhone: string
  createdAt: string
  updatedAt: string
}

export interface PatientRequest {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: Gender
  phone: string
  email: string
  address: string
  bloodType: string
  allergies: string
  emergencyContact: string
  emergencyPhone: string
}

export interface PatientsQueryParams {
  page?: number
  size?: number
  search?: string
}