import { useMemo, useState } from 'react'
import {
  Banknote,
  Edit3,
  FileText,
  Plus,
  ReceiptText,
  Send,
  Trash2,
  XCircle,
} from 'lucide-react'
import { useInvoices } from '../../hooks/useInvoices'
import { usePatients } from '../../hooks/usePatients'
import { useInvoiceDetail } from '../../hooks/useInvoiceDetail'
import { useInvoicePayments } from '../../hooks/useInvoicePayments'
import { useCreateInvoice } from '../../hooks/useCreateInvoice'
import { useUpdateInvoice } from '../../hooks/useUpdateInvoice'
import { useUpdateInvoiceStatus } from '../../hooks/useUpdateInvoiceStatus'
import { useDeleteInvoice } from '../../hooks/useDeleteInvoice'
import { useCreatePayment } from '../../hooks/useCreatePayment'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { EmptyState } from '../../components/common/EmptyState'
import { Modal } from '../../components/common/Modal'
import { ConfirmDialog } from '../../components/common/ConfirmDialog'
import { InvoiceForm } from '../../components/forms/InvoiceForm'
import { PaymentForm } from '../../components/forms/PaymentForm'
import { Pagination } from '../../components/common/Pagination'
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters'
import type {
  Invoice,
  InvoiceRequest,
  InvoiceStatus,
  PaymentRequest,
} from '../../types/invoice.types'

const PAGE_SIZE = 10
const STATUS_OPTIONS: Array<InvoiceStatus | ''> = [
  '',
  'DRAFT',
  'ISSUED',
  'PARTIALLY_PAID',
  'PAID',
  'CANCELLED',
]

const statusClassMap: Record<InvoiceStatus, string> = {
  DRAFT: 'bg-slate-100 text-slate-700 ring-slate-200',
  ISSUED: 'bg-blue-50 text-blue-700 ring-blue-100',
  PARTIALLY_PAID: 'bg-amber-50 text-amber-700 ring-amber-100',
  PAID: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  CANCELLED: 'bg-red-50 text-red-700 ring-red-100',
}

function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-xl px-3 py-1 text-xs font-semibold tracking-wide ring-1',
        statusClassMap[status],
      ].join(' ')}
    >
      {status.replace('_', ' ')}
    </span>
  )
}

function canRecordPayment(invoice: Invoice) {
  return (
    invoice.balanceDue > 0 &&
    invoice.status !== 'CANCELLED' &&
    invoice.status !== 'PAID'
  )
}

export function InvoicesListPage() {
  const [page, setPage] = useState(0)
  const [status, setStatus] = useState<InvoiceStatus | ''>('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null)
  const [deleteInvoiceTarget, setDeleteInvoiceTarget] = useState<Invoice | null>(
    null,
  )
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null)

  const { data, isLoading, isError, error, isFetching } = useInvoices({
    page,
    size: PAGE_SIZE,
    status,
  })
  const { data: patientsData } = usePatients({
    page: 0,
    size: 100,
    search: '',
  })
  const selectedInvoiceQuery = useInvoiceDetail(selectedInvoiceId)
  const paymentsQuery = useInvoicePayments(selectedInvoiceId)

  const invoices = useMemo(() => data?.content ?? [], [data])
  const patients = useMemo(() => patientsData?.content ?? [], [patientsData])

  const createInvoiceMutation = useCreateInvoice({
    onSuccess: () => setIsCreateOpen(false),
  })
  const updateInvoiceMutation = useUpdateInvoice({
    onSuccess: () => setEditingInvoice(null),
  })
  const updateStatusMutation = useUpdateInvoiceStatus()
  const deleteInvoiceMutation = useDeleteInvoice({
    onSuccess: () => setDeleteInvoiceTarget(null),
  })
  const createPaymentMutation = useCreatePayment({
    invoiceId: paymentInvoice?.id ?? null,
    onSuccess: () => setPaymentInvoice(null),
  })

  const totalOpenBalance = invoices.reduce(
    (sum, invoice) => sum + invoice.balanceDue,
    0,
  )
  const totalPaid = invoices.reduce((sum, invoice) => sum + invoice.amountPaid, 0)

  const handleStatusChange = (nextStatus: InvoiceStatus | '') => {
    setStatus(nextStatus)
    setPage(0)
  }

  const handleCreateInvoice = (values: InvoiceRequest) => {
    createInvoiceMutation.mutate(values)
  }

  const handleUpdateInvoice = (values: InvoiceRequest) => {
    if (!editingInvoice) return
    updateInvoiceMutation.mutate({ id: editingInvoice.id, values })
  }

  const handleRecordPayment = (values: PaymentRequest) => {
    createPaymentMutation.mutate(values)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Failed to load invoices
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {error instanceof Error
            ? error.message
            : 'Something went wrong while loading invoices.'}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Invoices
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Create treatment invoices, issue drafts, and record patient payments.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-emerald-600"
          >
            <Plus className="h-4 w-4" />
            New Invoice
          </button>
        </div>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-500">Visible invoices</p>
              <FileText className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="mt-3 text-2xl font-semibold text-slate-900">
              {data?.totalElements ?? 0}
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-500">Open balance</p>
              <ReceiptText className="h-5 w-5 text-amber-600" />
            </div>
            <p className="mt-3 text-2xl font-semibold text-slate-900">
              {formatCurrency(totalOpenBalance)}
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-500">Paid on page</p>
              <Banknote className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="mt-3 text-2xl font-semibold text-slate-900">
              {formatCurrency(totalPaid)}
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-emerald-100 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option || 'ALL'}
                  type="button"
                  onClick={() => handleStatusChange(option)}
                  className={[
                    'rounded-xl px-3 py-2 text-xs font-semibold transition',
                    status === option
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700',
                  ].join(' ')}
                >
                  {option ? option.replace('_', ' ') : 'ALL'}
                </button>
              ))}
            </div>

            {isFetching && !isLoading && (
              <p className="text-xs font-medium text-emerald-700">
                Updating invoices...
              </p>
            )}
          </div>

          {invoices.length === 0 ? (
            <div className="p-5">
              <EmptyState
                title="No invoices found"
                description={
                  status
                    ? 'No invoices match the selected status.'
                    : 'There are no billing records to display yet.'
                }
              />
            </div>
          ) : (
            <>
              <div className="hidden lg:block">
                <div className="grid grid-cols-[1.1fr_1.5fr_1fr_1fr_1fr_1.2fr] border-b border-emerald-100 bg-emerald-50/50 px-5 py-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  <div>Invoice</div>
                  <div>Patient</div>
                  <div>Status</div>
                  <div>Net</div>
                  <div>Balance</div>
                  <div>Actions</div>
                </div>

                <div className="divide-y divide-emerald-100">
                  {invoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="grid grid-cols-[1.1fr_1.5fr_1fr_1fr_1fr_1.2fr] items-center gap-4 px-5 py-5"
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedInvoiceId(invoice.id)}
                        className="min-w-0 text-left"
                      >
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {invoice.invoiceNumber}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Due {formatDate(invoice.dueDate)}
                        </p>
                      </button>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {invoice.patientFullName}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-500">
                          Dr. {invoice.doctorFullName}
                        </p>
                      </div>

                      <InvoiceStatusBadge status={invoice.status} />

                      <div className="text-sm font-semibold text-slate-900">
                        {formatCurrency(invoice.netAmount)}
                      </div>

                      <div className="text-sm font-semibold text-slate-900">
                        {formatCurrency(invoice.balanceDue)}
                      </div>

                      <InvoiceActions
                        invoice={invoice}
                        onView={() => setSelectedInvoiceId(invoice.id)}
                        onEdit={() => setEditingInvoice(invoice)}
                        onIssue={() =>
                          updateStatusMutation.mutate({
                            id: invoice.id,
                            status: 'ISSUED',
                          })
                        }
                        onCancel={() =>
                          updateStatusMutation.mutate({
                            id: invoice.id,
                            status: 'CANCELLED',
                          })
                        }
                        onDelete={() => setDeleteInvoiceTarget(invoice)}
                        onPay={() => setPaymentInvoice(invoice)}
                        isMutating={updateStatusMutation.isPending}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-emerald-100 lg:hidden">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="space-y-4 px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedInvoiceId(invoice.id)}
                        className="min-w-0 text-left"
                      >
                        <p className="text-sm font-semibold text-slate-900">
                          {invoice.invoiceNumber}
                        </p>
                        <p className="mt-1 text-sm text-slate-700">
                          {invoice.patientFullName}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Due {formatDate(invoice.dueDate)}
                        </p>
                      </button>
                      <InvoiceStatusBadge status={invoice.status} />
                    </div>

                    <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-3 text-sm">
                      <div>
                        <p className="text-xs font-medium text-slate-500">Net</p>
                        <p className="mt-1 font-semibold text-slate-900">
                          {formatCurrency(invoice.netAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500">
                          Balance
                        </p>
                        <p className="mt-1 font-semibold text-slate-900">
                          {formatCurrency(invoice.balanceDue)}
                        </p>
                      </div>
                    </div>

                    <InvoiceActions
                      invoice={invoice}
                      onView={() => setSelectedInvoiceId(invoice.id)}
                      onEdit={() => setEditingInvoice(invoice)}
                      onIssue={() =>
                        updateStatusMutation.mutate({
                          id: invoice.id,
                          status: 'ISSUED',
                        })
                      }
                      onCancel={() =>
                        updateStatusMutation.mutate({
                          id: invoice.id,
                          status: 'CANCELLED',
                        })
                      }
                      onDelete={() => setDeleteInvoiceTarget(invoice)}
                      onPay={() => setPaymentInvoice(invoice)}
                      isMutating={updateStatusMutation.isPending}
                    />
                  </div>
                ))}
              </div>

              <Pagination
                page={data?.page ?? 0}
                totalPages={data?.totalPages ?? 0}
                totalElements={data?.totalElements ?? 0}
                onPageChange={setPage}
              />
            </>
          )}
        </section>
      </div>

      <Modal
        isOpen={isCreateOpen}
        title="New Invoice"
        onClose={() => {
          if (!createInvoiceMutation.isPending) setIsCreateOpen(false)
        }}
      >
        <InvoiceForm
          patients={patients}
          onSubmit={handleCreateInvoice}
          isSubmitting={createInvoiceMutation.isPending}
        />
      </Modal>

      <Modal
        isOpen={editingInvoice !== null}
        title="Edit Invoice"
        onClose={() => {
          if (!updateInvoiceMutation.isPending) setEditingInvoice(null)
        }}
      >
        {editingInvoice && (
          <InvoiceForm
            patients={patients}
            invoice={editingInvoice}
            onSubmit={handleUpdateInvoice}
            isSubmitting={updateInvoiceMutation.isPending}
          />
        )}
      </Modal>

      <Modal
        isOpen={paymentInvoice !== null}
        title="Record Payment"
        onClose={() => {
          if (!createPaymentMutation.isPending) setPaymentInvoice(null)
        }}
      >
        {paymentInvoice && (
          <PaymentForm
            invoice={paymentInvoice}
            onSubmit={handleRecordPayment}
            isSubmitting={createPaymentMutation.isPending}
          />
        )}
      </Modal>

      <Modal
        isOpen={selectedInvoiceId !== null}
        title="Invoice Details"
        onClose={() => setSelectedInvoiceId(null)}
      >
        <div className="p-5 sm:p-6">
          {selectedInvoiceQuery.isLoading ? (
            <LoadingSpinner />
          ) : selectedInvoiceQuery.data ? (
            <InvoiceDetails
              invoice={selectedInvoiceQuery.data}
              payments={paymentsQuery.data ?? []}
              isLoadingPayments={paymentsQuery.isLoading}
            />
          ) : (
            <EmptyState
              title="Invoice unavailable"
              description="The selected invoice could not be loaded."
            />
          )}
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={deleteInvoiceTarget !== null}
        title="Delete Invoice"
        description="This will permanently delete the draft invoice. The backend only allows deleting draft invoices."
        confirmLabel="Delete Invoice"
        isConfirming={deleteInvoiceMutation.isPending}
        onClose={() => {
          if (!deleteInvoiceMutation.isPending) setDeleteInvoiceTarget(null)
        }}
        onConfirm={() => {
          if (deleteInvoiceTarget) {
            deleteInvoiceMutation.mutate(deleteInvoiceTarget.id)
          }
        }}
      />
    </>
  )
}

interface InvoiceActionsProps {
  invoice: Invoice
  onView: () => void
  onEdit: () => void
  onIssue: () => void
  onCancel: () => void
  onDelete: () => void
  onPay: () => void
  isMutating: boolean
}

function InvoiceActions({
  invoice,
  onView,
  onEdit,
  onIssue,
  onCancel,
  onDelete,
  onPay,
  isMutating,
}: InvoiceActionsProps) {
  const iconButtonClass =
    'inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-100 bg-white text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40'

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        aria-label="View invoice"
        title="View invoice"
        onClick={onView}
        className={iconButtonClass}
      >
        <ReceiptText className="h-4 w-4" />
      </button>

      <button
        type="button"
        aria-label="Edit invoice"
        title="Edit invoice"
        onClick={onEdit}
        disabled={invoice.status !== 'DRAFT'}
        className={iconButtonClass}
      >
        <Edit3 className="h-4 w-4" />
      </button>

      <button
        type="button"
        aria-label="Issue invoice"
        title="Issue invoice"
        onClick={onIssue}
        disabled={invoice.status !== 'DRAFT' || isMutating}
        className={iconButtonClass}
      >
        <Send className="h-4 w-4" />
      </button>

      <button
        type="button"
        aria-label="Record payment"
        title="Record payment"
        onClick={onPay}
        disabled={!canRecordPayment(invoice)}
        className={iconButtonClass}
      >
        <Banknote className="h-4 w-4" />
      </button>

      <button
        type="button"
        aria-label="Cancel invoice"
        title="Cancel invoice"
        onClick={onCancel}
        disabled={invoice.status === 'PAID' || invoice.status === 'CANCELLED' || isMutating}
        className={iconButtonClass}
      >
        <XCircle className="h-4 w-4" />
      </button>

      <button
        type="button"
        aria-label="Delete invoice"
        title="Delete invoice"
        onClick={onDelete}
        disabled={invoice.status !== 'DRAFT'}
        className={iconButtonClass}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}

interface InvoiceDetailsProps {
  invoice: Invoice
  payments: Array<{
    id: number
    amount: number
    paymentMethod: string
    referenceNumber: string | null
    paidAt: string
    notes: string | null
  }>
  isLoadingPayments: boolean
}

function InvoiceDetails({
  invoice,
  payments,
  isLoadingPayments,
}: InvoiceDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <DetailStat label="Net" value={formatCurrency(invoice.netAmount)} />
        <DetailStat label="Paid" value={formatCurrency(invoice.amountPaid)} />
        <DetailStat label="Balance" value={formatCurrency(invoice.balanceDue)} />
        <div className="rounded-2xl border border-emerald-100 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Status
          </p>
          <div className="mt-2">
            <InvoiceStatusBadge status={invoice.status} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-2xl border border-emerald-100 bg-slate-50/60 p-4 text-sm sm:grid-cols-2">
        <div>
          <p className="font-semibold text-slate-900">{invoice.invoiceNumber}</p>
          <p className="mt-1 text-slate-600">{invoice.patientFullName}</p>
        </div>
        <div>
          <p className="text-slate-600">Doctor: {invoice.doctorFullName}</p>
          <p className="mt-1 text-slate-600">Due: {formatDate(invoice.dueDate)}</p>
        </div>
        {invoice.notes && (
          <p className="sm:col-span-2 text-slate-600">{invoice.notes}</p>
        )}
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Line Items</h3>
        <div className="overflow-hidden rounded-2xl border border-emerald-100">
          <div className="grid grid-cols-[1fr_80px_120px_120px] bg-emerald-50/70 px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            <div>Description</div>
            <div>Qty</div>
            <div>Unit</div>
            <div>Total</div>
          </div>
          {invoice.items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_80px_120px_120px] border-t border-emerald-100 px-4 py-3 text-sm text-slate-700"
            >
              <div className="truncate pr-3">{item.description}</div>
              <div>{item.quantity}</div>
              <div>{formatCurrency(item.unitPrice)}</div>
              <div className="font-semibold text-slate-900">
                {formatCurrency(item.totalPrice)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Payments</h3>
        {isLoadingPayments ? (
          <LoadingSpinner />
        ) : payments.length === 0 ? (
          <EmptyState
            title="No payments recorded"
            description="Payments recorded for this invoice will appear here."
          />
        ) : (
          <div className="divide-y divide-emerald-100 rounded-2xl border border-emerald-100">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="grid grid-cols-1 gap-2 px-4 py-3 text-sm sm:grid-cols-[1fr_1fr_1fr]"
              >
                <div className="font-semibold text-slate-900">
                  {formatCurrency(payment.amount)}
                </div>
                <div className="text-slate-600">{payment.paymentMethod}</div>
                <div className="text-slate-600">
                  {formatDateTime(payment.paidAt)}
                </div>
                {(payment.referenceNumber || payment.notes) && (
                  <div className="text-slate-500 sm:col-span-3">
                    {[payment.referenceNumber, payment.notes]
                      .filter(Boolean)
                      .join(' · ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function DetailStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  )
}
