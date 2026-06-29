import { z } from 'zod'

export const expenseSchema = z.object({
  category: z
    .string()
    .trim()
    .min(2, 'Category must be at least 2 characters')
    .max(100, 'Category is too long'),
  description: z.string().trim().max(2000, 'Description is too long').optional(),
  amount: z.number().positive('Amount must be greater than zero'),
  expenseDate: z.string().min(1, 'Expense date is required'),
})

export type ExpenseFormValues = z.infer<typeof expenseSchema>
