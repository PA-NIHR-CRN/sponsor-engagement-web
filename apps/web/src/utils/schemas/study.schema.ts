import * as z from 'zod'

import { validateAllDates } from '../editStudyForm'

const dateSchema = z.object({
  year: z.string(),
  day: z.string(),
  month: z.string(),
})

export const studySchema = z
  .object({
    studyId: z.number(),
    cpmsId: z.string(),
    originalStatus: z.string().optional().nullable(),
    status: z.string(),
    plannedOpeningDate: dateSchema.optional().nullable(),
    actualOpeningDate: dateSchema.optional().nullable(),
    plannedClosureDate: dateSchema.optional().nullable(),
    actualClosureDate: dateSchema.optional().nullable(),
    estimatedReopeningDate: dateSchema.optional().nullable(),
    recruitmentTarget: z
      .number({ invalid_type_error: 'Enter a valid UK recruitment target' })
      .optional()
      .refine((value) => !(Number(value) < 0 || Number.isNaN(Number(value))), 'Enter a valid UK recruitment target'),
    furtherInformation: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    validateAllDates(ctx, values)
  })

export type EditStudyInputs = z.infer<typeof studySchema>

export type DateFieldName = Pick<
  EditStudyInputs,
  'actualClosureDate' | 'estimatedReopeningDate' | 'plannedClosureDate' | 'plannedOpeningDate' | 'actualOpeningDate'
>
