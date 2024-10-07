import type { Prisma } from 'database'
import type { NextApiRequest } from 'next'

import { Status, StudyUpdateRoute } from '@/@types/studies'
import { Roles, StudyUpdateType } from '@/constants'
import { UPDATE_FROM_SE_TEXT } from '@/constants/forms'
import { mapEditStudyInputToCPMSStudy, updateStudyInCPMS, validateStudyUpdate } from '@/lib/cpms/studies'
import { prismaClient } from '@/lib/prisma'
import { mapCPMSStatusToFormStatus } from '@/lib/studies'
import { constructDateObjFromParts } from '@/utils/date'
import type { EditStudyInputs } from '@/utils/schemas'
import { studySchema } from '@/utils/schemas'
import { withApiHandler } from '@/utils/withApiHandler'

export interface ExtendedNextApiRequest extends NextApiRequest {
  body: EditStudyInputs
}

export default withApiHandler<ExtendedNextApiRequest>(Roles.SponsorContact, async (req, res, session) => {
  const { ENABLE_DIRECT_STUDY_UPDATES } = process.env

  const enableDirectStudyUpdatesFeature = ENABLE_DIRECT_STUDY_UPDATES?.toLowerCase() === 'true'

  try {
    const studyData = studySchema.parse(req.body)
    const cpmsStudyInput = mapEditStudyInputToCPMSStudy(studyData)

    const { validationResult, error: validateStudyError } = await validateStudyUpdate(
      Number(studyData.cpmsId),
      cpmsStudyInput
    )

    if (!validationResult) {
      throw new Error(validateStudyError)
    }

    // When feature flag is enabled, we use the response from the validate endpoint to determine the update type
    // Otherwise, we override this so we do not send any updates to CPMS
    const isDirectUpdate = enableDirectStudyUpdatesFeature
      ? validationResult.StudyUpdateRoute === StudyUpdateRoute.Direct
      : false

    const formattedPlannedOpeningDate = constructDateObjFromParts(studyData.plannedOpeningDate)
    const formattedActualOpeningDate = constructDateObjFromParts(studyData.actualOpeningDate)
    const formattedPlannedClosureDate = constructDateObjFromParts(studyData.plannedClosureDate)
    const formattedActualClosureDate = constructDateObjFromParts(studyData.actualClosureDate)
    const formattedEstimatedReopeningDate = constructDateObjFromParts(studyData.estimatedReopeningDate)

    const studyUpdate: Prisma.StudyUpdatesCreateInput = {
      studyStatus: isDirectUpdate ? studyData.status : null,
      studyStatusGroup: mapCPMSStatusToFormStatus(studyData.status),
      plannedOpeningDate: formattedPlannedOpeningDate,
      actualOpeningDate: formattedActualOpeningDate,
      plannedClosureToRecruitmentDate: formattedPlannedClosureDate,
      actualClosureToRecruitmentDate: formattedActualClosureDate,
      estimatedReopeningDate: formattedEstimatedReopeningDate,
      ukRecruitmentTarget: studyData.recruitmentTarget ? Number(studyData.recruitmentTarget) : undefined,
      comment: studyData.furtherInformation,
      study: {
        connect: {
          id: studyData.studyId,
        },
      },
      studyUpdateType: {
        connect: { id: isDirectUpdate ? StudyUpdateType.Direct : StudyUpdateType.Proposed },
      },
      createdBy: {
        connect: { id: session.user.id },
      },
      modifiedBy: {
        connect: { id: session.user.id },
      },
    }

    // Both proposed and direct changes are saved to SE
    await prismaClient.studyUpdates.create({
      data: studyUpdate,
    })

    if (isDirectUpdate) {
      // Only send additional note if new status is Suspended and not the original status
      // i.e. a status has been changed to Suspended
      const suspendedStatuses: string[] = [
        Status.SuspendedFromOpenToRecruitment,
        Status.SuspendedFromOpenWithRecruitment,
        Status.Suspended,
      ]
      const additionalNote =
        suspendedStatuses.includes(studyData.status) && !suspendedStatuses.includes(studyData.originalStatus ?? '')
          ? UPDATE_FROM_SE_TEXT
          : ''

      const { study, error: updateStudyError } = await updateStudyInCPMS(Number(studyData.cpmsId), {
        ...cpmsStudyInput,
        notes: additionalNote,
      })

      if (!study) {
        throw new Error(updateStudyError)
      }
    }

    return res.redirect(302, `/studies/${studyData.studyId}?success=${isDirectUpdate ? 3 : 2}`)
  } catch (e) {
    const searchParams = new URLSearchParams({ fatal: '1' })
    const studyId = req.body.studyId

    return res.redirect(302, `/studies/${studyId}/edit?${searchParams.toString()}`)
  }
})
