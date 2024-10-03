import dayjs from 'dayjs'
import { z } from 'zod'

import { dateValidationRules, fieldNameToLabelMapping, FormStudyStatus } from '@/constants/editStudyForm'
import { mapCPMSStatusToFormStatus } from '@/lib/studies'
import type { EditStudyProps } from '@/pages/studies/[studyId]/edit'

import { constructDatePartsFromDate } from './date'
import type { DateFieldName, EditStudyInputs } from './schemas'

export const mapStudyToStudyFormInput = (study: EditStudyProps['study']): EditStudyInputs => ({
  studyId: study.id,
  status: study.studyStatus,
  originalStatus: study.studyStatus,
  recruitmentTarget: study.sampleSize ?? undefined,
  cpmsId: study.cpmsId.toString(),
  plannedOpeningDate: constructDatePartsFromDate(study.plannedOpeningDate),
  plannedClosureDate: constructDatePartsFromDate(study.plannedClosureDate),
  actualOpeningDate: constructDatePartsFromDate(study.actualOpeningDate),
  actualClosureDate: constructDatePartsFromDate(study.actualClosureDate),
  estimatedReopeningDate: constructDatePartsFromDate(study.estimatedReopeningDate),
  furtherInformation: '', // TODO: is there a field for this
})

/**
 * Gets mandatory date fields based on current and previous status
 */
const getMandatoryDateFields = (previousStatus: string | null, newStatus: string) => {
  const mandatoryDateFieldsByStatus: Record<FormStudyStatus, (keyof DateFieldName)[]> = {
    [FormStudyStatus.InSetup]: ['plannedOpeningDate', 'plannedClosureDate'],
    [FormStudyStatus.OpenToRecruitment]: ['plannedOpeningDate', 'actualOpeningDate', 'plannedClosureDate'],
    [FormStudyStatus.Suspended]: [
      'plannedOpeningDate',
      'actualOpeningDate',
      'plannedClosureDate',
      'estimatedReopeningDate',
    ],
    [FormStudyStatus.Withdrawn]: ['plannedOpeningDate', 'plannedClosureDate'],
    [FormStudyStatus.Closed]: ['plannedOpeningDate', 'actualOpeningDate', 'plannedClosureDate', 'actualClosureDate'],
    [FormStudyStatus.ClosedFollowUp]: [
      'plannedOpeningDate',
      'actualOpeningDate',
      'plannedClosureDate',
      'actualClosureDate',
    ],
  }

  const mandatoryDates = (mandatoryDateFieldsByStatus[newStatus] || []) as (keyof DateFieldName)[]

  // Exceptions - there are a small amount of scenarios that relies on the previous status
  if (
    (previousStatus === (FormStudyStatus.InSetup as string) && newStatus === (FormStudyStatus.Suspended as string)) ||
    (previousStatus === (FormStudyStatus.Suspended as string) &&
      newStatus === (FormStudyStatus.OpenToRecruitment as string))
  ) {
    return mandatoryDates.filter((value) => value !== 'actualOpeningDate')
  }

  return mandatoryDates
}

/**
 * Mapping to see which form fields are visible based on status
 */

export const getVisibleFormFields = (
  previousStatus: string,
  newStatus: string
): [(keyof DateFieldName)[], FormStudyStatus[]] => {
  const visibleDateFieldsMapping: Record<FormStudyStatus, (keyof DateFieldName)[]> = {
    [FormStudyStatus.InSetup]: ['plannedOpeningDate', 'plannedClosureDate'],
    [FormStudyStatus.OpenToRecruitment]: ['plannedOpeningDate', 'actualOpeningDate', 'plannedClosureDate'],
    [FormStudyStatus.Suspended]: [
      'plannedOpeningDate',
      'actualOpeningDate',
      'plannedClosureDate',
      'estimatedReopeningDate',
    ],
    [FormStudyStatus.Closed]: ['plannedOpeningDate', 'actualOpeningDate', 'plannedClosureDate', 'actualClosureDate'],
    [FormStudyStatus.ClosedFollowUp]: [
      'plannedOpeningDate',
      'actualOpeningDate',
      'plannedClosureDate',
      'actualClosureDate',
    ],
    [FormStudyStatus.Withdrawn]: ['plannedOpeningDate', 'plannedClosureDate'],
  }

  const visibleStatusesMapping: Record<FormStudyStatus, FormStudyStatus[]> = {
    [FormStudyStatus.InSetup]: [
      FormStudyStatus.InSetup,
      FormStudyStatus.OpenToRecruitment,
      FormStudyStatus.Closed,
      FormStudyStatus.ClosedFollowUp,
      FormStudyStatus.Withdrawn,
      FormStudyStatus.Suspended,
    ],
    [FormStudyStatus.OpenToRecruitment]: [
      FormStudyStatus.OpenToRecruitment,
      FormStudyStatus.Closed,
      FormStudyStatus.ClosedFollowUp,
      FormStudyStatus.Suspended,
    ],
    [FormStudyStatus.Suspended]: [
      FormStudyStatus.OpenToRecruitment,
      FormStudyStatus.Closed,
      FormStudyStatus.ClosedFollowUp,
      FormStudyStatus.Suspended,
    ],
    [FormStudyStatus.Closed]: [FormStudyStatus.Closed],
    [FormStudyStatus.ClosedFollowUp]: [FormStudyStatus.ClosedFollowUp],
    [FormStudyStatus.Withdrawn]: [FormStudyStatus.Withdrawn],
  }

  return [visibleDateFieldsMapping[newStatus] || [], visibleStatusesMapping[previousStatus] || []]
}

/**
 * Validates a date on the edit study form and sends errors to zod ctx
 */
const validateDate = (fieldName: keyof DateFieldName, ctx: z.RefinementCtx, values: EditStudyInputs) => {
  const value = values[fieldName]
  const currentStatus = mapCPMSStatusToFormStatus(values.status)
  const previousStatus = values.originalStatus ? mapCPMSStatusToFormStatus(values.originalStatus) : null
  const label = fieldNameToLabelMapping[fieldName]
  const requiredPast = dateValidationRules[fieldName].restrictions.includes('requiredPast')
  const requiredCurrent = dateValidationRules[fieldName].restrictions.includes('requiredCurrent')
  const requiredFuture = dateValidationRules[fieldName].restrictions.includes('requiredFuture')

  if (!value) {
    // Status based validation
    if (getMandatoryDateFields(previousStatus, currentStatus).includes(fieldName)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${fieldNameToLabelMapping[fieldName]} is a mandatory field`,
        path: [fieldName],
      })
    }

    return
  }

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
      }
    })
  }
}

/**
 * Validates all dates on the edit study form and sends errors to zod ctx
 */
export const validateAllDates = (ctx: z.RefinementCtx, values: EditStudyInputs) => {
  Object.keys(dateValidationRules).forEach((fieldName: keyof DateFieldName) => {
    validateDate(fieldName, ctx, values)
  })
}
