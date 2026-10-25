import { z } from 'zod'
import { appointmentReasons } from '../utils/appointmentReasons'

export const appointmentSchema = z.object({
  scheduledAt: z.string().min(1, 'Appointment date and time is required'),
  durationMinutes: z
    .number()
    .int()
    .min(5, 'Duration must be at least 5 minutes')
    .max(240, 'Duration cannot exceed 240 minutes'),
  reason: z.string().refine(
    (value) =>
      appointmentReasons.includes(
        value as (typeof appointmentReasons)[number],
      ),
    'Reason is required',
  ),
})

export type AppointmentFormValues = z.infer<typeof appointmentSchema>
