import * as z from 'zod'

const dateSchema = z.object({
  year: z.string(),
  day: z.string(),
  month: z.string(),
})

export const studySchema = z.object({
  seId: z.number(),
  cpmsStudyId: z.string(),
  status: z.string().optional(),
  plannedOpeningDate: dateSchema.optional(),
  actualOpeningDate: dateSchema.optional(),
  plannedClosureDate: dateSchema.optional(),
  actualClosureDate: dateSchema.optional(),
  recruitmentTarget: z.number().optional(),
  furtherInformation: z.string().optional(),
})

export type EditStudyInputs = z.infer<typeof studySchema>
