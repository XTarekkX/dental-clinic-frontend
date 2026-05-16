import { z } from 'zod'
import { appointmentSchema } from './appointmentSchema'

export const calendarAppointmentSchema = appointmentSchema.extend({
  patientId: z
    .number()
    .int()
    .positive('Patient is required'),
})

export type CalendarAppointmentFormValues = z.infer<
  typeof calendarAppointmentSchema
>