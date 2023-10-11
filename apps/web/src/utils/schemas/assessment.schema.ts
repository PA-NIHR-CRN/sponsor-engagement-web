import * as z from 'zod'
import { TEXTAREA_MAX_CHARACTERS } from '../../constants/forms'

export type AssessmentInputs = z.infer<typeof assessmentSchema>

export const assessmentSchema = z
  .object({
    studyId: z.string(),

    status: z.string({
      errorMap: () => ({
        message: 'Select how the study is progressing',
      }),
    }),

    furtherInformation: z
      .string({
        errorMap: () => ({
          message: 'Select any additional further information',
        }),
      })
      .array()
      .nonempty(),

    furtherInformationText: z
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
  .required()
