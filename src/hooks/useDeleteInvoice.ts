import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { deleteInvoice } from '../api/invoices.api'
import { queryKeys } from '../utils/queryKeys'

interface UseDeleteInvoiceOptions {
  onSuccess?: () => void
}

export const useDeleteInvoice = ({ onSuccess }: UseDeleteInvoiceOptions = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all })
      toast.success('Invoice deleted successfully')
      onSuccess?.()
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Failed to delete invoice'
      toast.error(message)
    },
  })
}
