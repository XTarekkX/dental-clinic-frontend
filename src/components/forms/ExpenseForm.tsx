import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  expenseSchema,
  type ExpenseFormValues,
} from '../../validation/expenseSchema'
import type { Expense, ExpenseRequest } from '../../types/expense.types'

interface ExpenseFormProps {
  expense?: Expense | null
  onSubmit: (values: ExpenseRequest) => void
  isSubmitting?: boolean
}

const inputClassName =
  'w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50'

export function ExpenseForm({
  expense = null,
  onSubmit,
  isSubmitting = false,
}: ExpenseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      category: expense?.category ?? '',
      description: expense?.description ?? '',
      amount: expense?.amount ?? 0,
      expenseDate: expense?.expenseDate ?? new Date().toISOString().slice(0, 10),
    },
  })

  const submitHandler = (values: ExpenseFormValues) => {
    onSubmit({
      category: values.category.trim(),
      description: values.description?.trim() || null,
      amount: values.amount,
      expenseDate: values.expenseDate,
    })
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
        <div>
          <label
            htmlFor="category"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Category
          </label>
          <input
            id="category"
            {...register('category')}
            className={inputClassName}
            placeholder="Supplies, rent, lab fees..."
          />
          {errors.category && (
            <p className="mt-1 text-xs text-red-600">
              {errors.category.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="amount"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Amount
          </label>
          <input
            id="amount"
            type="number"
            min="0.01"
            step="0.01"
            {...register('amount', { valueAsNumber: true })}
            className={inputClassName}
          />
          {errors.amount && (
            <p className="mt-1 text-xs text-red-600">{errors.amount.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="expenseDate"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Expense Date
          </label>
          <input
            id="expenseDate"
            type="date"
            {...register('expenseDate')}
            className={inputClassName}
          />
          {errors.expenseDate && (
            <p className="mt-1 text-xs text-red-600">
              {errors.expenseDate.message}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            {...register('description')}
            className={`${inputClassName} resize-none`}
            placeholder="Vendor, receipt details, or internal notes..."
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600">
              {errors.description.message}
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
          {isSubmitting ? 'Saving...' : expense ? 'Update Expense' : 'Add Expense'}
        </button>
      </div>
    </form>
  )
}
