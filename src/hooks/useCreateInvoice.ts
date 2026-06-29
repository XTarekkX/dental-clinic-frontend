import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { createInvoice } from '../api/invoices.api'
import { queryKeys } from '../utils/queryKeys'
import type { InvoiceRequest } from '../types/invoice.types'

interface UseCreateInvoiceOptions {
  onSuccess?: () => void
}

export const useCreateInvoice = ({ onSuccess }: UseCreateInvoiceOptions = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: InvoiceRequest) => createInvoice(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all })
      toast.success('Invoice created successfully')
      onSuccess?.()
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Failed to create invoice'
      toast.error(message)
    },
  })
}
