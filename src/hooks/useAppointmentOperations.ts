import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getOperationsByPatientId } from '../api/operations.api'
import { queryKeys } from '../utils/queryKeys'

export const useAppointmentOperations = (
  patientId: number | null,
  appointmentId: number | null,
  enabled = true,
) => {
  const operationsQuery = useQuery({
    queryKey:
      patientId !== null
        ? [...queryKeys.patients.operations(patientId), 'appointment-linked']
        : ['patients', 'operations', 'none'],
    queryFn: () => getOperationsByPatientId(patientId as number),
    enabled: enabled && patientId !== null,
  })

  const operations = useMemo(() => {
    const allOperations = operationsQuery.data ?? []
    if (appointmentId === null) return []
    return allOperations.filter(
      (operation) => operation.appointmentId === appointmentId,
    )
  }, [operationsQuery.data, appointmentId])

  return {
    ...operationsQuery,
    operations,
  }
}