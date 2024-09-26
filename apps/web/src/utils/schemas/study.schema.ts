import * as z from 'zod'

const dateSchema = (fieldName: string) =>
  z.object({
    year: z.string().refine((arg) => !(Number(arg) < 1950), `${fieldName} requires a valid year`),
    day: z.string().refine((arg) => !(Number(arg) < 1 || Number(arg) > 31), `${fieldName} requires a valid day`),
    month: z.string().refine((arg) => !(Number(arg) < 1 || Number(arg) > 12), `${fieldName} requires a valid month`),
  })

export const studySchema = z.object({
  studyId: z.number(),
  cpmsId: z.string(),
  status: z.string(),
  plannedOpeningDate: dateSchema('Planned opening to recruitment date').optional(),
  actualOpeningDate: dateSchema('Actual opening to recruitment date').optional(),
  plannedClosureDate: dateSchema('Planned closure to recruitment date').optional(),
  actualClosureDate: dateSchema('Actual closure to recruitment date').optional(),
  estimatedReopeningDate: dateSchema('Estimate reopening date').optional(),
  recruitmentTarget: z.string().optional(),
  furtherInformation: z.string().optional(),
})

export type EditStudyInputs = z.infer<typeof studySchema>
