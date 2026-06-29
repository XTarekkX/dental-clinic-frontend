import { useQuery } from '@tanstack/react-query'
import { getInvoicePayments } from '../api/invoices.api'
import { queryKeys } from '../utils/queryKeys'

export const useInvoicePayments = (invoiceId: number | null) => {
  return useQuery({
    queryKey: invoiceId
      ? queryKeys.invoices.payments(invoiceId)
      : queryKeys.invoices.payments(0),
    queryFn: () => getInvoicePayments(invoiceId as number),
    enabled: invoiceId !== null,
  })
}
