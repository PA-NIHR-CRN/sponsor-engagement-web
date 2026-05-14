import { TEXTAREA_MAX_CHARACTERS } from '@/constants/forms'
import * as z from 'zod'

const dateSchema = z
  .object({
    day: z.string().trim(),
    month: z.string().trim(),
    year: z.string().trim(),
  })
  .superRefine((val, ctx) => {
    const hasAny = val.day || val.month || val.year
    const hasAll = val.day && val.month && val.year

    if (!hasAny) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [],
        message: 'Enter the date of the first participant',
      })
      return
    }

    if (!hasAll) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [],
        message: 'Enter a complete date (day, month and year)',
      })
      return
    }

    const day = Number(val.day)
    const month = Number(val.month)
    const year = Number(val.year)

    if (![day, month, year].every(Number.isInteger)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [],
        message: 'Enter a real date',
      })
      return
    }

    const d = new Date(year, month - 1, day)
    const isRealDate =
      d.getFullYear() === year &&
      d.getMonth() === month - 1 &&
      d.getDate() === day

    if (!isRealDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [],
        message: 'Enter a real date',
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

  piFirstName: z
    .string()
    .trim()
    .min(1, 'Enter the principal investigator’s first name')
    .max(100, 'First name must be 100 characters or fewer'),

  piLastName: z
    .string()
    .trim()
    .min(1, 'Enter the principal investigator’s last name')
    .max(100, 'Last name must be 100 characters or fewer'),

  piEmail: z
    .string()
    .trim()
    .min(1, 'Enter the principal investigator’s email address')
    .email('Enter an email address in the correct format')
    .max(254, 'Email address must be 254 characters or fewer'),
})

export type ReportFirstInputs = z.infer<typeof reportFirstSchema>