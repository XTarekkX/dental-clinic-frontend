import { useQuery } from '@tanstack/react-query'
import { getInvoiceById } from '../api/invoices.api'
import { queryKeys } from '../utils/queryKeys'

export const useInvoiceDetail = (invoiceId: number | null) => {
  return useQuery({
    queryKey: invoiceId
      ? queryKeys.invoices.detail(invoiceId)
      : queryKeys.invoices.detail(0),
    queryFn: () => getInvoiceById(invoiceId as number),
    enabled: invoiceId !== null,
  })
}
