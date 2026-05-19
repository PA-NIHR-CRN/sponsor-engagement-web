import * as z from 'zod'

import { TEXTAREA_MAX_CHARACTERS } from '@/constants/forms'

const requiredDate = z
  .object({
    day: z.string().trim().min(1, 'Enter a day'),
    month: z.string().trim().min(1, 'Enter a month'),
    year: z.string().trim().min(1, 'Enter a year'),
  })
  .superRefine((val, ctx) => {
    if (!val.day || !val.month || !val.year) return

    const d = Number(val.day)
    const m = Number(val.month)
    const y = Number(val.year)

    if (!Number.isInteger(d) || !Number.isInteger(m) || !Number.isInteger(y)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter a valid date',
        path: [],
      })
      return
    }

    if (val.year.length !== 4) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Year must be 4 digits',
        path: ['year'],
      })
      return
    }

    const date = new Date(y, m - 1, d)
    const valid =
      date.getFullYear() === y &&
      date.getMonth() === m - 1 &&
      date.getDate() === d

    if (!valid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter a valid date',
        path: [],
      })
    }
  })


export const reportFirstSchema = z.object({
  studyId: z
    .string()
    .trim()
    .min(1, 'Select a study'),

  type: z.enum(['global', 'european'], {
    errorMap: () => ({ message: 'Select the type of first' }),
  }),

  firstAt: requiredDate,

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
    .max(100, 'Full name must be 100 characters or fewer'),

  piEmail: z
    .string()
    .trim()
    .min(1, 'Enter the principal investigator’s email address')
    .email('Enter an email address in the correct format')
    .max(254, 'Email address must be 254 characters or fewer'),
})

export type ReportFirstInputs = z.infer<typeof reportFirstSchema>