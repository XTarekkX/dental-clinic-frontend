import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { noteSchema, type NoteFormValues } from '../../validation/noteSchema'
import type { Appointment } from '../../types/appointment.types'

interface NoteFormProps {
  appointments: Appointment[]
  onSubmit: (values: { appointmentId: number | null; content: string }) => void
  isSubmitting?: boolean
}

export function NoteForm({
  appointments,
  onSubmit,
  isSubmitting = false,
}: NoteFormProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      appointmentId: null,
      content: '',
    },
  })

  const inputClassName =
    'w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50'

  const labelClassName = 'mb-2 block text-sm font-medium text-slate-700'

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-5 p-5 sm:p-6">
        <div>
          <label htmlFor="appointmentId" className={labelClassName}>
            Related Appointment
          </label>

          <Controller
            control={control}
            name="appointmentId"
            render={({ field }) => (
              <select
                id="appointmentId"
                value={field.value ?? ''}
                onChange={(event) => {
                  const value = event.target.value
                  field.onChange(value ? Number(value) : null)
                }}
                className={inputClassName}
              >
                <option value="">No appointment selected</option>
                {appointments.map((appointment) => (
                  <option key={appointment.id} value={appointment.id}>
                    #{appointment.id} — {appointment.reason} — {appointment.scheduledAt}
                  </option>
                ))}
              </select>
            )}
          />

          {errors.appointmentId && (
            <p className="mt-1 text-xs text-red-600">
              {errors.appointmentId.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="content" className={labelClassName}>
            Clinical Note
          </label>
          <textarea
            id="content"
            rows={8}
            {...register('content')}
            className={`${inputClassName} resize-none`}
            placeholder="Write the clinical note for this patient..."
          />
          {errors.content && (
            <p className="mt-1 text-xs text-red-600">{errors.content.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-emerald-100 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Saving...' : 'Add Note'}
        </button>
      </div>
    </form>
  )
}