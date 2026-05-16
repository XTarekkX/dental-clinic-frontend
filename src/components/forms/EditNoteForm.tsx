import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  editNoteSchema,
  type EditNoteFormValues,
} from '../../validation/editNoteSchema'

interface EditNoteFormProps {
  initialContent: string
  onSubmit: (content: string) => void
  isSubmitting?: boolean
}

export function EditNoteForm({
  initialContent,
  onSubmit,
  isSubmitting = false,
}: EditNoteFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditNoteFormValues>({
    resolver: zodResolver(editNoteSchema),
    defaultValues: {
      content: initialContent,
    },
  })

  const inputClassName =
    'w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50'

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values.content))}>
      <div className="space-y-5 p-5 sm:p-6">
        <div>
          <label htmlFor="content" className="mb-2 block text-sm font-medium text-slate-700">
            Edit Note
          </label>
          <textarea
            id="content"
            rows={8}
            {...register('content')}
            className={`${inputClassName} resize-none`}
            placeholder="Update the clinical note..."
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
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}