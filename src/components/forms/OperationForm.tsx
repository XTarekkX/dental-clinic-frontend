import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  operationSchema,
  type OperationFormValues,
} from '../../validation/operationSchema'
import type { Appointment } from '../../types/appointment.types'
import type { OperationRequest } from '../../types/operation.types'

interface OperationFormProps {
  patientId: number
  appointments?: Appointment[]
  defaultAppointmentId?: number | null
  onSubmit: (values: OperationRequest) => void
  isSubmitting?: boolean
}

export function OperationForm({
  patientId,
  appointments = [],
  defaultAppointmentId = null,
  onSubmit,
  isSubmitting = false,
}: OperationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OperationFormValues>({
    resolver: zodResolver(operationSchema),
    defaultValues: {
      operationType: '',
      dentalProblem: '',
      treatmentPlan: '',
      toothNumber: '',
      status: 'PLANNED',
      notes: '',
    },
  })

  const inputClassName =
    'w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50'

  const submitHandler = (values: OperationFormValues) => {
    onSubmit({
      patientId,
      appointmentId: defaultAppointmentId,
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
        {defaultAppointmentId === null && appointments.length > 0 && (
          <div className="sm:col-span-2">
            <label
              htmlFor="appointmentInfo"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Available Appointments
            </label>
            <div
              id="appointmentInfo"
              className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-slate-700"
            >
              This operation will be created from the patient page. Appointment linking can be added in the next step from inside appointment workflow.
            </div>
          </div>
        )}

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
            <p className="mt-1 text-xs text-red-600">{errors.status.message}</p>
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
            <p className="mt-1 text-xs text-red-600">{errors.notes.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-emerald-100 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Saving...' : 'Create Operation'}
        </button>
      </div>
    </form>
  )
}