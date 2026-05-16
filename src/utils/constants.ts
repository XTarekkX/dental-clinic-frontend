export const API_BASE_URL = 'http://localhost:8080'

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
} as const