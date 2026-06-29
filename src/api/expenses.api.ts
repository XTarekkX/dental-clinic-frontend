import { axiosInstance } from './axiosInstance'
import type { PaginatedResponse } from '../types/common.types'
import type {
  Expense,
  ExpenseRequest,
  ExpensesQueryParams,
} from '../types/expense.types'

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

export const getExpenses = async (
  params: ExpensesQueryParams,
): Promise<PaginatedResponse<Expense>> => {
  const { data } = await axiosInstance.get<SpringPage<Expense>>(
    '/api/v1/expenses',
    {
      params: {
        doctorId: params.doctorId,
        startDate: params.startDate,
        endDate: params.endDate,
        page: params.page ?? 0,
        size: params.size ?? 10,
      },
    },
  )

  return normalizePage(data)
}

export const createExpense = async (
  payload: ExpenseRequest,
): Promise<Expense> => {
  const { data } = await axiosInstance.post<Expense>('/api/v1/expenses', payload)
  return data
}

export const updateExpense = async (
  id: number,
  payload: ExpenseRequest,
): Promise<Expense> => {
  const { data } = await axiosInstance.put<Expense>(
    `/api/v1/expenses/${id}`,
    payload,
  )
  return data
}

export const deleteExpense = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/api/v1/expenses/${id}`)
}
