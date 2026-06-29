import { useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Banknote, CalendarCheck, ReceiptText, TrendingUp } from 'lucide-react'
import { useClinicFinancialReport } from '../../hooks/useClinicFinancialReport'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { EmptyState } from '../../components/common/EmptyState'
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters'

const getMonthStart = () => {
  const date = new Date()
  return new Date(date.getFullYear(), date.getMonth(), 1)
    .toISOString()
    .slice(0, 10)
}

const getToday = () => new Date().toISOString().slice(0, 10)

export function ClinicReportsPage() {
  const [startDate, setStartDate] = useState(getMonthStart)
  const [endDate, setEndDate] = useState(getToday)

  const reportQuery = useClinicFinancialReport({ startDate, endDate })
  const report = reportQuery.data

  const financialSeries = useMemo(() => {
    if (!report) return []
    return [
      { name: 'Collected', value: report.totalCollected },
      { name: 'Expenses', value: report.totalExpenses },
      { name: 'Net Profit', value: report.netProfit },
    ]
  }, [report])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Clinic Reports
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Whole-clinic financials across all doctors, payments, expenses, and appointments.
          </p>
        </div>
      </div>

      <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DateInput
            id="clinicReportStartDate"
            label="Start Date"
            value={startDate}
            onChange={setStartDate}
          />
          <DateInput
            id="clinicReportEndDate"
            label="End Date"
            value={endDate}
            onChange={setEndDate}
          />
        </div>
      </section>

      {reportQuery.isLoading ? (
        <LoadingSpinner />
      ) : reportQuery.isError ? (
        <EmptyState
          title="Failed to load clinic reports"
          description={
            reportQuery.error instanceof Error
              ? reportQuery.error.message
              : 'Something went wrong while loading clinic-wide reports.'
          }
        />
      ) : report ? (
        <>
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ClinicStat
              label="Collected Payments"
              value={formatCurrency(report.totalCollected)}
              helper={`${report.payments.length} payment records`}
              icon={<Banknote className="h-5 w-5 text-emerald-600" />}
            />
            <ClinicStat
              label="Expenses"
              value={formatCurrency(report.totalExpenses)}
              helper={`${report.expenses.length} expense records`}
              icon={<ReceiptText className="h-5 w-5 text-amber-600" />}
            />
            <ClinicStat
              label="Net Profit"
              value={formatCurrency(report.netProfit)}
              helper="Collected minus expenses"
              icon={<TrendingUp className="h-5 w-5 text-blue-600" />}
            />
            <ClinicStat
              label="Total Appointments"
              value={String(report.totalAppointments)}
              helper={`${formatDate(report.startDate)} to ${formatDate(report.endDate)}`}
              icon={<CalendarCheck className="h-5 w-5 text-emerald-600" />}
            />
          </section>

          <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-slate-900">
                Financial Summary
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Whole-clinic totals for the selected date range.
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={financialSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#059669"
                  fill="#a7f3d0"
                />
              </AreaChart>
            </ResponsiveContainer>
          </section>

          <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <ClinicPanel
              title="Collected Payments"
              subtitle="Includes doctor, patient, invoice, method, and payment date."
            >
              {report.payments.length === 0 ? (
                <MiniEmpty title="No payments in this range" />
              ) : (
                <div className="divide-y divide-emerald-100">
                  {report.payments.map((payment) => (
                    <div key={payment.id} className="grid gap-3 px-1 py-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {payment.doctorFullName}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {payment.patientFullName} · {payment.invoiceNumber}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-emerald-700">
                          {formatCurrency(payment.amount)}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 gap-2 text-sm text-slate-600 sm:grid-cols-3">
                        <span>{payment.paymentMethod}</span>
                        <span>{formatDateTime(payment.paidAt)}</span>
                        <span className="break-all">
                          {payment.referenceNumber || '-'}
                        </span>
                      </div>
                      {payment.notes && (
                        <p className="text-sm text-slate-500">{payment.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ClinicPanel>

            <ClinicPanel
              title="Expenses"
              subtitle="Includes doctor, category, expense date, amount, and description."
            >
              {report.expenses.length === 0 ? (
                <MiniEmpty title="No expenses in this range" />
              ) : (
                <div className="divide-y divide-emerald-100">
                  {report.expenses.map((expense) => (
                    <div key={expense.id} className="grid gap-3 px-1 py-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {expense.doctorFullName}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {expense.category} · {formatDate(expense.expenseDate)}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-amber-700">
                          {formatCurrency(expense.amount)}
                        </p>
                      </div>
                      <p className="text-sm text-slate-600">
                        {expense.description || '-'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </ClinicPanel>
          </section>
        </>
      ) : null}
    </div>
  )
}

function DateInput({
  id,
  label,
  value,
  onChange,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
      />
    </div>
  )
}

function ClinicStat({
  label,
  value,
  helper,
  icon,
}: {
  label: string
  value: string
  helper: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {icon}
      </div>
      <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{helper}</p>
    </div>
  )
}

function ClinicPanel({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
      <div className="mb-2">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      <div className="max-h-[560px] overflow-y-auto">{children}</div>
    </section>
  )
}

function MiniEmpty({ title }: { title: string }) {
  return (
    <div className="flex min-h-40 items-center justify-center rounded-2xl bg-slate-50 text-sm font-medium text-slate-500">
      {title}
    </div>
  )
}
