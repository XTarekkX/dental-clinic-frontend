import {
  CalendarDays,
  Users,
  Wallet,
  Activity,
  Clock3,
  UserRoundPlus,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useDashboard } from '../../hooks/useDashboard'
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters'
import { StatusBadge } from '../../components/common/StatusBadge'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { EmptyState } from '../../components/common/EmptyState'
import { APP_ROUTES } from '../../utils/constants'

export function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboard()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError || !data) {
    return (
      <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Failed to load dashboard
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {error instanceof Error
            ? error.message
            : 'Something went wrong while loading dashboard data.'}
        </p>
      </div>
    )
  }

  const statCards = [
    {
      title: "Today's Appointments",
      value: data.todayTotal,
      icon: CalendarDays,
      hint: `${data.todayOpen} open`,
    },
    {
      title: "Today's Patients",
      value: data.totalActivePatients,
      icon: Users,
      hint: `${data.totalAppointmentsAllTime} all-time appointments`,
    },
    {
      title: "Today's Revenue",
      value: formatCurrency(data.todayRevenue),
      icon: Wallet,
      hint: `${data.todayCompleted} completed today`,
    },
    {
      title: 'In Progress',
      value: data.todayInProgress,
      icon: Activity,
      hint: `${data.todayCheckedIn} checked in`,
    },
  ]

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon

          return (
            <article
              key={card.title}
              className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-500">
                    {card.title}
                  </p>
                  <p className="mt-4 truncate text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                    {card.value}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">{card.hint}</p>
                </div>

                <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </article>
          )
        })}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-emerald-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-emerald-100 px-5 py-5">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                Upcoming Appointments
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Your clinic’s next scheduled patient visits.
              </p>
            </div>

            <Link
              to={APP_ROUTES.appointments}
              className="hidden rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 sm:inline-flex"
            >
              View all
            </Link>
          </div>

          <div className="divide-y divide-emerald-100">
            {data.upcomingAppointments.length === 0 ? (
              <div className="p-5">
                <EmptyState
                  title="No upcoming appointments"
                  description="There are no upcoming appointments to display right now."
                />
              </div>
            ) : (
              data.upcomingAppointments.map((appointment) => (
                <article
                  key={appointment.id}
                  className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                      <Clock3 className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-slate-900">
                        {appointment.patientFullName}
                      </h3>
                      <p className="truncate text-sm text-slate-500">
                        {appointment.reason}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                    <div className="text-left sm:text-right">
                      <p className="text-sm font-medium text-slate-900">
                        {formatDate(appointment.scheduledAt)}
                      </p>
                      <p className="text-sm text-slate-500">
                        {formatTime(appointment.scheduledAt)}
                      </p>
                    </div>

                    <StatusBadge status={appointment.status} />
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-emerald-100 px-5 py-5">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                Recent Patients
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Newly added patient records.
              </p>
            </div>

            <Link
              to={APP_ROUTES.patients}
              className="hidden rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 sm:inline-flex"
            >
              Open patients
            </Link>
          </div>

          <div className="divide-y divide-emerald-100">
            {data.recentPatients.length === 0 ? (
              <div className="p-5">
                <EmptyState
                  title="No recent patients"
                  description="Recent patient registrations will appear here."
                />
              </div>
            ) : (
              data.recentPatients.map((patient) => (
                <article
                  key={patient.id}
                  className="flex items-start gap-4 px-5 py-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <UserRoundPlus className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-slate-900">
                      {patient.firstName} {patient.lastName}
                    </h3>
                    <p className="truncate text-sm text-slate-500">
                      {patient.phone || patient.email || 'No contact info'}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Added {formatDate(patient.createdAt)}
                    </p>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}