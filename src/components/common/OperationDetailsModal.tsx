import { useMemo, useState } from 'react'
import {
  CalendarDays,
  Clock3,
  Edit3,
  Stethoscope,
  Trash2,
  UserRound,
  Wrench,
} from 'lucide-react'
import type { Appointment } from '../../types/appointment.types'
import type {
  Operation,
  OperationStatus,
} from '../../types/operation.types'
import { formatDateTime } from '../../utils/formatters'
import {
  getNextOperationStatuses,
  operationStatusDescriptions,
  operationStatusLabels,
} from '../../utils/operationStatus'
import { Modal } from './Modal'
import { ConfirmDialog } from './ConfirmDialog'
import { LoadingSpinner } from './LoadingSpinner'
import { EditOperationForm } from '../forms/EditOperationForm'
import { useUpdateOperation } from '../../hooks/useUpdateOperation'
import { useUpdateOperationStatus } from '../../hooks/useUpdateOperationStatus'
import { useDeleteOperation } from '../../hooks/useDeleteOperation'

interface OperationDetailsModalProps {
  isOpen: boolean
  operation?: Operation
  isLoading?: boolean
  appointments?: Appointment[]
  onClose: () => void
}

const statusClassMap: Record<OperationStatus, string> = {
  PLANNED: 'bg-blue-50 text-blue-700 ring-blue-100',
  IN_PROGRESS: 'bg-orange-50 text-orange-700 ring-orange-100',
  COMPLETED: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
}

export function OperationDetailsModal({
  isOpen,
  operation,
  isLoading = false,
  appointments = [],
  onClose,
}: OperationDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const linkedAppointment = useMemo(() => {
    if (!operation?.appointmentId) return null

    return (
      appointments.find(
        (appointment) => appointment.id === operation.appointmentId,
      ) ?? null
    )
  }, [appointments, operation?.appointmentId])

  const nextStatuses = operation
    ? getNextOperationStatuses(operation.status)
    : []

  const updateOperationMutation = useUpdateOperation({
    patientId: operation?.patientId,
    operationId: operation?.id,
    onSuccess: () => {
      setIsEditing(false)
    },
  })

  const updateStatusMutation = useUpdateOperationStatus({
    patientId: operation?.patientId,
    operationId: operation?.id,
  })

const deleteOperationMutation = useDeleteOperation({
  patientId: operation?.patientId,
  operationId: operation?.id,
  onSuccess: () => {
    setIsDeleteOpen(false)
    setIsEditing(false)
    onClose()
  },
})

  const handleClose = () => {
    if (
      updateOperationMutation.isPending ||
      updateStatusMutation.isPending ||
      deleteOperationMutation.isPending
    ) {
      return
    }

    setIsEditing(false)
    setIsDeleteOpen(false)
    onClose()
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        title={isEditing ? 'Edit Operation' : 'Operation Details'}
        onClose={handleClose}
      >
        {isLoading ? (
          <div className="p-8">
            <LoadingSpinner />
          </div>
        ) : !operation ? (
          <div className="p-6">
            <div className="rounded-3xl border border-red-100 bg-red-50 p-5">
              <h3 className="text-sm font-semibold text-red-700">
                Operation not found
              </h3>
              <p className="mt-1 text-sm text-red-600">
                The selected operation could not be loaded.
              </p>
            </div>
          </div>
        ) : isEditing ? (
          <EditOperationForm
            operation={operation}
            appointments={appointments}
            isSubmitting={updateOperationMutation.isPending}
            onSubmit={(payload) => {
              updateOperationMutation.mutate({
                operationId: operation.id,
                payload,
              })
            }}
          />
        ) : (
          <div className="space-y-5 p-5 sm:p-6">
            <section className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100">
                    <Wrench className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {operation.operationType}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {operation.dentalProblem}
                    </p>
                  </div>
                </div>

                <span
                  className={[
                    'inline-flex w-fit rounded-xl px-3 py-1 text-xs font-semibold ring-1',
                    statusClassMap[operation.status],
                  ].join(' ')}
                >
                  {operationStatusLabels[operation.status]}
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                {operationStatusDescriptions[operation.status]}
              </p>
            </section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-100 bg-white p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <UserRound className="h-4 w-4 text-emerald-600" />
                  Doctor
                </div>
                <p className="text-sm text-slate-600">
                  {operation.doctorFullName}
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-white p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Wrench className="h-4 w-4 text-emerald-600" />
                  Tooth
                </div>
                <p className="text-sm text-slate-600">
                  {operation.toothNumber || '-'}
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-white p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Clock3 className="h-4 w-4 text-emerald-600" />
                  Created
                </div>
                <p className="text-sm text-slate-600">
                  {formatDateTime(operation.createdAt)}
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-white p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <CalendarDays className="h-4 w-4 text-emerald-600" />
                  Linked Appointment
                </div>
                {linkedAppointment ? (
                  <p className="text-sm leading-6 text-slate-600">
                    #{linkedAppointment.id} —{' '}
                    {formatDateTime(linkedAppointment.scheduledAt)}
                    <br />
                    {linkedAppointment.reason}
                  </p>
                ) : operation.appointmentId ? (
                  <p className="text-sm text-slate-600">
                    Appointment #{operation.appointmentId}
                  </p>
                ) : (
                  <p className="text-sm text-slate-500">
                    No appointment linked yet
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-3xl border border-emerald-100 bg-white p-5">
              <div className="mb-2 flex items-center gap-2 font-semibold text-slate-900">
                <Stethoscope className="h-4 w-4 text-emerald-600" />
                Treatment Plan
              </div>
              <p className="text-sm leading-7 text-slate-700">
                {operation.treatmentPlan}
              </p>

              {operation.notes && (
                <>
                  <div className="mb-2 mt-5 font-semibold text-slate-900">
                    Notes
                  </div>
                  <p className="text-sm leading-7 text-slate-700">
                    {operation.notes}
                  </p>
                </>
              )}
            </section>

            <section className="rounded-3xl border border-emerald-100 bg-slate-50 p-5">
              <h4 className="text-sm font-semibold text-slate-900">
                Status Actions
              </h4>

              {nextStatuses.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">
                  This operation is completed. No further status actions are
                  available.
                </p>
              ) : (
                <div className="mt-4 flex flex-wrap gap-3">
                  {nextStatuses.map((status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={updateStatusMutation.isPending}
                      onClick={() => {
                        updateStatusMutation.mutate({
                          operationId: operation.id,
                          status,
                        })
                      }}
                      className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm ring-1 ring-emerald-100 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      Mark as {operationStatusLabels[status]}
                    </button>
                  ))}
                </div>
              )}
            </section>

            <div className="flex flex-col gap-3 border-t border-emerald-100 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsDeleteOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-100 transition hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>

              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-emerald-600"
              >
                <Edit3 className="h-4 w-4" />
                Edit Operation
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Operation"
        description="This action will permanently remove this operation. If the backend rejects the action, an error toast will appear."
        confirmLabel="Delete Operation"
        isConfirming={deleteOperationMutation.isPending}
        onClose={() => {
          if (!deleteOperationMutation.isPending) {
            setIsDeleteOpen(false)
          }
        }}
        onConfirm={() => {
          if (!operation) return
          deleteOperationMutation.mutate(operation.id)
        }}
      />
    </>
  )
}