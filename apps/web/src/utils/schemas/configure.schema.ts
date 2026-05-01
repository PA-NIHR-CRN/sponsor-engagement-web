import * as z from 'zod'

export type ConfigureInputs = z.infer<typeof configureSchema>

export const configureSchema = z
  .object({
    studyId: z.string(),

    status: z.string({
      errorMap: () => ({
        message: 'Select if you expect to achieve the first participant in this timeline',
      }),
    }),

  })
  .required()
