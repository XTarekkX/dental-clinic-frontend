const PROD_API_BASE_URL = 'https://dental-clinic-api-99jz.onrender.com'

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? 'http://localhost:8080' : PROD_API_BASE_URL)

export const API_ENDPOINTS = {
  auth: {
    login: '/api/v1/auth/login',
    refresh: '/api/v1/auth/refresh',
    logout: '/api/v1/auth/logout',
    me: '/api/v1/auth/me',
  },
} as const

export const APP_ROUTES = {
  login: '/login',
  dashboard: '/',
  patients: '/patients',
  patientDetail: '/patients/:id',
  appointments: '/appointments',
  invoices: '/invoices',
  payments: '/payments',
  expenses: '/expenses',
  reports: '/reports',
  clinicReports: '/clinic-reports',
} as const
