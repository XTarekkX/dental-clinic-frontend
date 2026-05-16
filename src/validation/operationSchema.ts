import { z } from 'zod'

export const operationSchema = z.object({
  operationType: z
    .string()
    .trim()
    .min(2, 'Operation type must be at least 2 characters')
    .max(150, 'Operation type is too long'),

  dentalProblem: z
    .string()
    .trim()
    .min(3, 'Dental problem must be at least 3 characters')
    .max(1000, 'Dental problem is too long'),

  treatmentPlan: z
    .string()
    .trim()
    .min(3, 'Treatment plan must be at least 3 characters')
    .max(2000, 'Treatment plan is too long'),

  toothNumber: z
    .string()
    .trim()
    .max(20, 'Tooth number is too long')
    .optional()
    .or(z.literal('')),

  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED']),

  notes: z
    .string()
    .trim()
    .max(2000, 'Notes are too long')
    .optional()
    .or(z.literal('')),
  
  appointmentId: z.string().optional(),
})

export type OperationFormValues = z.infer<typeof operationSchema>