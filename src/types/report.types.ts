export interface ReportDateRangeParams {
  startDate: string
  endDate: string
}

export interface FinancialReport {
  startDate: string
  endDate: string
  totalInvoiced: number
  totalCollected: number
  totalOutstanding: number
  totalExpenses: number
  netProfit: number
  draftInvoices: number
  issuedInvoices: number
  paidInvoices: number
  partiallyPaidInvoices: number
  cancelledInvoices: number
}

export interface AppointmentReport {
  startDate: string
  endDate: string
  totalAppointments: number
  openAppointments: number
  checkedInAppointments: number
  inProgressAppointments: number
  completedAppointments: number
  cancelledAppointments: number
  noShowAppointments: number
  completionRate: number
}

export interface PatientReport {
  startDate: string
  endDate: string
  newPatientsInPeriod: number
  totalActivePatients: number
}

export interface OperationReport {
  startDate: string
  endDate: string
  totalOperations: number
  plannedOperations: number
  inProgressOperations: number
  completedOperations: number
  byOperationType: Record<string, number>
}

export interface ReportsBundle {
  financial: FinancialReport
  appointments: AppointmentReport
  patients: PatientReport
  operations: OperationReport
}

export interface ClinicPaymentReportItem {
  id: number
  doctorId: number
  doctorFullName: string
  patientId: number
  patientFullName: string
  invoiceId: number
  invoiceNumber: string
  amount: number
  paymentMethod: 'CASH' | 'CARD'
  referenceNumber: string | null
  paidAt: string
  notes: string | null
  createdAt: string
}

export interface ClinicExpenseReportItem {
  id: number
  doctorId: number
  doctorFullName: string
  category: string
  description: string | null
  amount: number
  expenseDate: string
  createdAt: string
}

export interface ClinicFinancialReport {
  startDate: string
  endDate: string
  totalCollected: number
  totalExpenses: number
  netProfit: number
  totalAppointments: number
  payments: ClinicPaymentReportItem[]
  expenses: ClinicExpenseReportItem[]
}
