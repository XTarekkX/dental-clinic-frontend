import { axiosInstance } from './axiosInstance'
import type { Operation, OperationRequest } from '../types/operation.types'

export const getOperationsByPatientId = async (
  patientId: number,
): Promise<Operation[]> => {
  const { data } = await axiosInstance.get<Operation[]>(
    `/api/v1/operations/patient/${patientId}`,
  )
  return data
}

export const getOperationById = async (
  operationId: number,
): Promise<Operation> => {
  const { data } = await axiosInstance.get<Operation>(
    `/api/v1/operations/${operationId}`,
  )
  return data
}

export const createOperation = async (
  payload: OperationRequest,
): Promise<Operation> => {
  const { data } = await axiosInstance.post<Operation>(
    '/api/v1/operations',
    payload,
  )
  return data
}

export const updateOperation = async (
  operationId: number,
  payload: OperationRequest,
): Promise<Operation> => {
  const { data } = await axiosInstance.put<Operation>(
    `/api/v1/operations/${operationId}`,
    payload,
  )
  return data
}

export const updateOperationStatus = async (
  operationId: number,
  status: string,
): Promise<Operation> => {
  const { data } = await axiosInstance.patch<Operation>(
    `/api/v1/operations/${operationId}/status`,
    null,
    {
      params: { status },
    },
  )
  return data
}

export const deleteOperation = async (operationId: number): Promise<void> => {
  await axiosInstance.delete(`/api/v1/operations/${operationId}`)
}