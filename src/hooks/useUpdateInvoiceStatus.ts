import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { updateInvoiceStatus } from '../api/invoices.api'
import { queryKeys } from '../utils/queryKeys'
import type { InvoiceStatus } from '../types/invoice.types'

interface UpdateInvoiceStatusPayload {
  id: number
  status: InvoiceStatus
}

export const useUpdateInvoiceStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: UpdateInvoiceStatusPayload) =>
      updateInvoiceStatus(id, status),
    onSuccess: (invoice) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all })
      queryClient.invalidateQueries({
        queryKey: queryKeys.invoices.detail(invoice.id),
      })
      toast.success('Invoice status updated')
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Failed to update invoice'
      toast.error(message)
    },
  })
}
