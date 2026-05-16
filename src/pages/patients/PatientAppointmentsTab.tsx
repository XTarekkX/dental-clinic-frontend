import { CalendarDays, Clock3 } from 'lucide-react'
import type { Appointment } from '../../types/appointment.types'
import { EmptyState } from '../../components/common/EmptyState'
import { StatusBadge } from '../../components/common/StatusBadge'
import { formatDate, formatTime } from '../../utils/formatters'

interface PatientAppointmentsTabProps {
  appointments: Appointment[]
  onSelectAppointment?: (appointmentId: number) => void
}

export function PatientAppointmentsTab({
  appointments,
  onSelectAppointment,
}: PatientAppointmentsTabProps) {
  if (appointments.length === 0) {
    return (
      <EmptyState
        title="No appointments found"
        description="This patient does not have any appointments yet."
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        Total appointments:{' '}
        <span className="font-semibold">{appointments.length}</span>
      </div>

      {appointments.map((appointment) => (
        <button
          key={appointment.id}
          type="button"
          onClick={() => onSelectAppointment?.(appointment.id)}
          className="block w-full rounded-3xl border border-emerald-100 bg-white p-5 text-left shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50/30 hover:shadow-md"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <CalendarDays className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <h3 className="text-base font-semibold text-slate-900">
                  {appointment.reason}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Doctor: {appointment.doctorFullName}
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-emerald-600" />
                    {formatDate(appointment.scheduledAt)} at{' '}
                    {formatTime(appointment.scheduledAt)}
                  </span>
                  <span>{appointment.durationMinutes} mins</span>
                </div>
              </div>
            </div>

            <StatusBadge status={appointment.status} />
          </div>
        </button>
      ))}
    </div>
  )
}