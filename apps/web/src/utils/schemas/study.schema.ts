import * as z from 'zod'

export type StudyInputs = z.infer<typeof studySchema>

export const studySchema = z.object({
  studyId: z.string(),
  status: z.string().optional(),
  plannedOpeningDate: z.coerce.date().optional(),
  actualOpeningDate: z.coerce.date().optional(),
  plannedClosureToRecruitmentDate: z.coerce.date().optional(),
  actualClosureToRecruitmentDate: z.coerce.date().optional(),
  recruitmentTarget: z.number().optional(),
  furtherInformation: z.string().optional(),
})
