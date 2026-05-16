import { Plus, Wrench, Stethoscope } from 'lucide-react'
import type { Operation } from '../../types/operation.types'
import { EmptyState } from './EmptyState'
import { formatDateTime } from '../../utils/formatters'

interface AppointmentOperationsSectionProps {
  operations: Operation[]
  canAddOperation: boolean
  onAddOperation: () => void
}

const statusClassMap: Record<Operation['status'], string> = {
  PLANNED: 'bg-blue-50 text-blue-700 ring-blue-100',
  IN_PROGRESS: 'bg-orange-50 text-orange-700 ring-orange-100',
  COMPLETED: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
}

export function AppointmentOperationsSection({
  operations,
  canAddOperation,
  onAddOperation,
}: AppointmentOperationsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Appointment operations:{' '}
          <span className="font-semibold">{operations.length}</span>
        </div>

        {canAddOperation && (
          <button
            type="button"
            onClick={onAddOperation}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-emerald-600"
          >
            <Plus className="h-4 w-4" />
            Add Operation
          </button>
        )}
      </div>

      {operations.length === 0 ? (
        <EmptyState
          title="No operations for this appointment"
          description={
            canAddOperation
              ? 'Add a treatment/operation for this visit while the appointment is in progress.'
              : 'No operations were linked to this appointment.'
          }
        />
      ) : (
        <div className="space-y-4">
          {operations.map((operation) => (
            <article
              key={operation.id}
              className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <Wrench className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                      <h3 className="text-base font-semibold text-slate-900">
                        {operation.operationType}
                      </h3>
                      <span
                        className={[
                          'inline-flex w-fit rounded-xl px-3 py-1 text-xs font-semibold ring-1',
                          statusClassMap[operation.status],
                        ].join(' ')}
                      >
                        {operation.status}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-600">
                      {operation.dentalProblem}
                    </p>

                    <div className="mt-3 flex flex-col gap-2 text-sm text-slate-500">
                      <span>Tooth: {operation.toothNumber || '-'}</span>
                      <span>Doctor: {operation.doctorFullName}</span>
                      <span>Created: {formatDateTime(operation.createdAt)}</span>
                      {operation.performedAt && (
                        <span>Performed: {formatDateTime(operation.performedAt)}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 lg:max-w-md">
                  <div className="mb-2 flex items-center gap-2 font-semibold text-slate-900">
                    <Stethoscope className="h-4 w-4 text-emerald-600" />
                    Treatment Plan
                  </div>
                  <p className="leading-7">{operation.treatmentPlan}</p>
                  {operation.notes && (
                    <>
                      <div className="mb-2 mt-4 font-semibold text-slate-900">
                        Notes
                      </div>
                      <p className="leading-7">{operation.notes}</p>
                    </>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}