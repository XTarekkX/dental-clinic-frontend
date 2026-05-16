import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  appointmentSchema,
  type AppointmentFormValues,
} from '../../validation/appointmentSchema'
import type { Appointment } from '../../types/appointment.types'

interface EditAppointmentFormProps {
  appointment: Appointment
  onSubmit: (values: {
    scheduledAt: string
    durationMinutes: number
    reason: string
  }) => void
  isSubmitting?: boolean
}

const durationOptions = [15, 30, 45, 60, 90, 120]

function toDateTimeLocal(value: string) {
  const date = new Date(value)
  const pad = (num: number) => String(num).padStart(2, '0')
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export function EditAppointmentForm({
  appointment,
  onSubmit,
  isSubmitting = false,
}: EditAppointmentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      scheduledAt: toDateTimeLocal(appointment.scheduledAt),
      durationMinutes: appointment.durationMinutes,
      reason: appointment.reason,
    },
  })

  const inputClassName =
    'w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50'

  const submitHandler = (values: AppointmentFormValues) => {
    onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className="grid grid-cols-1 gap-5 p-5 sm:p-6">
        <div>
          <label
            htmlFor="scheduledAt"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Appointment Date & Time
          </label>
          <input
            id="scheduledAt"
            type="datetime-local"
            {...register('scheduledAt')}
            className={inputClassName}
          />
          {errors.scheduledAt && (
            <p className="mt-1 text-xs text-red-600">
              {errors.scheduledAt.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="durationMinutes"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Duration
          </label>
          <select
            id="durationMinutes"
            {...register('durationMinutes', { valueAsNumber: true })}
            className={inputClassName}
          >
            {durationOptions.map((minutes) => (
              <option key={minutes} value={minutes}>
                {minutes} minutes
              </option>
            ))}
          </select>
          {errors.durationMinutes && (
            <p className="mt-1 text-xs text-red-600">
              {errors.durationMinutes.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="reason"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Reason
          </label>
          <textarea
            id="reason"
            rows={5}
            {...register('reason')}
            className={`${inputClassName} resize-none`}
            placeholder="Describe the appointment reason..."
          />
          {errors.reason && (
            <p className="mt-1 text-xs text-red-600">
              {errors.reason.message}
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