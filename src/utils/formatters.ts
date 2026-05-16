import { format } from 'date-fns'

export const formatCurrency = (value: number | null | undefined) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value ?? 0)
}

export const formatDateTime = (value: string | null | undefined) => {
  if (!value) return '-'
  return format(new Date(value), 'MMM d, yyyy h:mm a')
}

export const formatDate = (value: string | null | undefined) => {
  if (!value) return '-'
  return format(new Date(value), 'MMM d, yyyy')
}

export const formatTime = (value: string | null | undefined) => {
  if (!value) return '-'
  return format(new Date(value), 'h:mm a')
}

export const formatMonthYear = (value: string | Date) => {
  return format(new Date(value), 'MMMM yyyy')
}

export const formatFullName = (firstName?: string, lastName?: string) => {
  return `${firstName ?? ''} ${lastName ?? ''}`.trim() || '-'
}