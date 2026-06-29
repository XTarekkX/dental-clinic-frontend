import { useMemo, useState } from 'react'
import { Banknote, CreditCard, ReceiptText, RotateCcw } from 'lucide-react'
import { usePatients } from '../../hooks/usePatients'
import { usePatientPayments } from '../../hooks/usePatientPayments'
import { useDeletePayment } from '../../hooks/useDeletePayment'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { EmptyState } from '../../components/common/EmptyState'
import { ConfirmDialog } from '../../components/common/ConfirmDialog'
import { formatCurrency, formatDateTime } from '../../utils/formatters'
import type { Payment } from '../../types/invoice.types'

export function PaymentsPage() {
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null)
  const [paymentToReverse, setPaymentToReverse] = useState<Payment | null>(null)

  const { data: patientsData, isLoading: isLoadingPatients } = usePatients({
    page: 0,
    size: 100,
    search: '',
  })
  const paymentsQuery = usePatientPayments(selectedPatientId)
  const deletePaymentMutation = useDeletePayment({
    patientId: selectedPatientId,
    onSuccess: () => setPaymentToReverse(null),
  })

  const patients = useMemo(() => patientsData?.content ?? [], [patientsData])
  const payments = useMemo(() => paymentsQuery.data ?? [], [paymentsQuery.data])
  const selectedPatient = patients.find(
    (patient) => patient.id === selectedPatientId,
  )

  const totalCollected = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0,
  )
  const cashTotal = payments
    .filter((payment) => payment.paymentMethod === 'CASH')
    .reduce((sum, payment) => sum + payment.amount, 0)
  const cardTotal = payments
    .filter((payment) => payment.paymentMethod === 'CARD')
    .reduce((sum, payment) => sum + payment.amount, 0)

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Payments
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Review patient payment history and reverse payments when needed.
            </p>
          </div>
        </div>

        <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
          <label
            htmlFor="patientPaymentFilter"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Patient
          </label>
          <select
            id="patientPaymentFilter"
            value={selectedPatientId ?? ''}
            onChange={(event) =>
              setSelectedPatientId(
                event.target.value ? Number(event.target.value) : null,
              )
            }
            disabled={isLoadingPatients}
            className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
          >
            <option value="">
              {isLoadingPatients ? 'Loading patients...' : 'Select patient'}
            </option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.firstName} {patient.lastName}
              </option>
            ))}
          </select>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <PaymentStat
            label="Total collected"
            value={formatCurrency(totalCollected)}
            icon={<Banknote className="h-5 w-5 text-emerald-600" />}
          />
          <PaymentStat
            label="Cash"
            value={formatCurrency(cashTotal)}
            icon={<ReceiptText className="h-5 w-5 text-amber-600" />}
          />
          <PaymentStat
            label="Card"
            value={formatCurrency(cardTotal)}
            icon={<CreditCard className="h-5 w-5 text-blue-600" />}
          />
        </section>

        <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
          <div className="border-b border-emerald-100 px-4 py-4 sm:px-5">
            <h2 className="text-base font-semibold text-slate-900">
              {selectedPatient
                ? `${selectedPatient.firstName} ${selectedPatient.lastName}`
                : 'Payment history'}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {selectedPatientId
                ? `${payments.length} payment records`
                : 'Choose a patient to load backend payment records.'}
            </p>
          </div>

          {!selectedPatientId ? (
            <div className="p-5">
              <EmptyState
                title="Select a patient"
                description="The backend exposes payment history by patient or invoice, so start by selecting a patient."
              />
            </div>
          ) : paymentsQuery.isLoading ? (
            <LoadingSpinner />
          ) : paymentsQuery.isError ? (
            <div className="p-5">
              <EmptyState
                title="Failed to load payments"
                description={
                  paymentsQuery.error instanceof Error
                    ? paymentsQuery.error.message
                    : 'Something went wrong while loading payments.'
                }
              />
            </div>
          ) : payments.length === 0 ? (
            <div className="p-5">
              <EmptyState
                title="No payments found"
                description="This patient has no recorded payments yet."
              />
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <div className="grid grid-cols-[1.1fr_1fr_1fr_1.2fr_1.4fr_80px] border-b border-emerald-100 bg-emerald-50/50 px-5 py-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  <div>Invoice</div>
                  <div>Amount</div>
                  <div>Method</div>
                  <div>Paid At</div>
                  <div>Reference</div>
                  <div>Action</div>
                </div>

                <div className="divide-y divide-emerald-100">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="grid grid-cols-[1.1fr_1fr_1fr_1.2fr_1.4fr_80px] items-center gap-4 px-5 py-5"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {payment.invoiceNumber}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Payment #{payment.id}
                        </p>
                      </div>
                      <div className="text-sm font-semibold text-slate-900">
                        {formatCurrency(payment.amount)}
                      </div>
                      <PaymentMethodBadge method={payment.paymentMethod} />
                      <div className="text-sm text-slate-700">
                        {formatDateTime(payment.paidAt)}
                      </div>
                      <div className="min-w-0 text-sm text-slate-700">
                        <p className="truncate">
                          {payment.referenceNumber || '-'}
                        </p>
                        {payment.notes && (
                          <p className="mt-1 truncate text-xs text-slate-500">
                            {payment.notes}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        aria-label="Reverse payment"
                        title="Reverse payment"
                        onClick={() => setPaymentToReverse(payment)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-100 bg-white text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-emerald-100 md:hidden">
                {payments.map((payment) => (
                  <div key={payment.id} className="space-y-4 px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {payment.invoiceNumber}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {formatDateTime(payment.paidAt)}
                        </p>
                      </div>
                      <PaymentMethodBadge method={payment.paymentMethod} />
                    </div>

                    <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-3 text-sm">
                      <div>
                        <p className="text-xs font-medium text-slate-500">
                          Amount
                        </p>
                        <p className="mt-1 font-semibold text-slate-900">
                          {formatCurrency(payment.amount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500">
                          Reference
                        </p>
                        <p className="mt-1 break-all font-semibold text-slate-900">
                          {payment.referenceNumber || '-'}
                        </p>
                      </div>
                    </div>

                    {payment.notes && (
                      <p className="text-sm text-slate-600">{payment.notes}</p>
                    )}

                    <button
                      type="button"
                      onClick={() => setPaymentToReverse(payment)}
                      className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reverse
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      <ConfirmDialog
        isOpen={paymentToReverse !== null}
        title="Reverse Payment"
        description="This will delete the payment record and the backend will recalculate the invoice status and balance."
        confirmLabel="Reverse Payment"
        isConfirming={deletePaymentMutation.isPending}
        onClose={() => {
          if (!deletePaymentMutation.isPending) setPaymentToReverse(null)
        }}
        onConfirm={() => {
          if (paymentToReverse) {
            deletePaymentMutation.mutate(paymentToReverse)
          }
        }}
      />
    </>
  )
}

function PaymentStat({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {icon}
      </div>
      <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  )
}

function PaymentMethodBadge({ method }: { method: Payment['paymentMethod'] }) {
  const className =
    method === 'CASH'
      ? 'bg-amber-50 text-amber-700 ring-amber-100'
      : 'bg-blue-50 text-blue-700 ring-blue-100'

  return (
    <span
      className={[
        'inline-flex w-fit items-center rounded-xl px-3 py-1 text-xs font-semibold tracking-wide ring-1',
        className,
      ].join(' ')}
    >
      {method}
    </span>
  )
}
