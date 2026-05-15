import { TEXTAREA_MAX_CHARACTERS } from '@/constants/forms'
import * as z from 'zod'

const dateSchema = z
  .object({
    day: z.string().trim(),
    month: z.string().trim(),
    year: z.string().trim(),
  })

export const reportFirstSchema = z.object({
  studyId: z
    .string()
    .trim()
    .min(1, 'Select a study'),

  type: z.enum(['global', 'european'], {
    errorMap: () => ({ message: 'Select the type of first' }),
  }),

  firstAt: dateSchema,

  siteName: z
    .string()
    .trim()
    .min(1, 'Enter the site name')
    .max(TEXTAREA_MAX_CHARACTERS, 'Site name must be 500 characters or fewer'),

  piTitle: z
    .string()
    .trim()
    .max(50, 'Title must be 50 characters or fewer')
    .optional()
    .or(z.literal('')),

  piFullName: z
    .string()
    .trim()
    .min(1, 'Enter the principal investigator’s full name')
    .max(500, 'First name must be 500 characters or fewer'),

  piEmail: z
    .string()
    .trim()
    .min(1, 'Enter the principal investigator’s email address')
    .email('Enter an email address in the correct format')
    .max(254, 'Email address must be 254 characters or fewer'),
})

export type ReportFirstInputs = z.infer<typeof reportFirstSchema>