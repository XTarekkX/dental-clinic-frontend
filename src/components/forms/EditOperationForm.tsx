import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { operationSchema } from '../../validation/operationSchema'
import type { Appointment } from '../../types/appointment.types'
import type { Operation, OperationRequest } from '../../types/operation.types'
import { formatDate, formatTime } from '../../utils/formatters'

const editOperationSchema = operationSchema.extend({
  appointmentId: z.string().optional(),
})

type EditOperationFormValues = z.infer<typeof editOperationSchema>

interface EditOperationFormProps {
  operation: Operation
  appointments?: Appointment[]
  isSubmitting?: boolean
  onSubmit: (values: OperationRequest) => void
}

export function EditOperationForm({
  operation,
  appointments = [],
  isSubmitting = false,
  onSubmit,
}: EditOperationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditOperationFormValues>({
    resolver: zodResolver(editOperationSchema),
    defaultValues: {
      operationType: operation.operationType,
      dentalProblem: operation.dentalProblem,
      treatmentPlan: operation.treatmentPlan,
      toothNumber: operation.toothNumber ?? '',
      status: operation.status,
      notes: operation.notes ?? '',
      appointmentId: operation.appointmentId
        ? String(operation.appointmentId)
        : '',
    },
  })

  const inputClassName =
    'w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50'

  const submitHandler = (values: EditOperationFormValues) => {
    onSubmit({
      patientId: operation.patientId,
      appointmentId: values.appointmentId
        ? Number(values.appointmentId)
        : null,
      operationType: values.operationType,
      dentalProblem: values.dentalProblem,
      treatmentPlan: values.treatmentPlan,
      toothNumber: values.toothNumber || null,
      status: values.status,
      notes: values.notes || null,
    })
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
        <div className="sm:col-span-2">
          <label
            htmlFor="appointmentId"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Linked Appointment
          </label>

          <select
            id="appointmentId"
            {...register('appointmentId')}
            className={inputClassName}
          >
            <option value="">No linked appointment</option>
            {appointments.map((appointment) => (
              <option key={appointment.id} value={String(appointment.id)}>
                #{appointment.id} — {formatDate(appointment.scheduledAt)} at{' '}
                {formatTime(appointment.scheduledAt)} — {appointment.reason}
              </option>
            ))}
          </select>

          {errors.appointmentId && (
            <p className="mt-1 text-xs text-red-600">
              {errors.appointmentId.message}
            </p>
          )}

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Use this to link a standalone treatment plan to the actual visit
            where treatment happens. You can also remove the link by choosing
            “No linked appointment”.
          </p>
        </div>

        <div>
          <label
            htmlFor="operationType"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Operation Type
          </label>
          <input
            id="operationType"
            {...register('operationType')}
            className={inputClassName}
            placeholder="Root Canal, Extraction, Implant..."
          />
          {errors.operationType && (
            <p className="mt-1 text-xs text-red-600">
              {errors.operationType.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="toothNumber"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Tooth Number
          </label>
          <input
            id="toothNumber"
            {...register('toothNumber')}
            className={inputClassName}
            placeholder="14"
          />
          {errors.toothNumber && (
            <p className="mt-1 text-xs text-red-600">
              {errors.toothNumber.message}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="dentalProblem"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Dental Problem
          </label>
          <textarea
            id="dentalProblem"
            rows={4}
            {...register('dentalProblem')}
            className={`${inputClassName} resize-none`}
            placeholder="Describe the dental problem..."
          />
          {errors.dentalProblem && (
            <p className="mt-1 text-xs text-red-600">
              {errors.dentalProblem.message}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="treatmentPlan"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Treatment Plan
          </label>
          <textarea
            id="treatmentPlan"
            rows={4}
            {...register('treatmentPlan')}
            className={`${inputClassName} resize-none`}
            placeholder="Describe the treatment plan..."
          />
          {errors.treatmentPlan && (
            <p className="mt-1 text-xs text-red-600">
              {errors.treatmentPlan.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="status"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Status
          </label>
          <select
            id="status"
            {...register('status')}
            className={inputClassName}
          >
            <option value="PLANNED">PLANNED</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-xs text-red-600">
              {errors.status.message}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="notes"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Notes
          </label>
          <textarea
            id="notes"
            rows={4}
            {...register('notes')}
            className={`${inputClassName} resize-none`}
            placeholder="Additional notes..."
          />
          {errors.notes && (
            <p className="mt-1 text-xs text-red-600">
              {errors.notes.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-emerald-100 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}