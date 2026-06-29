import { z } from 'zod'

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'First name is required')
      .max(100, 'First name is too long'),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .max(100, 'Last name is too long'),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(50, 'Username is too long'),
    email: z.email('Enter a valid email').max(100, 'Email is too long'),
    role: z.enum(['DOCTOR', 'ADMIN'], 'Choose a role'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password is too long'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
    phone: z.string().max(20, 'Phone is too long').optional(),
    specialization: z
      .string()
      .max(100, 'Specialization is too long')
      .optional(),
    licenseNumber: z
      .string()
      .max(50, 'License number is too long')
      .optional(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type RegisterSchemaValues = z.infer<typeof registerSchema>
