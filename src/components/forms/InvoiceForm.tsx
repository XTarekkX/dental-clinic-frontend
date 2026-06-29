import { useMemo } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { usePatientAppointments } from '../../hooks/usePatientAppointments'
import {
  invoiceSchema,
  type InvoiceFormValues,
} from '../../validation/invoiceSchema'
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters'
import type { Patient } from '../../types/patient.types'
import type { Invoice, InvoiceRequest } from '../../types/invoice.types'

interface InvoiceFormProps {
  patients: Patient[]
  invoice?: Invoice | null
  onSubmit: (values: InvoiceRequest) => void
  isSubmitting?: boolean
}

const inputClassName =
  'w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50'

export function InvoiceForm({
  patients,
  invoice = null,
  onSubmit,
  isSubmitting = false,
}: InvoiceFormProps) {
  const defaultValues = useMemo<InvoiceFormValues>(
    () => ({
      patientId: invoice?.patientId ?? 0,
      appointmentId: invoice?.appointmentId ? String(invoice.appointmentId) : '',
      items:
        invoice?.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })) ?? [{ description: '', quantity: 1, unitPrice: 0 }],
      discount: invoice?.discount ?? 0,
      tax: invoice?.tax ?? 0,
      dueDate: invoice?.dueDate ?? '',
      notes: invoice?.notes ?? '',
    }),
    [invoice],
  )

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues,
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  const selectedPatientId = Number(useWatch({ control, name: 'patientId' }) ?? 0)
  const appointmentsQuery = usePatientAppointments(
    selectedPatientId > 0 ? selectedPatientId : null,
  )
  const watchedItems = useWatch({ control, name: 'items' }) ?? []
  const watchedDiscount = Number(useWatch({ control, name: 'discount' }) ?? 0)
  const watchedTax = Number(useWatch({ control, name: 'tax' }) ?? 0)
  const subtotal = watchedItems.reduce((sum, item) => {
    const quantity = Number(item.quantity) || 0
    const unitPrice = Number(item.unitPrice) || 0
    return sum + quantity * unitPrice
  }, 0)
  const netAmount = Math.max(0, subtotal - watchedDiscount + watchedTax)

  const submitHandler = (values: InvoiceFormValues) => {
    onSubmit({
      patientId: values.patientId,
      appointmentId: values.appointmentId ? Number(values.appointmentId) : null,
      items: values.items.map((item) => ({
        description: item.description.trim(),
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      discount: values.discount,
      tax: values.tax,
      dueDate: values.dueDate || null,
      notes: values.notes?.trim() || null,
    })
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
        <div>
          <label
            htmlFor="patientId"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Patient
          </label>
          <select
            id="patientId"
            {...register('patientId', { valueAsNumber: true })}
            className={inputClassName}
          >
            <option value={0}>Select patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.firstName} {patient.lastName}
              </option>
            ))}
          </select>
          {errors.patientId && (
            <p className="mt-1 text-xs text-red-600">
              {errors.patientId.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="appointmentId"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Appointment
          </label>
          <select
            id="appointmentId"
            {...register('appointmentId')}
            disabled={selectedPatientId <= 0 || appointmentsQuery.isLoading}
            className={inputClassName}
          >
            <option value="">
              {selectedPatientId <= 0
                ? 'Select patient first'
                : appointmentsQuery.isLoading
                  ? 'Loading appointments...'
                  : 'No linked appointment'}
            </option>
            {(appointmentsQuery.data ?? []).map((appointment) => (
              <option key={appointment.id} value={appointment.id}>
                {formatDate(appointment.scheduledAt)} at{' '}
                {formatTime(appointment.scheduledAt)} · {appointment.reason} ·{' '}
                {appointment.status}
              </option>
            ))}
          </select>
          {selectedPatientId > 0 &&
            !appointmentsQuery.isLoading &&
            (appointmentsQuery.data ?? []).length === 0 && (
              <p className="mt-1 text-xs text-slate-500">
                This patient has no appointments yet.
              </p>
            )}
        </div>

        <div>
          <label
            htmlFor="dueDate"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Due Date
          </label>
          <input
            id="dueDate"
            type="date"
            {...register('dueDate')}
            className={inputClassName}
          />
        </div>

        <div className="sm:col-span-2">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-900">Line Items</h3>
            <button
              type="button"
              onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-100 bg-white px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 gap-3 rounded-2xl border border-emerald-100 bg-slate-50/50 p-3 sm:grid-cols-[1fr_96px_140px_44px]"
              >
                <div>
                  <input
                    aria-label="Item description"
                    {...register(`items.${index}.description`)}
                    className={inputClassName}
                    placeholder="Consultation, filling, crown..."
                  />
                  {errors.items?.[index]?.description && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.items[index]?.description?.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    aria-label="Quantity"
                    type="number"
                    min={1}
                    step={1}
                    {...register(`items.${index}.quantity`, {
                      valueAsNumber: true,
                    })}
                    className={inputClassName}
                    placeholder="Qty"
                  />
                  {errors.items?.[index]?.quantity && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.items[index]?.quantity?.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    aria-label="Unit price"
                    type="number"
                    min={0}
                    step="0.01"
                    {...register(`items.${index}.unitPrice`, {
                      valueAsNumber: true,
                    })}
                    className={inputClassName}
                    placeholder="Unit price"
                  />
                  {errors.items?.[index]?.unitPrice && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.items[index]?.unitPrice?.message}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  aria-label="Remove line item"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          {errors.items?.root && (
            <p className="mt-1 text-xs text-red-600">{errors.items.root.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="discount"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Discount
          </label>
          <input
            id="discount"
            type="number"
            min={0}
            step="0.01"
            {...register('discount', { valueAsNumber: true })}
            className={inputClassName}
          />
          {errors.discount && (
            <p className="mt-1 text-xs text-red-600">{errors.discount.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="tax"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Tax
          </label>
          <input
            id="tax"
            type="number"
            min={0}
            step="0.01"
            {...register('tax', { valueAsNumber: true })}
            className={inputClassName}
          />
          {errors.tax && (
            <p className="mt-1 text-xs text-red-600">{errors.tax.message}</p>
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
            rows={3}
            {...register('notes')}
            className={`${inputClassName} resize-none`}
            placeholder="Internal billing notes..."
          />
          {errors.notes && (
            <p className="mt-1 text-xs text-red-600">{errors.notes.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <div className="grid grid-cols-1 gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-sm sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Subtotal
              </p>
              <p className="mt-1 font-semibold text-slate-900">
                {formatCurrency(subtotal)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Adjustments
              </p>
              <p className="mt-1 font-semibold text-slate-900">
                {formatCurrency(watchedTax - watchedDiscount)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Net Amount
              </p>
              <p className="mt-1 font-semibold text-emerald-700">
                {formatCurrency(netAmount)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-emerald-100 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Saving...' : invoice ? 'Update Invoice' : 'Create Invoice'}
        </button>
      </div>
    </form>
  )
}
