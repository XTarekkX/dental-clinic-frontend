import { useMemo, useState } from 'react'
import {
  CalendarDays,
  Clock3,
  Stethoscope,
  UserRound,
  FileText,
  Pencil,
} from 'lucide-react'
import { Modal } from './Modal'
import { LoadingSpinner } from './LoadingSpinner'
import { StatusBadge } from './StatusBadge'
import { Tabs } from './Tabs'
import { AppointmentNotesSection } from './AppointmentNotesSection'
import { AppointmentOperationsSection } from './AppointmentOperationsSection.tsx'
import { formatDate, formatTime } from '../../utils/formatters'
import {
  formatAppointmentStatusLabel,
  getNextAppointmentStatuses,
} from '../../utils/appointmentStatus'
import {
  canCreateAppointmentNote,
  shouldShowAppointmentNotesTab,
} from '../../utils/appointmentNoteRules'
import {
  canCreateAppointmentOperation,
  shouldShowAppointmentOperationsTab,
} from '../../utils/appointmentOperationRules.ts'
import { useAppointmentNotes } from '../../hooks/useAppointmentNotes'
import { useAppointmentOperations } from '../../hooks/useAppointmentOperations.ts'
import type { Appointment } from '../../types/appointment.types'

interface AppointmentDetailsModalProps {
  isOpen: boolean
  appointment: Appointment | null | undefined
  isLoading?: boolean
  isSubmitting?: boolean
  onClose: () => void
  onEdit?: () => void
  onAddNote?: () => void
  onAddOperation?: () => void
  onChangeStatus: (status: Appointment['status']) => void
}

type AppointmentModalTab = 'details' | 'notes' | 'operations'

const Field = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string | number | null | undefined
}) => (
  <div className="rounded-2xl border border-emerald-100 bg-white p-4">
    <div className="flex items-center gap-2 text-slate-500">
      {icon}
      <span className="text-xs font-semibold uppercase tracking-[0.14em]">
        {label}
      </span>
    </div>
    <p className="mt-2 text-sm font-medium text-slate-900">{value || '-'}</p>
  </div>
)

export function AppointmentDetailsModal({
  isOpen,
  appointment,
  isLoading = false,
  isSubmitting = false,
  onClose,
  onEdit,
  onAddNote,
  onAddOperation,
  onChangeStatus,
}: AppointmentDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<AppointmentModalTab>('details')

  const appointmentNotesQuery = useAppointmentNotes(
    appointment?.patientId ?? null,
    appointment?.id ?? null,
    Boolean(appointment),
  )

  const appointmentOperationsQuery = useAppointmentOperations(
    appointment?.patientId ?? null,
    appointment?.id ?? null,
    Boolean(appointment),
  )

  const appointmentNotes = appointmentNotesQuery.notes
  const appointmentOperations = appointmentOperationsQuery.operations

  const availableTabs = useMemo(() => {
    if (!appointment) return ['details'] as AppointmentModalTab[]

    const tabs: AppointmentModalTab[] = ['details']

    if (shouldShowAppointmentNotesTab(appointment.status, appointmentNotes)) {
      tabs.push('notes')
    }

    if (
      shouldShowAppointmentOperationsTab(
        appointment.status,
        appointmentOperations,
      )
    ) {
      tabs.push('operations')
    }

    return tabs
  }, [appointment, appointmentNotes, appointmentOperations])

  const nextStatuses = appointment
    ? getNextAppointmentStatuses(appointment.status)
    : []

  const canAddNote = appointment
    ? canCreateAppointmentNote(appointment.status)
    : false

  const canAddOperation = appointment
    ? canCreateAppointmentOperation(appointment.status)
    : false

  return (
    <Modal isOpen={isOpen} title="Appointment Details" onClose={onClose}>
      {isLoading ? (
        <LoadingSpinner />
      ) : !appointment ? (
        <div className="p-6 text-sm text-slate-600">
          Appointment details could not be loaded.
        </div>
      ) : (
        <div className="space-y-6 p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">
                {appointment.patientFullName}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Appointment #{appointment.id}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={appointment.status} />
              {onEdit && (
                <button
                  type="button"
                  onClick={onEdit}
                  className="inline-flex items-center gap-2 rounded-2xl border border-emerald-100 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>
              )}
            </div>
          </div>

          <Tabs
            tabs={availableTabs}
            activeTab={activeTab}
            onChange={(tab) => setActiveTab(tab)}
            labels={{
              details: 'Details',
              notes: 'Notes',
              operations: 'Operations',
            }}
          />

          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field
                  icon={<UserRound className="h-4 w-4" />}
                  label="Patient"
                  value={appointment.patientFullName}
                />
                <Field
                  icon={<Stethoscope className="h-4 w-4" />}
                  label="Doctor"
                  value={appointment.doctorFullName}
                />
                <Field
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Date"
                  value={formatDate(appointment.scheduledAt)}
                />
                <Field
                  icon={<Clock3 className="h-4 w-4" />}
                  label="Time"
                  value={formatTime(appointment.scheduledAt)}
                />
                <Field
                  icon={<Clock3 className="h-4 w-4" />}
                  label="Duration"
                  value={`${appointment.durationMinutes} minutes`}
                />
                <Field
                  icon={<FileText className="h-4 w-4" />}
                  label="Reason"
                  value={appointment.reason}
                />
              </div>

              {nextStatuses.length > 0 && (
                <div>
                  <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Next Actions
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {nextStatuses.map((status) => (
                      <button
                        key={status}
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => onChangeStatus(status)}
                        className="rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-emerald-700 hover:to-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {formatAppointmentStatusLabel(status)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {nextStatuses.length === 0 && (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  This appointment is in a terminal state and no further status transitions are available.
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <>
              {appointmentNotesQuery.isLoading ? (
                <LoadingSpinner />
              ) : (
                <AppointmentNotesSection
                  notes={appointmentNotes}
                  canAddNote={canAddNote}
                  onAddNote={() => onAddNote?.()}
                />
              )}
            </>
          )}

          {activeTab === 'operations' && (
            <>
              {appointmentOperationsQuery.isLoading ? (
                <LoadingSpinner />
              ) : (
                <AppointmentOperationsSection
                  operations={appointmentOperations}
                  canAddOperation={canAddOperation}
                  onAddOperation={() => onAddOperation?.()}
                />
              )}
            </>
          )}
        </div>
      )}
    </Modal>
  )
}