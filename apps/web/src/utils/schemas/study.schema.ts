import * as z from 'zod'

import { UK_RECRUITMENT_TARGET_MAX_VALUE } from '@/constants/editStudyForm'

import { validateAllDates, validateStatus } from '../editStudyForm'

const dateSchema = z
  .object({
    year: z.string(),
    day: z.string(),
    month: z.string(),
  })
  .optional()
  .nullable()

export const studySchema = z
  .object({
    studyId: z.string(),
    cpmsId: z.string(),
    status: z.string(),
    LSN: z.string().optional().nullable(),
    plannedOpeningDate: dateSchema,
    actualOpeningDate: dateSchema,
    plannedClosureDate: dateSchema,
    actualClosureDate: dateSchema,
    estimatedReopeningDate: dateSchema,
    recruitmentTarget: z
      .string()
      .min(1, 'UK target is a mandatory field')
      .refine(
        (value) =>
          !(Number(value) < 0 || Number.isNaN(Number(value)) || Number(value) > UK_RECRUITMENT_TARGET_MAX_VALUE),
        'Enter a valid UK target'
      ),
    furtherInformation: z.string().optional(),
    originalValues: z
      .object({
        status: z.string(),
        plannedOpeningDate: dateSchema,
        actualOpeningDate: dateSchema,
        plannedClosureDate: dateSchema,
        actualClosureDate: dateSchema,
        estimatedReopeningDate: dateSchema,
        recruitmentTarget: z.string().optional(),
        furtherInformation: z.string().optional(),
      })
      .optional(),
  })
  .superRefine((values, ctx) => {
    validateAllDates(ctx, values)

    validateStatus(ctx, values)
  })

export const studySchemaShape = studySchema.sourceType()._def.shape()

export type EditStudy = z.infer<typeof studySchema>

export type EditStudyInputs = Omit<EditStudy, 'originalValues'>

export type DateFieldName = Pick<
  EditStudyInputs,
  'actualClosureDate' | 'estimatedReopeningDate' | 'plannedClosureDate' | 'plannedOpeningDate' | 'actualOpeningDate'
>
