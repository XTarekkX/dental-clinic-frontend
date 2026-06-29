import { useMemo, useState } from 'react'
import { Edit3, Plus, ReceiptText, Trash2, WalletCards } from 'lucide-react'
import { useInvoices } from '../../hooks/useInvoices'
import { useExpenses } from '../../hooks/useExpenses'
import { useCreateExpense } from '../../hooks/useCreateExpense'
import { useUpdateExpense } from '../../hooks/useUpdateExpense'
import { useDeleteExpense } from '../../hooks/useDeleteExpense'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { EmptyState } from '../../components/common/EmptyState'
import { Modal } from '../../components/common/Modal'
import { ConfirmDialog } from '../../components/common/ConfirmDialog'
import { Pagination } from '../../components/common/Pagination'
import { ExpenseForm } from '../../components/forms/ExpenseForm'
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters'
import type { Expense, ExpenseRequest } from '../../types/expense.types'

const PAGE_SIZE = 10

const getMonthStart = () => {
  const date = new Date()
  return new Date(date.getFullYear(), date.getMonth(), 1)
    .toISOString()
    .slice(0, 10)
}

const getToday = () => new Date().toISOString().slice(0, 10)

export function ExpensesPage() {
  const [page, setPage] = useState(0)
  const [startDate, setStartDate] = useState(getMonthStart)
  const [endDate, setEndDate] = useState(getToday)
  const [createdDoctorId, setCreatedDoctorId] = useState<number | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [deleteExpenseTarget, setDeleteExpenseTarget] =
    useState<Expense | null>(null)

  const invoiceProbeQuery = useInvoices({
    page: 0,
    size: 1,
    status: '',
  })

  const doctorId =
    createdDoctorId ?? invoiceProbeQuery.data?.content[0]?.doctorId ?? null

  const expensesQuery = useExpenses({
    doctorId,
    startDate,
    endDate,
    page,
    size: PAGE_SIZE,
  })

  const expenses = useMemo(
    () => expensesQuery.data?.content ?? [],
    [expensesQuery.data],
  )

  const createExpenseMutation = useCreateExpense({
    onSuccess: (expense) => {
      setCreatedDoctorId(expense.doctorId)
      setIsCreateOpen(false)
      setPage(0)
    },
  })
  const updateExpenseMutation = useUpdateExpense({
    onSuccess: () => setEditingExpense(null),
  })
  const deleteExpenseMutation = useDeleteExpense({
    onSuccess: () => setDeleteExpenseTarget(null),
  })

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  )
  const largestExpense = expenses.reduce(
    (max, expense) => Math.max(max, expense.amount),
    0,
  )
  const categoryCount = new Set(expenses.map((expense) => expense.category)).size

  const handleDateChange = (setter: (value: string) => void, value: string) => {
    setter(value)
    setPage(0)
  }

  const handleCreateExpense = (values: ExpenseRequest) => {
    createExpenseMutation.mutate(values)
  }

  const handleUpdateExpense = (values: ExpenseRequest) => {
    if (!editingExpense) return
    updateExpenseMutation.mutate({ id: editingExpense.id, values })
  }

  const isWaitingForDoctorId = !doctorId && invoiceProbeQuery.isFetching

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Expenses
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Track clinic costs by date range and manage operational expense entries.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-emerald-600"
          >
            <Plus className="h-4 w-4" />
            Add Expense
          </button>
        </div>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <ExpenseStat
            label="Total in range"
            value={formatCurrency(totalExpenses)}
            icon={<WalletCards className="h-5 w-5 text-emerald-600" />}
          />
          <ExpenseStat
            label="Largest item"
            value={formatCurrency(largestExpense)}
            icon={<ReceiptText className="h-5 w-5 text-amber-600" />}
          />
          <ExpenseStat
            label="Categories"
            value={String(categoryCount)}
            icon={<ReceiptText className="h-5 w-5 text-blue-600" />}
          />
        </section>

        <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="expenseStartDate"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Start Date
              </label>
              <input
                id="expenseStartDate"
                type="date"
                value={startDate}
                onChange={(event) =>
                  handleDateChange(setStartDate, event.target.value)
                }
                className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
              />
            </div>

            <div>
              <label
                htmlFor="expenseEndDate"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                End Date
              </label>
              <input
                id="expenseEndDate"
                type="date"
                value={endDate}
                onChange={(event) =>
                  handleDateChange(setEndDate, event.target.value)
                }
                className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
              />
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
          <div className="border-b border-emerald-100 px-4 py-4 sm:px-5">
            <h2 className="text-base font-semibold text-slate-900">
              Expense records
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {doctorId
                ? `${expensesQuery.data?.totalElements ?? 0} records from ${formatDate(startDate)} to ${formatDate(endDate)}`
                : 'Add an expense or create an invoice first so the backend can identify the current doctor for expense listing.'}
            </p>
          </div>

          {isWaitingForDoctorId ? (
            <LoadingSpinner />
          ) : !doctorId ? (
            <div className="p-5">
              <EmptyState
                title="Doctor profile not discovered yet"
                description="The expenses list endpoint requires doctorId. Add your first expense and the returned doctorId will be used automatically."
              />
            </div>
          ) : expensesQuery.isLoading ? (
            <LoadingSpinner />
          ) : expensesQuery.isError ? (
            <div className="p-5">
              <EmptyState
                title="Failed to load expenses"
                description={
                  expensesQuery.error instanceof Error
                    ? expensesQuery.error.message
                    : 'Something went wrong while loading expenses.'
                }
              />
            </div>
          ) : expenses.length === 0 ? (
            <div className="p-5">
              <EmptyState
                title="No expenses found"
                description="No expense records match this date range."
              />
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <div className="grid grid-cols-[1.1fr_1fr_1fr_1.7fr_96px] border-b border-emerald-100 bg-emerald-50/50 px-5 py-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  <div>Date</div>
                  <div>Category</div>
                  <div>Amount</div>
                  <div>Description</div>
                  <div>Actions</div>
                </div>

                <div className="divide-y divide-emerald-100">
                  {expenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="grid grid-cols-[1.1fr_1fr_1fr_1.7fr_96px] items-center gap-4 px-5 py-5"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {formatDate(expense.expenseDate)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Added {formatDateTime(expense.createdAt)}
                        </p>
                      </div>
                      <div>
                        <span className="inline-flex rounded-xl bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {expense.category}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-slate-900">
                        {formatCurrency(expense.amount)}
                      </div>
                      <div className="min-w-0 truncate text-sm text-slate-700">
                        {expense.description || '-'}
                      </div>
                      <ExpenseActions
                        onEdit={() => setEditingExpense(expense)}
                        onDelete={() => setDeleteExpenseTarget(expense)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-emerald-100 md:hidden">
                {expenses.map((expense) => (
                  <div key={expense.id} className="space-y-4 px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {expense.category}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {formatDate(expense.expenseDate)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">
                        {formatCurrency(expense.amount)}
                      </p>
                    </div>

                    {expense.description && (
                      <p className="text-sm text-slate-600">
                        {expense.description}
                      </p>
                    )}

                    <ExpenseActions
                      onEdit={() => setEditingExpense(expense)}
                      onDelete={() => setDeleteExpenseTarget(expense)}
                    />
                  </div>
                ))}
              </div>

              <Pagination
                page={expensesQuery.data?.page ?? 0}
                totalPages={expensesQuery.data?.totalPages ?? 0}
                totalElements={expensesQuery.data?.totalElements ?? 0}
                onPageChange={setPage}
              />
            </>
          )}
        </section>
      </div>

      <Modal
        isOpen={isCreateOpen}
        title="Add Expense"
        onClose={() => {
          if (!createExpenseMutation.isPending) setIsCreateOpen(false)
        }}
      >
        <ExpenseForm
          onSubmit={handleCreateExpense}
          isSubmitting={createExpenseMutation.isPending}
        />
      </Modal>

      <Modal
        isOpen={editingExpense !== null}
        title="Edit Expense"
        onClose={() => {
          if (!updateExpenseMutation.isPending) setEditingExpense(null)
        }}
      >
        {editingExpense && (
          <ExpenseForm
            expense={editingExpense}
            onSubmit={handleUpdateExpense}
            isSubmitting={updateExpenseMutation.isPending}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={deleteExpenseTarget !== null}
        title="Delete Expense"
        description="This will permanently delete the selected expense record."
        confirmLabel="Delete Expense"
        isConfirming={deleteExpenseMutation.isPending}
        onClose={() => {
          if (!deleteExpenseMutation.isPending) setDeleteExpenseTarget(null)
        }}
        onConfirm={() => {
          if (deleteExpenseTarget) {
            deleteExpenseMutation.mutate(deleteExpenseTarget.id)
          }
        }}
      />
    </>
  )
}

function ExpenseStat({
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

function ExpenseActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void
  onDelete: () => void
}) {
  const iconButtonClass =
    'inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-100 bg-white text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700'

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        aria-label="Edit expense"
        title="Edit expense"
        onClick={onEdit}
        className={iconButtonClass}
      >
        <Edit3 className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label="Delete expense"
        title="Delete expense"
        onClick={onDelete}
        className={iconButtonClass}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}
