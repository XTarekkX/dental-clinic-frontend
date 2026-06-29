import { useQuery } from '@tanstack/react-query'
import { getPatientPayments } from '../api/invoices.api'
import { queryKeys } from '../utils/queryKeys'

export const usePatientPayments = (patientId: number | null) => {
  return useQuery({
    queryKey: patientId
      ? queryKeys.payments.patient(patientId)
      : queryKeys.payments.patient(0),
    queryFn: () => getPatientPayments(patientId as number),
    enabled: patientId !== null && Number.isFinite(patientId) && patientId > 0,
  })
}
