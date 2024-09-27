import { z } from 'zod'

import type { DateInputValue } from '@/components/atoms/Form/DateInput/types'
import type { EditStudyProps } from '@/pages/studies/[studyId]/edit'

import { constructDatePartsFromDate } from './date'
import type { EditStudyInputs } from './schemas'

export const mapStudyToStudyFormInput = (study: EditStudyProps['study']): EditStudyInputs => ({
  studyId: study.id,
  status: study.studyStatus,
  recruitmentTarget: study.sampleSize?.toString() ?? undefined,
  cpmsId: study.cpmsId.toString(),
  plannedOpeningDate: constructDatePartsFromDate(study.plannedOpeningDate),
  plannedClosureDate: constructDatePartsFromDate(study.plannedClosureDate),
  actualOpeningDate: constructDatePartsFromDate(study.actualOpeningDate),
  actualClosureDate: constructDatePartsFromDate(study.actualClosureDate),
  estimatedReopeningDate: constructDatePartsFromDate(study.estimatedReopeningDate),
  furtherInformation: '', // TODO: is there a field for this
})

/**
 * Validates a date on the edit study form and sends errors to zod ctx
 */
const validateDate = (fieldName: string, label: string, ctx: z.RefinementCtx, value?: DateInputValue | null) => {
  // If there does not exist a single date part, the value will be null
  if (!value) return

  if (Number(value.day) < 1 || Number(value.day) > 31) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${label} requires a valid day`,
      path: [`${fieldName}-day`],
    })
  }

  if (Number(value.month) < 1 || Number(value.month) > 12) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${label} requires a valid month`,
      path: [`${fieldName}-month`],
    })
  }

  if (value.year.length !== 4) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${label} requires a valid year`,
      path: [`${fieldName}-year`],
    })
  }
}

/**
 * Validates all dates on the edit study form and sends errors to zod ctx
 */
export const validateAllDates = (ctx: z.RefinementCtx, values: EditStudyInputs) => {
  // Planned opening to recruitment date
  const plannedOpeningDate = values.plannedOpeningDate
  validateDate('plannedOpeningDate', 'Planned opening date', ctx, plannedOpeningDate)

  // Actual opening to recruitment date
  const actualOpeningDate = values.actualOpeningDate
  validateDate('actualOpeningDate', 'Actual opening date', ctx, actualOpeningDate)

  // Planned closure to recruitment date
  const plannedClosureDate = values.plannedClosureDate
  validateDate('plannedClosureDate', 'Planned closure date', ctx, plannedClosureDate)

  // Actual closure to recruitment date
  const actualClosureDate = values.actualClosureDate
  validateDate('actualClosureDate', 'Actual closure date', ctx, actualClosureDate)

  // Estimate reopening to recruitment date
  const estimatedReopeningDate = values.estimatedReopeningDate
  validateDate('estimatedReopeningDate', 'Estimated reopening date', ctx, estimatedReopeningDate)
}
