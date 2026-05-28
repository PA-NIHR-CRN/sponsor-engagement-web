import * as z from 'zod'
import { TEXTAREA_MAX_CHARACTERS } from '@/constants/forms'

export const buildAssessmentSchema = (studyHasNotRecruitedWithinSixMonths: boolean) =>
  z.object({
    studyId: z.string(),

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

    reasonForNoRecruitment: studyHasNotRecruitedWithinSixMonths
      ? z
        .string()
        .trim()
        .min(1, 'Please provide a reason for no recruitment')
        .max(
          TEXTAREA_MAX_CHARACTERS,
          `Please provide reasoning for no recruitment with less than the maximum of ${TEXTAREA_MAX_CHARACTERS} characters`,
        )
      : z
        .string()
        .max(
          TEXTAREA_MAX_CHARACTERS,
          `Please provide reasoning for no recruitment with less than the maximum of ${TEXTAREA_MAX_CHARACTERS} characters`,
        )
        .optional(),
  })

export type AssessmentInputs = z.infer<ReturnType<typeof buildAssessmentSchema>>