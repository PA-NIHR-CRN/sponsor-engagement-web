import dayjs from 'dayjs'
import { z } from 'zod'

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

type DateRestrictions = 'requiredPast' | 'requiredCurrent' | 'requiredFuture'

const dateValidationRules: Record<
  keyof DateFieldName,
  { restrictions: DateRestrictions[]; dependencies: { fieldName: keyof DateFieldName; requiredAfter?: boolean }[] }
> = {
  plannedOpeningDate: { restrictions: [], dependencies: [] },
  actualOpeningDate: { restrictions: ['requiredPast', 'requiredCurrent'], dependencies: [] },
  plannedClosureDate: {
    restrictions: [],
    dependencies: [
      {
        fieldName: 'plannedOpeningDate',
        requiredAfter: true,
      },
      {
        fieldName: 'actualOpeningDate',
        requiredAfter: true,
      },
    ],
  },
  actualClosureDate: { restrictions: ['requiredPast', 'requiredCurrent'], dependencies: [] },
  estimatedReopeningDate: { restrictions: ['requiredFuture'], dependencies: [] },
}

/**
 * Validates a date on the edit study form and sends errors to zod ctx
 */
const validateDate = (fieldName: keyof DateFieldName, ctx: z.RefinementCtx, values: EditStudyInputs) => {
  const value = values[fieldName]
  const label = fieldNameToLabelMapping[fieldName]
  const requiredPast = dateValidationRules[fieldName].restrictions.includes('requiredPast')
  const requiredCurrent = dateValidationRules[fieldName].restrictions.includes('requiredCurrent')
  const requiredFuture = dateValidationRules[fieldName].restrictions.includes('requiredFuture')

  // If there does not exist a single date part, the value will be null
  if (!value) return

  // Basic date validation
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

    // Specific date validation
  } else if (
    (requiredPast &&
      !dayjs(`${value.year}-${value.month.padStart(2, '0')}-${value.day.padStart(2, '0')}`).isBefore(dayjs())) ||
    (requiredCurrent && !dayjs().isSame(dayjs()))
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${label} must be today or in the past`,
      path: [fieldName],
    })
  } else if (
    requiredFuture &&
    !dayjs(`${value.year}-${value.month.padStart(2, '0')}-${value.day.padStart(2, '0')}`).isAfter(dayjs())
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${label} must be in the future`,
      path: [fieldName],
    })

    // Date dependency validation
  } else if (dateValidationRules[fieldName].dependencies.length > 0) {
    dateValidationRules[fieldName].dependencies.forEach((dateDependency) => {
      const { fieldName: dateDependencyFieldName, requiredAfter } = dateDependency

      const dateDependencyValue = values[dateDependencyFieldName]
      const specifiedDateLabel = fieldNameToLabelMapping[dateDependencyFieldName]

      if (
        requiredAfter &&
        dateDependencyValue &&
        !dayjs(`${value.year}-${value.month.padStart(2, '0')}-${value.day.padStart(2, '0')}`).isAfter(
          dayjs(
            `${dateDependencyValue.year}-${dateDependencyValue.month.padStart(
              2,
              '0'
            )}-${dateDependencyValue.day.padStart(2, '0')}`
          )
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
  Object.keys(fieldNameToLabelMapping).forEach((fieldName: keyof DateFieldName) => {
    validateDate(fieldName, ctx, values)
  })
}
