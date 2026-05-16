import { z } from 'zod'

export const patientSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters')
    .max(100, 'First name is too long'),

  lastName: z
    .string()
    .trim()
    .min(2, 'Last name must be at least 2 characters')
    .max(100, 'Last name is too long'),

  dateOfBirth: z.string().min(1, 'Date of birth is required'),

  gender: z.enum(['MALE', 'FEMALE']),

  phone: z
    .string()
    .trim()
    .min(6, 'Phone number is too short')
    .max(30, 'Phone number is too long'),

  email: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .max(150, 'Email is too long'),

  address: z
    .string()
    .trim()
    .max(255, 'Address is too long'),

  bloodType: z.string().trim().max(10, 'Blood type is too long'),

  allergies: z.string().trim().max(500, 'Allergies text is too long'),

  emergencyContact: z
    .string()
    .trim()
    .max(100, 'Emergency contact is too long'),

  emergencyPhone: z
    .string()
    .trim()
    .max(30, 'Emergency phone is too long'),
})

export type PatientFormValues = z.infer<typeof patientSchema>