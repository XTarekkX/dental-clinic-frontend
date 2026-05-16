import { useMemo, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type {
  DateSelectArg,
  DatesSetArg,
  EventClickArg,
  EventContentArg,
  EventInput,
} from '@fullcalendar/core'
import {
  Plus,
  CalendarDays,
  Stethoscope,
  Clock3,
  UserRound,
} from 'lucide-react'
import { useCalendarAppointments } from '../../hooks/useCalendarAppointments'
import { useCreateAppointment } from '../../hooks/useCreateAppointment'
import { useUpdateAppointmentStatus } from '../../hooks/useUpdateAppointmentStatus'
import { useAppointmentDetail } from '../../hooks/useAppointmentDetail'
import { usePatientOptions } from '../../hooks/usePatientOptions'
import { useUpdateAppointment } from '../../hooks/useUpdateAppointment'
import { useCreateNote } from '../../hooks/useCreateNote'
import { useCreateOperation } from '../../hooks/useCreateOperation'
import { Modal } from '../../components/common/Modal'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { EmptyState } from '../../components/common/EmptyState'
import { AppointmentDetailsModal } from '../../components/common/AppointmentDetailsModal'
import { CalendarAppointmentForm } from '../../components/forms/CalendarAppointmentForm'
import { EditAppointmentForm } from '../../components/forms/EditAppointmentForm'
import { AppointmentNoteForm } from '../../components/forms/AppointmentNoteForm'
import { OperationForm } from '../../components/forms/OperationForm'
import { appointmentStatusColors } from '../../utils/appointmentColors'
import { formatDate, formatMonthYear, formatTime } from '../../utils/formatters'
import type { AppointmentStatus } from '../../types/appointment.types'

function toDateTimeLocal(value: Date) {
  const pad = (num: number) => String(num).padStart(2, '0')
  const year = value.getFullYear()
  const month = pad(value.getMonth() + 1)
  const day = pad(value.getDate())
  const hours = pad(value.getHours())
  const minutes = pad(value.getMinutes())
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

function getStatusPillClass(status: AppointmentStatus) {
  switch (status) {
    case 'OPEN':
      return 'bg-blue-50 text-blue-700 ring-blue-100'
    case 'CHECKED_IN':
      return 'bg-amber-50 text-amber-700 ring-amber-100'
    case 'IN_PROGRESS':
      return 'bg-orange-50 text-orange-700 ring-orange-100'
    case 'COMPLETED':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-100'
    case 'CANCELLED':
      return 'bg-red-50 text-red-700 ring-red-100'
    case 'NO_SHOW':
      return 'bg-slate-100 text-slate-700 ring-slate-200'
    default:
      return 'bg-slate-100 text-slate-700 ring-slate-200'
  }
}

export function AppointmentsPage() {
  const [range, setRange] = useState(() => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    return {
      start: start.toISOString(),
      end: end.toISOString(),
    }
  })

  const [visibleTitle, setVisibleTitle] = useState(() =>
    formatMonthYear(new Date()),
  )

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isCreateAppointmentNoteOpen, setIsCreateAppointmentNoteOpen] =
    useState(false)
  const [isCreateAppointmentOperationOpen, setIsCreateAppointmentOperationOpen] =
    useState(false)
  const [selectedDateTime, setSelectedDateTime] = useState('')
  const [selectedAppointmentId, setSelectedAppointmentId] =
    useState<number | null>(null)

  const appointmentsQuery = useCalendarAppointments(range)
  const patientsQuery = usePatientOptions()

  const appointmentDetailQuery = useAppointmentDetail(
    selectedAppointmentId,
    selectedAppointmentId !== null,
  )

  const createAppointmentMutation = useCreateAppointment({
    onSuccess: () => {
      setIsCreateOpen(false)
      setSelectedDateTime('')
    },
  })

  const updateStatusMutation = useUpdateAppointmentStatus({
    appointmentId: selectedAppointmentId,
    calendarRange: range,
  })

  const updateAppointmentMutation = useUpdateAppointment({
    appointmentId: selectedAppointmentId,
    calendarRange: range,
    onSuccess: () => {
      setIsEditOpen(false)
    },
  })

  const createNoteMutation = useCreateNote({
    patientId: appointmentDetailQuery.data?.patientId ?? 0,
    onSuccess: () => {
      setIsCreateAppointmentNoteOpen(false)
    },
  })

  const createOperationMutation = useCreateOperation({
    patientId: appointmentDetailQuery.data?.patientId ?? 0,
    onSuccess: () => {
      setIsCreateAppointmentOperationOpen(false)
    },
  })

  const appointments = appointmentsQuery.data ?? []

  const calendarEvents = useMemo<EventInput[]>(() => {
    return appointments.map((appointment) => ({
      id: String(appointment.id),
      title: appointment.patientFullName,
      start: appointment.scheduledAt,
      end: appointment.endsAt,
      backgroundColor: appointmentStatusColors[appointment.status],
      borderColor: appointmentStatusColors[appointment.status],
      textColor: '#111827',
      extendedProps: {
        patientFullName: appointment.patientFullName,
        doctorFullName: appointment.doctorFullName,
        reason: appointment.reason,
        status: appointment.status,
      },
    }))
  }, [appointments])

  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((a, b) => {
      return (
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
      )
    })
  }, [appointments])

  const handleDatesSet = (arg: DatesSetArg) => {
    setRange({
      start: arg.start.toISOString(),
      end: arg.end.toISOString(),
    })
    setVisibleTitle(arg.view.title)
  }

  const handleSelect = (arg: DateSelectArg) => {
    setSelectedDateTime(toDateTimeLocal(arg.start))
    setIsCreateOpen(true)
  }

  const handleEventClick = (arg: EventClickArg) => {
    setSelectedAppointmentId(Number(arg.event.id))
  }

  const patients = patientsQuery.data?.content ?? []

  const renderEventContent = (eventInfo: EventContentArg) => {
    const extended = eventInfo.event.extendedProps as {
      patientFullName?: string
      doctorFullName?: string
      status?: AppointmentStatus
    }

    const status = extended.status ?? 'OPEN'
    const color = appointmentStatusColors[status]
    const isMonthView = eventInfo.view.type === 'dayGridMonth'

    if (isMonthView) {
      return (
        <div
          className="calendar-month-event"
          style={{ borderLeft: `4px solid ${color}` }}
        >
          <div className="calendar-month-event__patient">
            {extended.patientFullName || eventInfo.event.title}
          </div>
          <div className="calendar-month-event__doctor">
            {extended.doctorFullName || 'Doctor'}
          </div>
        </div>
      )
    }

    return (
      <div className="calendar-time-event">
        <div className="calendar-time-event__patient">
          {extended.patientFullName || eventInfo.event.title}
        </div>
        <div className="calendar-time-event__doctor">
          {extended.doctorFullName || 'Doctor'}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Calendar
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              View and manage all clinic appointments in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedDateTime('')
              setIsCreateOpen(true)
            }}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-emerald-600"
          >
            <Plus className="h-4 w-4" />
            New Appointment
          </button>
        </div>

        <section className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Appointment Calendar
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Showing appointments for{' '}
                <span className="font-semibold text-slate-700">
                  {visibleTitle}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(
                Object.entries(appointmentStatusColors) as Array<
                  [AppointmentStatus, string]
                >
              ).map(([status, color]) => (
                <div
                  key={status}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700"
                >
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  {status.replace('_', ' ')}
                </div>
              ))}
            </div>
          </div>

          {appointmentsQuery.isError && (
            <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
              Failed to load appointments.
            </div>
          )}

          <div className="overflow-hidden rounded-2xl border border-emerald-100">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }}
              selectable
              selectMirror
              select={handleSelect}
              eventClick={handleEventClick}
              datesSet={handleDatesSet}
              events={calendarEvents}
              eventContent={renderEventContent}
              height="auto"
              dayMaxEvents
              nowIndicator
            />
          </div>

          {appointmentsQuery.isFetching && (
            <div className="mt-3 text-xs font-medium text-emerald-700">
              Updating calendar...
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-emerald-100 bg-white shadow-sm">
          <div className="border-b border-emerald-100 px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                  All Appointments This Month
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  This section updates with the calendar range you are viewing.
                </p>
              </div>
            </div>
          </div>

          {appointmentsQuery.isLoading ? (
            <LoadingSpinner />
          ) : sortedAppointments.length === 0 ? (
            <div className="p-5">
              <EmptyState
                title="No appointments found"
                description="There are no appointments in the currently visible calendar range."
              />
            </div>
          ) : (
            <div className="divide-y divide-emerald-100">
              {sortedAppointments.map((appointment) => (
                <button
                  key={appointment.id}
                  type="button"
                  onClick={() => setSelectedAppointmentId(appointment.id)}
                  className="flex w-full flex-col gap-4 px-5 py-5 text-left transition hover:bg-emerald-50/40 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                      <h3 className="truncate text-base font-semibold text-slate-900">
                        {appointment.patientFullName}
                      </h3>

                      <span
                        className={[
                          'inline-flex w-fit items-center rounded-xl px-3 py-1 text-xs font-semibold ring-1',
                          getStatusPillClass(appointment.status),
                        ].join(' ')}
                      >
                        {appointment.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-600">
                      {appointment.reason}
                    </p>

                    <div className="mt-3 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                      <span className="inline-flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-emerald-600" />
                        {formatDate(appointment.scheduledAt)} at{' '}
                        {formatTime(appointment.scheduledAt)}
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-emerald-600" />
                        {appointment.doctorFullName}
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <UserRound className="h-4 w-4 text-emerald-600" />
                        {appointment.durationMinutes} mins
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>

      <Modal
        isOpen={isCreateOpen}
        title="Create Appointment"
        onClose={() => {
          if (!createAppointmentMutation.isPending) {
            setIsCreateOpen(false)
          }
        }}
      >
        {patientsQuery.isLoading ? (
          <LoadingSpinner />
        ) : (
          <CalendarAppointmentForm
            patients={patients}
            initialScheduledAt={selectedDateTime}
            isSubmitting={createAppointmentMutation.isPending}
            onSubmit={(values) => {
              createAppointmentMutation.mutate({
                patientId: values.patientId,
                scheduledAt: values.scheduledAt,
                durationMinutes: values.durationMinutes,
                reason: values.reason,
              })
            }}
          />
        )}
      </Modal>

      <AppointmentDetailsModal
        isOpen={selectedAppointmentId !== null}
        appointment={appointmentDetailQuery.data}
        isLoading={appointmentDetailQuery.isLoading}
        isSubmitting={updateStatusMutation.isPending}
        onClose={() => {
          setSelectedAppointmentId(null)
          setIsEditOpen(false)
          setIsCreateAppointmentNoteOpen(false)
          setIsCreateAppointmentOperationOpen(false)
        }}
        onEdit={() => setIsEditOpen(true)}
        onAddNote={() => setIsCreateAppointmentNoteOpen(true)}
        onAddOperation={() => setIsCreateAppointmentOperationOpen(true)}
        onChangeStatus={(status) => {
          if (selectedAppointmentId === null) return

          updateStatusMutation.mutate({
            appointmentId: selectedAppointmentId,
            status,
          })
        }}
      />

      <Modal
        isOpen={isEditOpen && Boolean(appointmentDetailQuery.data)}
        title="Edit Appointment"
        onClose={() => {
          if (!updateAppointmentMutation.isPending) {
            setIsEditOpen(false)
          }
        }}
      >
        {appointmentDetailQuery.data && (
          <EditAppointmentForm
            appointment={appointmentDetailQuery.data}
            isSubmitting={updateAppointmentMutation.isPending}
            onSubmit={(values) => {
              if (selectedAppointmentId === null) return

              updateAppointmentMutation.mutate({
                appointmentId: selectedAppointmentId,
                payload: {
                  patientId: appointmentDetailQuery.data.patientId,
                  scheduledAt: values.scheduledAt,
                  durationMinutes: values.durationMinutes,
                  reason: values.reason,
                },
              })
            }}
          />
        )}
      </Modal>

      <Modal
        isOpen={
          isCreateAppointmentNoteOpen &&
          selectedAppointmentId !== null &&
          Boolean(appointmentDetailQuery.data)
        }
        title="Add Appointment Note"
        onClose={() => {
          if (!createNoteMutation.isPending) {
            setIsCreateAppointmentNoteOpen(false)
          }
        }}
      >
        <AppointmentNoteForm
          isSubmitting={createNoteMutation.isPending}
          onSubmit={(content) => {
            if (!appointmentDetailQuery.data) return

            createNoteMutation.mutate({
              patientId: appointmentDetailQuery.data.patientId,
              appointmentId: appointmentDetailQuery.data.id,
              content,
            })
          }}
        />
      </Modal>

      <Modal
        isOpen={
          isCreateAppointmentOperationOpen &&
          selectedAppointmentId !== null &&
          Boolean(appointmentDetailQuery.data)
        }
        title="Add Appointment Operation / Treatment"
        onClose={() => {
          if (!createOperationMutation.isPending) {
            setIsCreateAppointmentOperationOpen(false)
          }
        }}
      >
        {appointmentDetailQuery.data && (
          <OperationForm
            patientId={appointmentDetailQuery.data.patientId}
            defaultAppointmentId={appointmentDetailQuery.data.id}
            isSubmitting={createOperationMutation.isPending}
            onSubmit={(values) => {
              createOperationMutation.mutate(values)
            }}
          />
        )}
      </Modal>
    </>
  )
}