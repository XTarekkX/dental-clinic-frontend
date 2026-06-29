import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { deleteExpense } from '../api/expenses.api'
import { queryKeys } from '../utils/queryKeys'

interface UseDeleteExpenseOptions {
  onSuccess?: () => void
}

export const useDeleteExpense = ({
  onSuccess,
}: UseDeleteExpenseOptions = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all })
      toast.success('Expense deleted successfully')
      onSuccess?.()
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Failed to delete expense'
      toast.error(message)
    },
  })
}
