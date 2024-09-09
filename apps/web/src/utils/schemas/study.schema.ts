import * as z from 'zod'

export type StudyInputs = z.infer<typeof studySchema>

const dateSchema = z.object({
  year: z.string(),
  day: z.string(),
  month: z.string(),
})

export const studySchema = z.object({
  studyId: z.string(),
  status: z.string().optional(),
  plannedOpeningDate: dateSchema.optional(),
  actualOpeningDate: dateSchema.optional(),
  plannedClosureDate: dateSchema.optional(),
  actualClosureDate: dateSchema.optional(),
  recruitmentTarget: z.number().optional(),
  furtherInformation: z.string().optional(),
})
