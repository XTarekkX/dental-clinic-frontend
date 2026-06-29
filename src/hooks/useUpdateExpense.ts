import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { updateExpense } from '../api/expenses.api'
import { queryKeys } from '../utils/queryKeys'
import type { ExpenseRequest } from '../types/expense.types'

interface UpdateExpensePayload {
  id: number
  values: ExpenseRequest
}

interface UseUpdateExpenseOptions {
  onSuccess?: () => void
}

export const useUpdateExpense = ({
  onSuccess,
}: UseUpdateExpenseOptions = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, values }: UpdateExpensePayload) =>
      updateExpense(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all })
      toast.success('Expense updated successfully')
      onSuccess?.()
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Failed to update expense'
      toast.error(message)
    },
  })
}
