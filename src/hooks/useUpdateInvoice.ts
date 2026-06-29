import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { updateInvoice } from '../api/invoices.api'
import { queryKeys } from '../utils/queryKeys'
import type { InvoiceRequest } from '../types/invoice.types'

interface UpdateInvoicePayload {
  id: number
  values: InvoiceRequest
}

interface UseUpdateInvoiceOptions {
  onSuccess?: () => void
}

export const useUpdateInvoice = ({ onSuccess }: UseUpdateInvoiceOptions = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, values }: UpdateInvoicePayload) =>
      updateInvoice(id, values),
    onSuccess: (invoice) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all })
      queryClient.invalidateQueries({
        queryKey: queryKeys.invoices.detail(invoice.id),
      })
      toast.success('Invoice updated successfully')
      onSuccess?.()
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Failed to update invoice'
      toast.error(message)
    },
  })
}
