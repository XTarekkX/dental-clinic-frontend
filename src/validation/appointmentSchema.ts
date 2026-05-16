import { z } from 'zod'

export const appointmentSchema = z.object({
  scheduledAt: z.string().min(1, 'Appointment date and time is required'),
  durationMinutes: z
    .number()
    .int()
    .min(5, 'Duration must be at least 5 minutes')
    .max(240, 'Duration cannot exceed 240 minutes'),
  reason: z
    .string()
    .trim()
    .min(3, 'Reason must be at least 3 characters')
    .max(500, 'Reason is too long'),
})

export type AppointmentFormValues = z.infer<typeof appointmentSchema>