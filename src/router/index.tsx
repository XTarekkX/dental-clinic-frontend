import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from '../pages/auth/LoginPage'
import { DashboardPage } from '../pages/dashboard/DashboardPage'
import { PrivateRoute } from '../components/layout/PrivateRoute'
import { AppLayout } from '../components/layout/AppLayout'
import { APP_ROUTES } from '../utils/constants'
import { PatientsListPage } from '../pages/patients/PatientsListPage'
import { PatientDetailPage } from '../pages/patients/PatientDetailPage'
import { AppointmentsPage } from '../pages/appointments/AppointmentsPage'
import { InvoicesListPage } from '../pages/invoices/InvoicesListPage'
import { PaymentsPage } from '../pages/payments/PaymentsPage'
import { ExpensesPage } from '../pages/expenses/ExpensesPage'
import { ReportsPage } from '../pages/reports/ReportsPage'
import { ClinicReportsPage } from '../pages/reports/ClinicReportsPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={APP_ROUTES.login} element={<LoginPage />} />

        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route path={APP_ROUTES.dashboard} element={<DashboardPage />} />
            <Route path={APP_ROUTES.patients} element={<PatientsListPage />} />
            <Route path={APP_ROUTES.patientDetail} element={<PatientDetailPage />} />
            <Route
              path={APP_ROUTES.appointments}
              element={<AppointmentsPage />}
            />
            <Route
              path={APP_ROUTES.invoices}
              element={<InvoicesListPage />}
            />
            <Route path={APP_ROUTES.payments} element={<PaymentsPage />} />
            <Route path={APP_ROUTES.expenses} element={<ExpensesPage />} />
            <Route path={APP_ROUTES.reports} element={<ReportsPage />} />
            <Route
              path={APP_ROUTES.clinicReports}
              element={<ClinicReportsPage />}
            />
          </Route>
        </Route>

        <Route
          path="*"
          element={<Navigate to={APP_ROUTES.dashboard} replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}
