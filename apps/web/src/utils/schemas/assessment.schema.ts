import * as z from 'zod'
import { TEXTAREA_MAX_CHARACTERS } from '@/constants/forms'

export const assessmentSchema = z
  .object({
    studyId: z.string(),

    studyHasNotRecruitedWithinSixMonths: z.enum(['true', 'false']).default('false'),

    status: z.string({
      errorMap: () => ({ message: 'Select how the study is progressing' }),
    }),

    furtherInformation: z
      .string({
        errorMap: () => ({ message: 'Select any additional further information' }),
      })
      .array()
      .nonempty()
      .or(z.boolean()),

    furtherInformationText: z
      .string()
      .max(
        TEXTAREA_MAX_CHARACTERS,
        `Please provide further information with less than the maximum of ${TEXTAREA_MAX_CHARACTERS} characters`,
      )
      .optional(),

    reasonForNoRecruitment: z
      .string()
      .max(TEXTAREA_MAX_CHARACTERS, `Must be ${TEXTAREA_MAX_CHARACTERS} characters or less`)
      .optional()
      .nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.studyHasNotRecruitedWithinSixMonths !== 'true') return

    const reason = data.reasonForNoRecruitment?.trim()

    if (!reason) {
      ctx.addIssue({
        path: ['reasonForNoRecruitment'],
        message: 'Please provide a reason for no recruitment',
        code: z.ZodIssueCode.custom,
      })
      return
    }

    if (reason.length > TEXTAREA_MAX_CHARACTERS) {
      ctx.addIssue({
        path: ['reasonForNoRecruitment'],
        message: `Must be ${TEXTAREA_MAX_CHARACTERS} characters or less`,
        code: z.ZodIssueCode.custom,
      })
    }
  })

export type AssessmentInputs = z.infer<typeof assessmentSchema>