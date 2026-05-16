import { z } from 'zod'

export const noteSchema = z.object({
  appointmentId: z.union([z.number().int().positive(), z.null()]),
  content: z
    .string()
    .trim()
    .min(5, 'Note content must be at least 5 characters')
    .max(5000, 'Note content is too long'),
})

export type NoteFormValues = z.infer<typeof noteSchema>