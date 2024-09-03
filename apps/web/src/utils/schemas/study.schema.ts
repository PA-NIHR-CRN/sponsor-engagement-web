import * as z from 'zod'

import { TEXTAREA_MAX_CHARACTERS } from '@/constants/forms'

export type StudyInputs = z.infer<typeof studySchema>

const dateSchema = z
  .object({
    year: z.string().length(4),
    day: z.string().length(2),
    month: z.string().length(2),
  })
  .optional()

export const studySchema = z.object({
  studyId: z.string(),
  status: z.string().optional(),
  plannedOpeningDate: dateSchema,
  actualOpeningDate: dateSchema,
  plannedClosureToRecruitmentDate: dateSchema,
  actualClosureToRecruitmentDate: dateSchema,
  recruitmentTarget: z.number().optional(),
  furtherInformation: z
    .string()
    .optional()
    .refine((val) => {
      return (
        val && val.split(' ').length >= TEXTAREA_MAX_CHARACTERS,
        {
          message: `Please provide further information with less than the maximum of ${TEXTAREA_MAX_CHARACTERS} characters`,
        }
      )
    }),
})
