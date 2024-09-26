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
    status: z.string(),
    plannedOpeningDate: dateSchema.optional().nullable(),
    actualOpeningDate: dateSchema.optional().nullable(),
    plannedClosureDate: dateSchema.optional().nullable(),
    actualClosureDate: dateSchema.optional().nullable(),
    estimatedReopeningDate: dateSchema.optional().nullable(),
    recruitmentTarget: z.string().optional(),
    furtherInformation: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    // Basic date validation for all date fields
    validateAllDates(ctx, values)

    // Status based validation
    // if (values.status === 'Closed to Recruitment, In Follow Up') {
    //   const dateObject = constructDateObjFromParts(values.estimatedReopeningDate)
    //   if (!dateObject) {
    //     ctx.addIssue({
    //       code: z.ZodIssueCode.custom,
    //       message: 'Estimated reopening date required when changing status to Closed, in follow up',
    //       path: ['estimatedReopeningDate'],
    //     })
    //   } else if (dateObject < new Date()) {
    //     ctx.addIssue({
    //       code: z.ZodIssueCode.custom,
    //       message: 'Estimated reopening date is required to be in the future',
    //       path: ['estimatedReopeningDate'],
    //     })
    //   }
    // }
  })

export type EditStudyInputs = z.infer<typeof studySchema>
