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
}