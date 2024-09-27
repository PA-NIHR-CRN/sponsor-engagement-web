import dayjs from 'dayjs'
import { z } from 'zod'

import type { DateInputValue } from '@/components/atoms/Form/DateInput/types'
import type { EditStudyProps } from '@/pages/studies/[studyId]/edit'

import { constructDatePartsFromDate } from './date'
import type { DateFieldName, EditStudyInputs } from './schemas'

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

const fieldNameToLabelMapping: Record<keyof DateFieldName, string> = {
  plannedOpeningDate: 'Planned opening to recruitment date',
  actualOpeningDate: 'Actual opening to recruitment date',
  plannedClosureDate: 'Planned closure to recruitment date',
  actualClosureDate: 'Actual closure to recruitment date',
  estimatedReopeningDate: 'Estimated reopening date',
}

/**
 * Validates a date on the edit study form and sends errors to zod ctx
 */
const validateDate = (
  fieldName: keyof DateFieldName,
  ctx: z.RefinementCtx,
  value: DateInputValue | null | undefined,
  requiredPast: boolean,
  requiredCurrent: boolean,
  requiredFuture: boolean,
  requiredAfterSpecifiedDates: { date?: DateInputValue | null; fieldName: keyof DateFieldName }[]
) => {
  // If there does not exist a single date part, the value will be null
  if (!value) return

  const label = fieldNameToLabelMapping[fieldName]

  if (Number(value.day) < 1 || Number(value.day) > 31) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${label} requires a valid day`,
      path: [`${fieldName}-day`],
    })
  } else if (Number(value.month) < 1 || Number(value.month) > 12) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${label} requires a valid month`,
      path: [`${fieldName}-month`],
    })
  } else if (value.year.length !== 4) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${label} requires a valid year`,
      path: [`${fieldName}-year`],
    })
  } else if (
    (requiredPast &&
      dayjs(`${value.year}-${value.month.padStart(2, '0')}-${value.day.padStart(2, '0')}`).isAfter(dayjs())) ||
    (requiredCurrent && !dayjs().isSame(dayjs()))
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${label} must be today or in the past`,
      path: [fieldName],
    })
  } else if (
    requiredFuture &&
    dayjs(`${value.year}-${value.month.padStart(2, '0')}-${value.day.padStart(2, '0')}`).isBefore(dayjs())
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${label} must be in the future`,
      path: [fieldName],
    })
  } else if (requiredAfterSpecifiedDates.length > 0) {
    requiredAfterSpecifiedDates.forEach((specifiedDate) => {
      const { date, fieldName: specifiedDateFieldName } = specifiedDate

      const specifiedDateLabel = fieldNameToLabelMapping[specifiedDateFieldName]

      if (
        date &&
        !dayjs(`${value.year}-${value.month.padStart(2, '0')}-${value.day.padStart(2, '0')}`).isAfter(
          dayjs(`${date.year}-${date.month.padStart(2, '0')}-${date.day.padStart(2, '0')}`)
        )
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${label} must be after ${specifiedDateLabel}`,
          path: [fieldName],
        })

        z.NEVER
      }
    })
  }
}

/**
 * Validates all dates on the edit study form and sends errors to zod ctx
 */
export const validateAllDates = (ctx: z.RefinementCtx, values: EditStudyInputs) => {
  // Planned opening to recruitment date
  const plannedOpeningDate = values.plannedOpeningDate
  validateDate('plannedOpeningDate', ctx, plannedOpeningDate, false, false, false, [])

  // Actual opening to recruitment date
  const actualOpeningDate = values.actualOpeningDate
  validateDate('actualOpeningDate', ctx, actualOpeningDate, true, true, false, [])

  // Planned closure to recruitment date
  const plannedClosureDate = values.plannedClosureDate
  validateDate('plannedClosureDate', ctx, plannedClosureDate, false, false, false, [
    {
      fieldName: 'plannedClosureDate',
      date: values.plannedOpeningDate,
    },
    {
      fieldName: 'actualOpeningDate',
      date: values.actualOpeningDate,
    },
  ])

  // Actual closure to recruitment date
  const actualClosureDate = values.actualClosureDate
  validateDate('actualClosureDate', ctx, actualClosureDate, true, true, false, [])

  // Estimate reopening to recruitment date
  const estimatedReopeningDate = values.estimatedReopeningDate
  validateDate('estimatedReopeningDate', ctx, estimatedReopeningDate, false, false, true, [])
}
