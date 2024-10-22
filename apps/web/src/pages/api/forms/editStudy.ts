import { logger } from '@nihr-ui/logger'
import type { NextApiRequest } from 'next'
import { v4 as uuid } from 'uuid'

import { Status, StudyUpdateRoute } from '@/@types/studies'
import { Roles } from '@/constants'
import { UPDATE_FROM_SE_TEXT } from '@/constants/forms'
import { mapEditStudyInputToCPMSStudy, updateStudyInCPMS, validateStudyUpdate } from '@/lib/cpms/studies'
import { logStudyUpdate } from '@/lib/studyUpdates'
import type { EditStudy } from '@/utils/schemas'
import { studySchema } from '@/utils/schemas'
import { withApiHandler } from '@/utils/withApiHandler'

export interface ExtendedNextApiRequest extends NextApiRequest {
  body: EditStudy
}

export default withApiHandler<ExtendedNextApiRequest>(Roles.SponsorContact, async (req, res, session) => {
  const { DISABLE_DIRECT_STUDY_UPDATES } = process.env

  const enableDirectStudyUpdatesFeature = DISABLE_DIRECT_STUDY_UPDATES?.toLowerCase() === 'false'

  try {
    const { studyId, originalValues, LSN: beforeLSN } = req.body

    logger.info('Updating study started for studyId: %s', studyId)

    const studyDataToUpdate = studySchema.parse(req.body)
    const cpmsStudyInput = mapEditStudyInputToCPMSStudy(studyDataToUpdate)

    const { validationResult, error: validateStudyError } = await validateStudyUpdate(
      Number(studyDataToUpdate.cpmsId),
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
        suspendedStatuses.includes(studyDataToUpdate.status) && !suspendedStatuses.includes(originalValues.status)
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
      studyId,
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
  } catch (e) {
    const searchParams = new URLSearchParams({ fatal: '1' })
    const studyId = req.body.studyId

    logger.error('Failed to update study, error: %s', e)
    return res.redirect(302, `/studies/${studyId}/edit?${searchParams.toString()}`)
  }
})
