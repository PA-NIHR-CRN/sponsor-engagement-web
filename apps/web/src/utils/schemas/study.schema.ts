import * as z from 'zod'

import { UK_RECRUITMENT_TARGET_MAX_VALUE } from '@/constants/editStudyForm'

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
      .number({ invalid_type_error: 'Enter a valid UK target' })
      .optional()
      .refine(
        (value) =>
          !(Number(value) < 0 || Number.isNaN(Number(value)) || Number(value) > UK_RECRUITMENT_TARGET_MAX_VALUE),
        'Enter a valid UK target'
      ),
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
