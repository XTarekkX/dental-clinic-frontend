import { useQuery } from '@tanstack/react-query'
import { getInvoices } from '../api/invoices.api'
import { queryKeys } from '../utils/queryKeys'
import type { InvoiceStatus } from '../types/invoice.types'

interface UseInvoicesParams {
  page: number
  size: number
  status: InvoiceStatus | ''
}

export const useInvoices = ({ page, size, status }: UseInvoicesParams) => {
  return useQuery({
    queryKey: queryKeys.invoices.list(page, size, status),
    queryFn: () => getInvoices({ page, size, status }),
    placeholderData: (previousData) => previousData,
  })
}
