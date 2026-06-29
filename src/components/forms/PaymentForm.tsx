import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { paymentSchema, type PaymentFormValues } from '../../validation/invoiceSchema'
import { formatCurrency } from '../../utils/formatters'
import type { Invoice, PaymentRequest } from '../../types/invoice.types'

interface PaymentFormProps {
  invoice: Invoice
  onSubmit: (values: PaymentRequest) => void
  isSubmitting?: boolean
}

const inputClassName =
  'w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50'

export function PaymentForm({
  invoice,
  onSubmit,
  isSubmitting = false,
}: PaymentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: invoice.balanceDue,
      paymentMethod: 'CASH',
      referenceNumber: '',
      paidAt: '',
      notes: '',
    },
  })

  const submitHandler = (values: PaymentFormValues) => {
    onSubmit({
      invoiceId: invoice.id,
      patientId: invoice.patientId,
      amount: values.amount,
      paymentMethod: values.paymentMethod,
      referenceNumber: values.referenceNumber?.trim() || null,
      paidAt: values.paidAt ? `${values.paidAt}:00` : null,
      notes: values.notes?.trim() || null,
    })
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
        <div className="sm:col-span-2 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
          <p className="text-sm font-semibold text-slate-900">
            {invoice.invoiceNumber} · {invoice.patientFullName}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Balance due: {formatCurrency(invoice.balanceDue)}
          </p>
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
            max={invoice.balanceDue}
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
            htmlFor="paymentMethod"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Payment Method
          </label>
          <select
            id="paymentMethod"
            {...register('paymentMethod')}
            className={inputClassName}
          >
            <option value="CASH">Cash</option>
            <option value="CARD">Card</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="referenceNumber"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Reference
          </label>
          <input
            id="referenceNumber"
            {...register('referenceNumber')}
            className={inputClassName}
            placeholder="Card transaction ID"
          />
          {errors.referenceNumber && (
            <p className="mt-1 text-xs text-red-600">
              {errors.referenceNumber.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="paidAt"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Paid At
          </label>
          <input
            id="paidAt"
            type="datetime-local"
            {...register('paidAt')}
            className={inputClassName}
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="paymentNotes"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Notes
          </label>
          <textarea
            id="paymentNotes"
            rows={3}
            {...register('notes')}
            className={`${inputClassName} resize-none`}
            placeholder="Payment notes..."
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
          {isSubmitting ? 'Recording...' : 'Record Payment'}
        </button>
      </div>
    </form>
  )
}
