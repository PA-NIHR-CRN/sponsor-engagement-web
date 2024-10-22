import { logger } from '@nihr-ui/logger'
import type { NextApiRequest } from 'next'
import { v4 as uuid } from 'uuid'
import { ZodError } from 'zod'

import { Status, StudyUpdateRoute } from '@/@types/studies'
import type { DateInputValue } from '@/components/atoms/Form/DateInput/types'
import { Roles } from '@/constants'
import { UPDATE_FROM_SE_TEXT } from '@/constants/forms'
import { mapEditStudyInputToCPMSStudy, updateStudyInCPMS, validateStudyUpdate } from '@/lib/cpms/studies'
import { mapCPMSStatusToFormStatus } from '@/lib/studies'
import { logStudyUpdate } from '@/lib/studyUpdates'
import {
  editStudyDateFields,
  getCPMSStatusFromEditStudyBody,
  getVisibleFormFields,
  transformEditStudyBody,
} from '@/utils/editStudyForm'
import type { EditStudy } from '@/utils/schemas'
import { studySchema, studySchemaShape } from '@/utils/schemas'
import { withApiHandler } from '@/utils/withApiHandler'

// Date fields with each date parts as separate fields
// This is required for when JS is disabled, as nested fields are sent separately
export interface DateFieldWithParts {
  'actualOpeningDate-day': string
  'actualOpeningDate-month': string
  'actualOpeningDate-year': string
  'plannedOpeningDate-day': string
  'plannedOpeningDate-month': string
  'plannedOpeningDate-year': string
  'actualClosureDate-day': string
  'actualClosureDate-month': string
  'actualClosureDate-year': string
  'estimatedReopeningDate-day': string
  'estimatedReopeningDate-month': string
  'estimatedReopeningDate-year': string
  'plannedClosureDate-day': string
  'plannedClosureDate-month': string
  'plannedClosureDate-year': string
}

export interface ExtendedNextApiRequest extends NextApiRequest {
  body: EditStudy | (EditStudy & Partial<DateFieldWithParts>)
}

export default withApiHandler<ExtendedNextApiRequest>(Roles.SponsorContact, async (req, res, session) => {
  const { ENABLE_DIRECT_STUDY_UPDATES } = process.env

  const enableDirectStudyUpdatesFeature = ENABLE_DIRECT_STUDY_UPDATES?.toLowerCase() === 'true'

  try {
    const { studyId, originalValues: originalValuesStringified, LSN: beforeLSN } = req.body

    logger.info('Updating study started for studyId: %s', studyId)

    // When JS is disabled, the original values object is stringified
    const originalValues = (
      typeof originalValuesStringified === 'string' ? JSON.parse(originalValuesStringified) : originalValuesStringified
    ) as EditStudy['originalValues']

    // When JS is disabled, the nested date fields are returned as single attributes so this function converts them back into an object to match the schema
    // i.e. plannedOpeningDate-day rather than a object with the key 'day'
    const transformedData = transformEditStudyBody({ ...req.body, originalValues })

    const parsedStudyData = studySchema.parse(transformedData)
    const correctStatusToUpdate = getCPMSStatusFromEditStudyBody(
      parsedStudyData.originalValues?.status ?? '',
      parsedStudyData.status
    )
    const studyData = { ...parsedStudyData, status: correctStatusToUpdate }

    // Ensure that only date fields allowed for the status are modified, otherwise, use the original value
    const [visibleDateFields] = getVisibleFormFields(
      mapCPMSStatusToFormStatus(studyData.originalValues?.status ?? ''),
      mapCPMSStatusToFormStatus(studyData.status)
    )

    const studyDataToUpdate = structuredClone(studyData)
    editStudyDateFields.forEach((dateField) => {
      if (!visibleDateFields.includes(dateField)) {
        studyDataToUpdate[dateField] = originalValues?.[dateField]
      }
    })

    const cpmsStudyInput = mapEditStudyInputToCPMSStudy({
      ...studyDataToUpdate,
      status: correctStatusToUpdate,
    })

    const { validationResult, error: validateStudyError } = await validateStudyUpdate(
      Number(studyData.cpmsId),
      cpmsStudyInput
    )

    if (!validationResult) {
      throw new Error(validateStudyError)
    }

    logger.info('Validated study update with cpmsId: %s', studyDataToUpdate.cpmsId)

    // When feature flag is enabled, we use the response from the validate endpoint to determine the update type
    // Otherwise, we override this so we do not send any updates to CPMS
    const isDirectUpdate = enableDirectStudyUpdatesFeature
      ? validationResult.StudyUpdateRoute === StudyUpdateRoute.Direct
      : false

    let afterLSN = ''

    if (isDirectUpdate) {
      // Only send additional note if new status is Suspended and not the original status
      // i.e. a status has been changed to Suspended
      const suspendedStatuses: string[] = [
        Status.SuspendedFromOpenToRecruitment,
        Status.SuspendedFromOpenWithRecruitment,
        Status.Suspended,
      ]
      const additionalNote =
        suspendedStatuses.includes(studyDataToUpdate.status) &&
        !suspendedStatuses.includes(originalValues?.status ?? '')
          ? UPDATE_FROM_SE_TEXT
          : ''

      const { study, error: updateStudyError } = await updateStudyInCPMS(Number(studyDataToUpdate.cpmsId), {
        ...cpmsStudyInput,
        CurrentLsn: beforeLSN,
        notes: additionalNote,
      })

      if (!study) {
        throw new Error(updateStudyError)
      }

      afterLSN = study.UpdateLsn
    }

    const transactionId = uuid()

    await logStudyUpdate(
      Number(studyId),
      transactionId,
      originalValues,
      studyDataToUpdate,
      isDirectUpdate,
      session.user.id,
      beforeLSN,
      afterLSN
    )

    logger.info('Logged study update with studyId: %s', studyId)

    const searchParams = new URLSearchParams({
      success: isDirectUpdate ? '3' : '2',
      ...(!isDirectUpdate ? { latestProposedUpdate: transactionId } : {}),
    })

    return res.redirect(302, `/studies/${studyId}?${searchParams.toString()}`)
  } catch (error) {
    const transformedData = transformEditStudyBody(req.body)

    const studyId = req.body.studyId

    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string> = Object.fromEntries(
        error.errors.map(({ path: [fieldId], message }) => {
          return [`${fieldId}Error`, message]
        })
      )

      // Insert the original values
      Object.keys(studySchemaShape).forEach((field) => {
        if ((editStudyDateFields as string[]).includes(field) && transformedData[field]) {
          const dateFields = ['day', 'month', 'year']

          dateFields.forEach((dateField) => {
            fieldErrors[`${field}-${dateField}`] = (transformedData[field] as DateInputValue)[dateField] as string
          })
        }
        if (transformedData[field]) {
          fieldErrors[field] = transformedData[field] as string
        }
      })

      delete fieldErrors.studyId

      const searchParams = new URLSearchParams({
        ...fieldErrors,
      })

      return res.redirect(302, `/studies/${studyId}/edit?${searchParams.toString()}`)
    }

    const searchParams = new URLSearchParams({ fatal: '1' })

    logger.error('Failed to update study, error: %s', error)
    return res.redirect(302, `/studies/${studyId}/edit?${searchParams.toString()}`)
  }
})
