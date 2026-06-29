import { z } from 'zod'

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .max(100, 'Username is too long'),
  password: z
    .string()
    .min(1, 'Password is required')
    .max(100, 'Password is too long'),
  rememberMe: z.boolean(),
})

export type LoginSchemaValues = z.infer<typeof loginSchema>
