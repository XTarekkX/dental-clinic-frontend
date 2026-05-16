import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, UserRound, Plus } from 'lucide-react'
import { usePatientDetail } from '../../hooks/usePatientDetail'
import { usePatientOperations } from '../../hooks/usePatientOperations'
import { useCreateOperation } from '../../hooks/useCreateOperation'
import { useCreateNote } from '../../hooks/useCreateNote'
import { useCreateAppointment } from '../../hooks/useCreateAppointment'
import { useUpdateNote } from '../../hooks/useUpdateNote'
import { useDeleteNote } from '../../hooks/useDeleteNote'
import { useAppointmentDetail } from '../../hooks/useAppointmentDetail'
import { useUpdateAppointmentStatus } from '../../hooks/useUpdateAppointmentStatus'
import { useUpdateAppointment } from '../../hooks/useUpdateAppointment'
import { useOperationDetail } from '../../hooks/useOperationDetail'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { Tabs } from '../../components/common/Tabs'
import { Modal } from '../../components/common/Modal'
import { ConfirmDialog } from '../../components/common/ConfirmDialog'
import { AppointmentDetailsModal } from '../../components/common/AppointmentDetailsModal'
import { OperationDetailsModal } from '../../components/common/OperationDetailsModal'
import { NoteForm } from '../../components/forms/NoteForm'
import { EditNoteForm } from '../../components/forms/EditNoteForm'
import { AppointmentForm } from '../../components/forms/AppointmentForm'
import { EditAppointmentForm } from '../../components/forms/EditAppointmentForm'
import { OperationForm } from '../../components/forms/OperationForm'
import { PatientProfileTab } from './PatientProfileTab'
import { PatientAppointmentsTab } from './PatientAppointmentsTab'
import { PatientNotesTab } from './PatientNotesTab'
import { PatientOperationsTab } from './PatientOperationsTab'
import { APP_ROUTES } from '../../utils/constants'
import { formatFullName } from '../../utils/formatters'
import type { Note } from '../../types/note.types'

type PatientDetailTab = 'profile' | 'appointments' | 'notes' | 'operations'

const tabs: PatientDetailTab[] = [
  'profile',
  'appointments',
  'notes',
  'operations',
]

export function PatientDetailPage() {
  const { id } = useParams()
  const patientId = Number(id)

  const [activeTab, setActiveTab] = useState<PatientDetailTab>('profile')
  const [isCreateNoteOpen, setIsCreateNoteOpen] = useState(false)
  const [isCreateAppointmentOpen, setIsCreateAppointmentOpen] = useState(false)
  const [isCreateAppointmentNoteOpen, setIsCreateAppointmentNoteOpen] =
    useState(false)
  const [isCreateOperationOpen, setIsCreateOperationOpen] = useState(false)
  const [isEditAppointmentOpen, setIsEditAppointmentOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [deletingNote, setDeletingNote] = useState<Note | null>(null)

  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null)

  const [selectedOperationId, setSelectedOperationId] = useState<number | null>(
    null,
  )

  const { patientQuery, appointmentsQuery, notesQuery } =
    usePatientDetail(patientId)

  const operationsQuery = usePatientOperations(patientId)

  const appointmentDetailQuery = useAppointmentDetail(
    selectedAppointmentId,
    selectedAppointmentId !== null,
  )

  const operationDetailQuery = useOperationDetail(selectedOperationId)

  const createOperationMutation = useCreateOperation({
    patientId,
    onSuccess: () => {
      setIsCreateOperationOpen(false)
      setActiveTab('operations')
    },
  })

  const createNoteMutation = useCreateNote({
    patientId,
    onSuccess: () => {
      setIsCreateNoteOpen(false)
      setIsCreateAppointmentNoteOpen(false)
      setActiveTab('notes')
    },
  })

  const createAppointmentMutation = useCreateAppointment({
    patientId,
    onSuccess: () => {
      setIsCreateAppointmentOpen(false)
      setActiveTab('appointments')
    },
  })

  const updateAppointmentStatusMutation = useUpdateAppointmentStatus({
    patientId,
    appointmentId: selectedAppointmentId,
  })

  const updateAppointmentMutation = useUpdateAppointment({
    patientId,
    appointmentId: selectedAppointmentId,
    onSuccess: () => {
      setIsEditAppointmentOpen(false)
    },
  })

  const updateNoteMutation = useUpdateNote({
    patientId,
    onSuccess: () => {
      setEditingNote(null)
      setActiveTab('notes')
    },
  })

  const deleteNoteMutation = useDeleteNote({ patientId })

  const isLoading =
    patientQuery.isLoading ||
    appointmentsQuery.isLoading ||
    notesQuery.isLoading ||
    operationsQuery.isLoading

  const hasError =
    patientQuery.isError ||
    appointmentsQuery.isError ||
    notesQuery.isError ||
    operationsQuery.isError

  const patient = patientQuery.data

  const appointments = useMemo(
    () => appointmentsQuery.data ?? [],
    [appointmentsQuery.data],
  )

  const notes = useMemo(() => notesQuery.data ?? [], [notesQuery.data])

  const operations = useMemo(
    () => operationsQuery.data ?? [],
    [operationsQuery.data],
  )

  if (!Number.isFinite(patientId)) {
    return (
      <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Invalid patient
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          The patient ID in the route is not valid.
        </p>
      </div>
    )
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (hasError || !patient) {
    return (
      <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Failed to load patient details
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Please try again or go back to the patients list.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <Link
            to={APP_ROUTES.patients}
            className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-emerald-100 transition hover:bg-emerald-50 hover:text-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Patients
          </Link>

          <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <UserRound className="h-6 w-6" />
                </div>

                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                    {formatFullName(patient.firstName, patient.lastName)}
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    Patient ID #{patient.id}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
                <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  <span className="font-semibold">{appointments.length}</span>{' '}
                  Appointments
                </div>

                <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  <span className="font-semibold">{notes.length}</span> Notes
                </div>

                <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  <span className="font-semibold">{operations.length}</span>{' '}
                  Operations
                </div>
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              onChange={setActiveTab}
              labels={{
                profile: 'Profile',
                appointments: 'Appointments',
                notes: 'Notes',
                operations: 'Operations',
              }}
            />

            <div className="flex justify-start sm:justify-end">
              {activeTab === 'appointments' && (
                <button
                  type="button"
                  onClick={() => setIsCreateAppointmentOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-emerald-600"
                >
                  <Plus className="h-4 w-4" />
                  New Appointment
                </button>
              )}

              {activeTab === 'notes' && (
                <button
                  type="button"
                  onClick={() => setIsCreateNoteOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-emerald-600"
                >
                  <Plus className="h-4 w-4" />
                  New Note
                </button>
              )}

              {activeTab === 'operations' && (
                <button
                  type="button"
                  onClick={() => setIsCreateOperationOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-emerald-600"
                >
                  <Plus className="h-4 w-4" />
                  New Operation
                </button>
              )}
            </div>
          </div>
        </div>

        {activeTab === 'profile' && <PatientProfileTab patient={patient} />}

        {activeTab === 'appointments' && (
          <PatientAppointmentsTab
            appointments={appointments}
            onSelectAppointment={(appointmentId) =>
              setSelectedAppointmentId(appointmentId)
            }
          />
        )}

        {activeTab === 'notes' && (
          <PatientNotesTab
            notes={notes}
            onEdit={(note) => setEditingNote(note)}
            onDelete={(note) => setDeletingNote(note)}
          />
        )}

        {activeTab === 'operations' && (
          <PatientOperationsTab
            operations={operations}
            onSelectOperation={(operationId) =>
              setSelectedOperationId(operationId)
            }
          />
        )}
      </div>

      <Modal
        isOpen={isCreateAppointmentOpen}
        title="Create Appointment"
        onClose={() => {
          if (!createAppointmentMutation.isPending) {
            setIsCreateAppointmentOpen(false)
          }
        }}
      >
        <AppointmentForm
          isSubmitting={createAppointmentMutation.isPending}
          onSubmit={(values) => {
            createAppointmentMutation.mutate({
              patientId,
              scheduledAt: values.scheduledAt,
              durationMinutes: values.durationMinutes,
              reason: values.reason,
            })
          }}
        />
      </Modal>

      <Modal
        isOpen={isCreateNoteOpen}
        title="Add Clinical Note"
        onClose={() => {
          if (!createNoteMutation.isPending) {
            setIsCreateNoteOpen(false)
          }
        }}
      >
        <NoteForm
          appointments={appointments}
          isSubmitting={createNoteMutation.isPending}
          onSubmit={(values) => {
            createNoteMutation.mutate({
              patientId,
              appointmentId: values.appointmentId,
              content: values.content,
            })
          }}
        />
      </Modal>

      <Modal
        isOpen={isCreateOperationOpen}
        title="Add Operation / Treatment"
        onClose={() => {
          if (!createOperationMutation.isPending) {
            setIsCreateOperationOpen(false)
          }
        }}
      >
        <OperationForm
          patientId={patientId}
          appointments={appointments}
          isSubmitting={createOperationMutation.isPending}
          onSubmit={(values) => {
            createOperationMutation.mutate(values)
          }}
        />
      </Modal>

      <Modal
        isOpen={Boolean(editingNote)}
        title="Edit Clinical Note"
        onClose={() => {
          if (!updateNoteMutation.isPending) {
            setEditingNote(null)
          }
        }}
      >
        {editingNote && (
          <EditNoteForm
            initialContent={editingNote.content}
            isSubmitting={updateNoteMutation.isPending}
            onSubmit={(content) => {
              updateNoteMutation.mutate({
                noteId: editingNote.id,
                content,
              })
            }}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deletingNote)}
        title="Delete Clinical Note"
        description="This action will permanently remove the selected note. If the note belongs to another doctor, the backend should reject the action and an error toast will appear."
        confirmLabel="Delete Note"
        isConfirming={deleteNoteMutation.isPending}
        onClose={() => {
          if (!deleteNoteMutation.isPending) {
            setDeletingNote(null)
          }
        }}
        onConfirm={() => {
          if (!deletingNote) return

          deleteNoteMutation.mutate(deletingNote.id, {
            onSuccess: () => {
              setDeletingNote(null)
            },
          })
        }}
      />

      <AppointmentDetailsModal
        isOpen={selectedAppointmentId !== null}
        appointment={appointmentDetailQuery.data}
        isLoading={appointmentDetailQuery.isLoading}
        isSubmitting={updateAppointmentStatusMutation.isPending}
        onClose={() => {
          setSelectedAppointmentId(null)
          setIsEditAppointmentOpen(false)
          setIsCreateAppointmentNoteOpen(false)
        }}
        onEdit={() => setIsEditAppointmentOpen(true)}
        onAddNote={() => setIsCreateAppointmentNoteOpen(true)}
        onChangeStatus={(status) => {
          if (selectedAppointmentId === null) return

          updateAppointmentStatusMutation.mutate({
            appointmentId: selectedAppointmentId,
            status,
          })
        }}
      />

      <OperationDetailsModal
        isOpen={selectedOperationId !== null}
        operation={operationDetailQuery.data}
        isLoading={operationDetailQuery.isLoading}
        appointments={appointments}
        onClose={() => setSelectedOperationId(null)}
      />

      <Modal
        isOpen={isEditAppointmentOpen && Boolean(appointmentDetailQuery.data)}
        title="Edit Appointment"
        onClose={() => {
          if (!updateAppointmentMutation.isPending) {
            setIsEditAppointmentOpen(false)
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
        <NoteForm
          appointments={appointments}
          isSubmitting={createNoteMutation.isPending}
          onSubmit={(values) => {
            if (!appointmentDetailQuery.data) return

            createNoteMutation.mutate({
              patientId: appointmentDetailQuery.data.patientId,
              appointmentId: appointmentDetailQuery.data.id,
              content: values.content,
            })
          }}
        />
      </Modal>
    </>
  )
}