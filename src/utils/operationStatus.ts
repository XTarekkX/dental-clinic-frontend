import type { OperationStatus } from '../types/operation.types'

export const operationStatusLabels: Record<OperationStatus, string> = {
  PLANNED: 'Planned',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
}

export const operationStatusDescriptions: Record<OperationStatus, string> = {
  PLANNED: 'Treatment is planned but has not started yet.',
  IN_PROGRESS: 'Treatment is currently in progress.',
  COMPLETED: 'Treatment has been completed.',
}

export const getNextOperationStatuses = (
  status: OperationStatus,
): OperationStatus[] => {
  switch (status) {
    case 'PLANNED':
      return ['IN_PROGRESS']
    case 'IN_PROGRESS':
      return ['COMPLETED']
    case 'COMPLETED':
      return []
    default:
      return []
  }
}