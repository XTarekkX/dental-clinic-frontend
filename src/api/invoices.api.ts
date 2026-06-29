import { axiosInstance } from './axiosInstance'
import type { PaginatedResponse } from '../types/common.types'
import type {
  Invoice,
  InvoiceRequest,
  InvoiceStatus,
  InvoicesQueryParams,
  Payment,
  PaymentRequest,
} from '../types/invoice.types'

interface SpringPage<T> {
  content: T[]
  number?: number
  page?: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}

const normalizePage = <T>(page: SpringPage<T>): PaginatedResponse<T> => ({
  content: page.content,
  page: page.page ?? page.number ?? 0,
  size: page.size,
  totalElements: page.totalElements,
  totalPages: page.totalPages,
  last: page.last,
})

export const getInvoices = async (
  params: InvoicesQueryParams,
): Promise<PaginatedResponse<Invoice>> => {
  const { data } = await axiosInstance.get<SpringPage<Invoice>>(
    '/api/v1/invoices',
    {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 10,
        status: params.status || undefined,
      },
    },
  )

  return normalizePage(data)
}

export const getInvoiceById = async (id: number): Promise<Invoice> => {
  const { data } = await axiosInstance.get<Invoice>(`/api/v1/invoices/${id}`)
  return data
}

export const createInvoice = async (
  payload: InvoiceRequest,
): Promise<Invoice> => {
  const { data } = await axiosInstance.post<Invoice>('/api/v1/invoices', payload)
  return data
}

export const updateInvoice = async (
  id: number,
  payload: InvoiceRequest,
): Promise<Invoice> => {
  const { data } = await axiosInstance.put<Invoice>(
    `/api/v1/invoices/${id}`,
    payload,
  )
  return data
}

export const updateInvoiceStatus = async (
  id: number,
  status: InvoiceStatus,
): Promise<Invoice> => {
  const { data } = await axiosInstance.patch<Invoice>(
    `/api/v1/invoices/${id}/status`,
    null,
    { params: { status } },
  )
  return data
}

export const deleteInvoice = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/api/v1/invoices/${id}`)
}

export const createPayment = async (
  payload: PaymentRequest,
): Promise<Payment> => {
  const { data } = await axiosInstance.post<Payment>('/api/v1/payments', payload)
  return data
}

export const getInvoicePayments = async (
  invoiceId: number,
): Promise<Payment[]> => {
  const { data } = await axiosInstance.get<Payment[]>(
    `/api/v1/payments/invoice/${invoiceId}`,
  )
  return data
}

export const getPatientPayments = async (
  patientId: number,
): Promise<Payment[]> => {
  const { data } = await axiosInstance.get<Payment[]>(
    `/api/v1/payments/patient/${patientId}`,
  )
  return data
}

export const deletePayment = async (paymentId: number): Promise<void> => {
  await axiosInstance.delete(`/api/v1/payments/${paymentId}`)
}
