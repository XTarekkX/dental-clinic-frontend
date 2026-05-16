import type { AppointmentStatus } from '../../types/appointment.types'

interface StatusBadgeProps {
  status: AppointmentStatus
}

const statusClassMap: Record<AppointmentStatus, string> = {
  OPEN: 'bg-blue-50 text-blue-700 ring-blue-100',
  CHECKED_IN: 'bg-amber-50 text-amber-700 ring-amber-100',
  IN_PROGRESS: 'bg-orange-50 text-orange-700 ring-orange-100',
  COMPLETED: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  CANCELLED: 'bg-red-50 text-red-700 ring-red-100',
  NO_SHOW: 'bg-slate-100 text-slate-700 ring-slate-200',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-xl px-3 py-1 text-xs font-semibold tracking-wide ring-1',
        statusClassMap[status],
      ].join(' ')}
    >
      {status.replace('_', ' ')}
    </span>
  )
}