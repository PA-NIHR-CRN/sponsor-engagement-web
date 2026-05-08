import * as z from 'zod'

export const configureSchema = z
  .object({
    studyId: z.string(),

    status: z.enum(['true', 'false'], {
      errorMap: () => ({
        message: 'Select if you expect to achieve the first participant in this timeline',
      }),
    }),

    noReason: z.string().max(500).nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.status === 'false' && !data.noReason?.trim()) {
      ctx.addIssue({
        path: ['noReason'],
        message: 'Please explain why you do not expect to achieve this timeline',
        code: z.ZodIssueCode.custom,
      })
    }
  })

export type ConfigureInputs = z.infer<typeof configureSchema>