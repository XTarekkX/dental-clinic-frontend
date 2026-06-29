import { useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Activity,
  Banknote,
  CalendarCheck,
  ReceiptText,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useReports } from '../../hooks/useReports'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { EmptyState } from '../../components/common/EmptyState'
import { formatCurrency, formatDate } from '../../utils/formatters'

const CHART_COLORS = ['#059669', '#2563eb', '#f59e0b', '#ef4444', '#64748b']

const getMonthStart = () => {
  const date = new Date()
  return new Date(date.getFullYear(), date.getMonth(), 1)
    .toISOString()
    .slice(0, 10)
}

const getToday = () => new Date().toISOString().slice(0, 10)

export function ReportsPage() {
  const [startDate, setStartDate] = useState(getMonthStart)
  const [endDate, setEndDate] = useState(getToday)

  const reportsQuery = useReports({ startDate, endDate })
  const reports = reportsQuery.data

  const financialSeries = useMemo(() => {
    if (!reports) return []
    return [
      { name: 'Invoiced', value: reports.financial.totalInvoiced },
      { name: 'Collected', value: reports.financial.totalCollected },
      { name: 'Expenses', value: reports.financial.totalExpenses },
      { name: 'Profit', value: reports.financial.netProfit },
    ]
  }, [reports])

  const invoiceStatusData = useMemo(() => {
    if (!reports) return []
    return [
      { name: 'Draft', value: reports.financial.draftInvoices },
      { name: 'Issued', value: reports.financial.issuedInvoices },
      { name: 'Partial', value: reports.financial.partiallyPaidInvoices },
      { name: 'Paid', value: reports.financial.paidInvoices },
      { name: 'Cancelled', value: reports.financial.cancelledInvoices },
    ].filter((item) => item.value > 0)
  }, [reports])

  const appointmentStatusData = useMemo(() => {
    if (!reports) return []
    return [
      { name: 'Open', value: reports.appointments.openAppointments },
      { name: 'Checked in', value: reports.appointments.checkedInAppointments },
      { name: 'In progress', value: reports.appointments.inProgressAppointments },
      { name: 'Completed', value: reports.appointments.completedAppointments },
      { name: 'Cancelled', value: reports.appointments.cancelledAppointments },
      { name: 'No show', value: reports.appointments.noShowAppointments },
    ]
  }, [reports])

  const operationStatusData = useMemo(() => {
    if (!reports) return []
    return [
      { name: 'Planned', value: reports.operations.plannedOperations },
      { name: 'In progress', value: reports.operations.inProgressOperations },
      { name: 'Completed', value: reports.operations.completedOperations },
    ]
  }, [reports])

  const operationTypeData = useMemo(() => {
    if (!reports) return []
    return Object.entries(reports.operations.byOperationType)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
  }, [reports])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Reports
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Analyze finances, appointments, patients, and clinical operations.
          </p>
        </div>
      </div>

      <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DateInput
            id="reportStartDate"
            label="Start Date"
            value={startDate}
            onChange={setStartDate}
          />
          <DateInput
            id="reportEndDate"
            label="End Date"
            value={endDate}
            onChange={setEndDate}
          />
        </div>
      </section>

      {reportsQuery.isLoading ? (
        <LoadingSpinner />
      ) : reportsQuery.isError ? (
        <EmptyState
          title="Failed to load reports"
          description={
            reportsQuery.error instanceof Error
              ? reportsQuery.error.message
              : 'Something went wrong while loading reports.'
          }
        />
      ) : reports ? (
        <>
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ReportStat
              label="Collected"
              value={formatCurrency(reports.financial.totalCollected)}
              helper={`Invoiced ${formatCurrency(reports.financial.totalInvoiced)}`}
              icon={<Banknote className="h-5 w-5 text-emerald-600" />}
            />
            <ReportStat
              label="Net Profit"
              value={formatCurrency(reports.financial.netProfit)}
              helper={`Expenses ${formatCurrency(reports.financial.totalExpenses)}`}
              icon={<TrendingUp className="h-5 w-5 text-blue-600" />}
            />
            <ReportStat
              label="Appointments"
              value={String(reports.appointments.totalAppointments)}
              helper={`${reports.appointments.completionRate}% completion`}
              icon={<CalendarCheck className="h-5 w-5 text-amber-600" />}
            />
            <ReportStat
              label="New Patients"
              value={String(reports.patients.newPatientsInPeriod)}
              helper={`${reports.patients.totalActivePatients} active total`}
              icon={<Users className="h-5 w-5 text-emerald-600" />}
            />
          </section>

          <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <ChartPanel
              title="Financial Summary"
              subtitle={`${formatDate(reports.financial.startDate)} to ${formatDate(reports.financial.endDate)}`}
            >
              <ResponsiveContainer width="100%" height={280}>
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
            </ChartPanel>

            <ChartPanel title="Invoice Status" subtitle="Current period invoices">
              {invoiceStatusData.length === 0 ? (
                <MiniEmpty title="No invoice data" />
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={invoiceStatusData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={58}
                      outerRadius={92}
                      paddingAngle={3}
                    >
                      {invoiceStatusData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
              <LegendList data={invoiceStatusData} />
            </ChartPanel>
          </section>

          <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <ChartPanel title="Appointment Status" subtitle="Scheduling activity">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={appointmentStatusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis allowDecimals={false} stroke="#64748b" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartPanel>

            <ChartPanel title="Operation Status" subtitle="Treatment workflow">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={operationStatusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis allowDecimals={false} stroke="#64748b" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#059669" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartPanel>
          </section>

          <section className="grid grid-cols-1 gap-5 xl:grid-cols-[0.8fr_1.2fr]">
            <ChartPanel title="Patient Growth" subtitle="Patient records">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <CompactMetric
                  label="New in period"
                  value={reports.patients.newPatientsInPeriod}
                />
                <CompactMetric
                  label="Active patients"
                  value={reports.patients.totalActivePatients}
                />
              </div>
            </ChartPanel>

            <ChartPanel title="Top Operation Types" subtitle="Most common treatments">
              {operationTypeData.length === 0 ? (
                <MiniEmpty title="No operation types" />
              ) : (
                <div className="space-y-3">
                  {operationTypeData.map((item) => (
                    <div key={item.name}>
                      <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                        <span className="font-medium text-slate-700">
                          {item.name}
                        </span>
                        <span className="font-semibold text-slate-900">
                          {item.value}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{
                            width: `${Math.max(
                              8,
                              (item.value /
                                Math.max(...operationTypeData.map((d) => d.value))) *
                                100,
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ChartPanel>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <ReportStat
              label="Outstanding"
              value={formatCurrency(reports.financial.totalOutstanding)}
              helper="Invoiced minus collected"
              icon={<ReceiptText className="h-5 w-5 text-amber-600" />}
            />
            <ReportStat
              label="Operations"
              value={String(reports.operations.totalOperations)}
              helper={`${reports.operations.completedOperations} completed`}
              icon={<Activity className="h-5 w-5 text-blue-600" />}
            />
            <ReportStat
              label="Cancelled Invoices"
              value={String(reports.financial.cancelledInvoices)}
              helper="Current period"
              icon={<ReceiptText className="h-5 w-5 text-red-600" />}
            />
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

function ReportStat({
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

function ChartPanel({
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
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

function CompactMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
    </div>
  )
}

function LegendList({ data }: { data: Array<{ name: string; value: number }> }) {
  if (data.length === 0) return null

  return (
    <div className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
      {data.map((item, index) => (
        <div key={item.name} className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-slate-600">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
            />
            {item.name}
          </span>
          <span className="font-semibold text-slate-900">{item.value}</span>
        </div>
      ))}
    </div>
  )
}

function MiniEmpty({ title }: { title: string }) {
  return (
    <div className="flex h-[280px] items-center justify-center rounded-2xl bg-slate-50 text-sm font-medium text-slate-500">
      {title}
    </div>
  )
}
