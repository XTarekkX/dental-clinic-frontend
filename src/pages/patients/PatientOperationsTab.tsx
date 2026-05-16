import { Wrench, Stethoscope, CalendarDays } from 'lucide-react'
import type { Operation } from '../../types/operation.types'
import { EmptyState } from '../../components/common/EmptyState'
import { formatDateTime } from '../../utils/formatters'

interface PatientOperationsTabProps {
  operations: Operation[]
  onSelectOperation?: (operationId: number) => void
}

const statusClassMap: Record<Operation['status'], string> = {
  PLANNED: 'bg-blue-50 text-blue-700 ring-blue-100',
  IN_PROGRESS: 'bg-orange-50 text-orange-700 ring-orange-100',
  COMPLETED: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
}

export function PatientOperationsTab({
  operations,
  onSelectOperation,
}: PatientOperationsTabProps) {
  if (operations.length === 0) {
    return (
      <EmptyState
        title="No operations found"
        description="Treatment operations for this patient will appear here."
      />
    )
  }

  return (
    <div className="space-y-4">
      {operations.map((operation) => (
        <button
          key={operation.id}
          type="button"
          onClick={() => onSelectOperation?.(operation.id)}
          className="block w-full rounded-3xl border border-emerald-100 bg-white p-5 text-left shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50/30 hover:shadow-md"
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

                  {operation.appointmentId && (
                    <span className="inline-flex items-center gap-2 text-emerald-700">
                      <CalendarDays className="h-4 w-4" />
                      Linked to appointment #{operation.appointmentId}
                    </span>
                  )}

                  {operation.performedAt && (
                    <span>
                      Performed: {formatDateTime(operation.performedAt)}
                    </span>
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
        </button>
      ))}
    </div>
  )
}