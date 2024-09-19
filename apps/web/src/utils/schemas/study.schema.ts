import * as z from 'zod'

const dateSchema = z.object({
  year: z.string(),
  day: z.string(),
  month: z.string(),
})

export const studySchema = z.object({
  studyId: z.number(),
  cpmsId: z.string(),
  status: z.string().optional(),
  plannedOpeningDate: dateSchema.optional(),
  actualOpeningDate: dateSchema.optional(),
  plannedClosureDate: dateSchema.optional(),
  actualClosureDate: dateSchema.optional(),
  estimatedReopeningDate: dateSchema.optional(),
  recruitmentTarget: z.string().optional(),
  furtherInformation: z.string().optional(),
})

export type EditStudyInputs = z.infer<typeof studySchema>
