import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { deletePayment } from '../api/invoices.api'
import { queryKeys } from '../utils/queryKeys'
import type { Payment } from '../types/invoice.types'

interface UseDeletePaymentOptions {
  patientId: number | null
  onSuccess?: () => void
}

export const useDeletePayment = ({
  patientId,
  onSuccess,
}: UseDeletePaymentOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payment: Payment) => deletePayment(payment.id),
    onSuccess: (_data, payment) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all })
      queryClient.invalidateQueries({
        queryKey: queryKeys.invoices.detail(payment.invoiceId),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.invoices.payments(payment.invoiceId),
      })
      if (patientId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.payments.patient(patientId),
        })
      }
      toast.success('Payment reversed successfully')
      onSuccess?.()
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Failed to reverse payment'
      toast.error(message)
    },
  })
}
