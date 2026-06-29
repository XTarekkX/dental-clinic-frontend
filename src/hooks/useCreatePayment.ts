import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { createPayment } from '../api/invoices.api'
import { queryKeys } from '../utils/queryKeys'
import type { PaymentRequest } from '../types/invoice.types'

interface UseCreatePaymentOptions {
  invoiceId: number | null
  onSuccess?: () => void
}

export const useCreatePayment = ({
  invoiceId,
  onSuccess,
}: UseCreatePaymentOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: PaymentRequest) => createPayment(payload),
    onSuccess: (payment) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all })
      queryClient.invalidateQueries({
        queryKey: queryKeys.invoices.detail(payment.invoiceId),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.invoices.payments(payment.invoiceId),
      })
      if (invoiceId && invoiceId !== payment.invoiceId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.invoices.payments(invoiceId),
        })
      }
      toast.success('Payment recorded successfully')
      onSuccess?.()
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Failed to record payment'
      toast.error(message)
    },
  })
}
