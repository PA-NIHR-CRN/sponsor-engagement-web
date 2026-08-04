import * as z from 'zod'

export const closureOfStudySchema = z.object({
  studyId: z.string(),
  cpmsId: z.string(),
  status: z.string(),
  actualClosureDate: z
    .object({ day: z.string(), month: z.string(), year: z.string() })
    .optional()
    .nullable(),

  isFinalRecruitmentTotalCorrect: z.enum(['YES', 'NO']).optional(),
  correctedRecruitmentTotal: z
    .string()
    .optional()
    .transform((v) => (v ? v.replace(/\D/g, '') : v)),

  didPerformanceDeliverInline: z.enum(['YES', 'NO']).optional(),

  performanceNoReason: z.string().optional(),
  furtherInformation: z.string().optional(),
})

export type ClosureOfStudy = z.infer<typeof closureOfStudySchema>