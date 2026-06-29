import {
  LayoutDashboard,
  Users,
  CalendarDays,
  FileText,
  CreditCard,
  Wallet,
  BarChart3,
} from 'lucide-react'
import type { ComponentType } from 'react'
import { APP_ROUTES } from '../../utils/constants'
import type { Role } from '../../types/auth.types'

interface NavigationItem {
  label: string
  path: string
  icon: ComponentType<{ className?: string }>
  roles?: Role[]
}

export const navigationItems: NavigationItem[] = [
  {
    label: 'Dashboard',
    path: APP_ROUTES.dashboard,
    icon: LayoutDashboard,
  },
  {
    label: 'Patients',
    path: APP_ROUTES.patients,
    icon: Users,
  },
  {
    label: 'Calendar',
    path: APP_ROUTES.appointments,
    icon: CalendarDays,
  },
  {
    label: 'Invoices',
    path: APP_ROUTES.invoices,
    icon: FileText,
  },
  {
    label: 'Payments',
    path: APP_ROUTES.payments,
    icon: CreditCard,
  },
  {
    label: 'Expenses',
    path: APP_ROUTES.expenses,
    icon: Wallet,
  },
  {
    label: 'Reports',
    path: APP_ROUTES.reports,
    icon: BarChart3,
  },
  {
    label: 'Clinic Reports',
    path: APP_ROUTES.clinicReports,
    icon: BarChart3,
    roles: ['ADMIN'],
  },
] as const
