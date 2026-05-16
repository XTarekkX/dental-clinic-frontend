import { z } from 'zod'

export const editNoteSchema = z.object({
  content: z
    .string()
    .trim()
    .min(5, 'Note content must be at least 5 characters')
    .max(5000, 'Note content is too long'),
})

export type EditNoteFormValues = z.infer<typeof editNoteSchema>