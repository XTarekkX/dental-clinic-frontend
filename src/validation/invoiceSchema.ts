import { z } from 'zod'

export const invoiceItemSchema = z.object({
  description: z
    .string()
    .trim()
    .min(2, 'Description must be at least 2 characters')
    .max(255, 'Description is too long'),
  quantity: z
    .number()
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1'),
  unitPrice: z
    .number()
    .positive('Unit price must be greater than zero'),
})

export const invoiceSchema = z.object({
  patientId: z.number().int().positive('Patient is required'),
  appointmentId: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, 'Invoice must have at least one item'),
  discount: z.number().min(0, 'Discount cannot be negative').default(0),
  tax: z.number().min(0, 'Tax cannot be negative').default(0),
  dueDate: z.string().optional(),
  notes: z.string().trim().max(2000, 'Notes are too long').optional(),
})

export const paymentSchema = z.object({
  amount: z.number().positive('Payment amount must be greater than zero'),
  paymentMethod: z.enum(['CASH', 'CARD']),
  referenceNumber: z
    .string()
    .trim()
    .max(120, 'Reference number is too long')
    .optional(),
  paidAt: z.string().optional(),
  notes: z.string().trim().max(2000, 'Notes are too long').optional(),
})

export type InvoiceFormValues = z.input<typeof invoiceSchema>
export type PaymentFormValues = z.infer<typeof paymentSchema>
