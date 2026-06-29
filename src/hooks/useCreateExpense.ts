import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { createExpense } from '../api/expenses.api'
import { queryKeys } from '../utils/queryKeys'
import type { Expense, ExpenseRequest } from '../types/expense.types'

interface UseCreateExpenseOptions {
  onSuccess?: (expense: Expense) => void
}

export const useCreateExpense = ({
  onSuccess,
}: UseCreateExpenseOptions = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ExpenseRequest) => createExpense(payload),
    onSuccess: (expense) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all })
      toast.success('Expense created successfully')
      onSuccess?.(expense)
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Failed to create expense'
      toast.error(message)
    },
  })
}
