import * as z from 'zod'
import { PASSWORD_MIN_LENGTH } from '../../constants'

export type RegistrationInputs = z.infer<typeof registrationSchema>

export const registrationSchema = z
  .object({
    registrationToken: z.string(),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, { message: 'Enter a minimum of 12 characters' })
      .refine((value) => !value.includes('#'), { message: 'Must not contain the # character' }),
    confirmPassword: z
      .string()
      .min(PASSWORD_MIN_LENGTH, { message: 'Enter a minimum of 12 characters' })
      .refine((value) => !value.includes('#'), { message: 'Must not contain the # character' }),
  })
  .required()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['confirmPassword'],
      })
    }
  })
