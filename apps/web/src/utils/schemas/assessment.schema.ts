import * as z from 'zod'
import { TEXTAREA_MAX_CHARACTERS } from '@/constants/forms'

export const assessmentSchema = z
  .object({
    studyId: z.string(),

    studyHasNotRecruitedWithinSixMonths: z.enum(['true', 'false']).default('false'),

    status: z.string().optional().nullable(),

    furtherInformation: z.union([z.array(z.string()), z.boolean()]).optional(),

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
    if (!data.status) {
      ctx.addIssue({
        path: ['status'],
        code: z.ZodIssueCode.custom,
        message: 'Select how the study is progressing',
      })
    }

    if (data.studyHasNotRecruitedWithinSixMonths === 'true') {
      const reason = data.reasonForNoRecruitment?.trim()
      if (!reason) {
        ctx.addIssue({
          path: ['reasonForNoRecruitment'],
          code: z.ZodIssueCode.custom,
          message: 'Please provide a reason for no recruitment',
        })
      }
    }
  })

export type AssessmentInputs = z.infer<typeof assessmentSchema>