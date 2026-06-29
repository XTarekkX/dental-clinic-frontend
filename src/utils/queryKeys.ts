export const queryKeys = {
  dashboard: {
    stats: ['dashboard', 'stats'] as const,
  },
  patients: {
    all: ['patients'] as const,
    list: (page: number, size: number, search: string) =>
      ['patients', 'list', page, size, search] as const,
    detail: (id: number) => ['patients', 'detail', id] as const,
    appointments: (id: number) => ['patients', 'appointments', id] as const,
    notes: (id: number) => ['patients', 'notes', id] as const,
    operations: (id: number) => ['patients', 'operations', id] as const,
  },
  appointments: {
    all: ['appointments'] as const,
    calendar: (start: string, end: string) =>
      ['appointments', 'calendar', start, end] as const,
    detail: (id: number) => ['appointments', 'detail', id] as const,
  },
  invoices: {
    all: ['invoices'] as const,
    list: (page: number, size: number, status: string) =>
      ['invoices', 'list', page, size, status] as const,
    detail: (id: number) => ['invoices', 'detail', id] as const,
    payments: (id: number) => ['invoices', 'payments', id] as const,
  },
  payments: {
    all: ['payments'] as const,
    patient: (id: number) => ['payments', 'patient', id] as const,
  },
  expenses: {
    all: ['expenses'] as const,
    list: (
      doctorId: number,
      startDate: string,
      endDate: string,
      page: number,
      size: number,
    ) => ['expenses', 'list', doctorId, startDate, endDate, page, size] as const,
  },
  reports: {
    all: ['reports'] as const,
    bundle: (startDate: string, endDate: string) =>
      ['reports', 'bundle', startDate, endDate] as const,
    clinicFinancial: (startDate: string, endDate: string) =>
      ['reports', 'clinic-financial', startDate, endDate] as const,
  },
}
