export interface Expense {
  id: number
  doctorId: number
  doctorFullName: string
  category: string
  description: string | null
  amount: number
  expenseDate: string
  createdAt: string
}

export interface ExpenseRequest {
  category: string
  description?: string | null
  amount: number
  expenseDate: string
}

export interface ExpensesQueryParams {
  doctorId: number
  startDate: string
  endDate: string
  page?: number
  size?: number
}
