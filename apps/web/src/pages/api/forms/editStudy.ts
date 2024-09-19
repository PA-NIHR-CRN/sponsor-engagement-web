import assert from 'node:assert'

import type { Prisma } from 'database'
import type { NextApiRequest } from 'next'

import { Roles, StudyUpdateType } from '@/constants'
import { mapEditStudyInputToCPMSStudy, updateStudyInCPMS } from '@/lib/cpms/studies'
import { prismaClient } from '@/lib/prisma'
import { constructDateObjFromParts } from '@/utils/date'
import type { EditStudyInputs } from '@/utils/schemas'
import { studySchema } from '@/utils/schemas'
import { withApiHandler } from '@/utils/withApiHandler'

export interface ExtendedNextApiRequest extends NextApiRequest {
  body: EditStudyInputs
}

export default withApiHandler<ExtendedNextApiRequest>(Roles.SponsorContact, async (req, res, session) => {
  const { CPMS_API_URL, CPMS_API_USERNAME, CPMS_API_PASSWORD, ENABLE_DIRECT_STUDY_UPDATES } = process.env

  const enableDirectStudyUpdatesFeature = ENABLE_DIRECT_STUDY_UPDATES?.toLowerCase() === 'true'

  try {
    assert(CPMS_API_URL)
    assert(CPMS_API_USERNAME)
    assert(CPMS_API_PASSWORD)

    const studyData = studySchema.parse(req.body)

    const formattedPlannedOpeningDate = constructDateObjFromParts(studyData.plannedOpeningDate)
    const formattedActualOpeningDate = constructDateObjFromParts(studyData.actualOpeningDate)
    const formattedPlannedClosureDate = constructDateObjFromParts(studyData.plannedClosureDate)
    const formattedActualClosureDate = constructDateObjFromParts(studyData.actualClosureDate)
    const formattedEstimatedReopeningDate = constructDateObjFromParts(studyData.estimatedReopeningDate)

    const studyUpdate: Prisma.StudyUpdatesCreateInput = {
      studyStatus: studyData.status,
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
        connect: { id: StudyUpdateType.Proposed },
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

    // TO DO: Update feature flag usage to override CPMS validate response
    if (enableDirectStudyUpdatesFeature) {
      const cpmsStudyInput = mapEditStudyInputToCPMSStudy(studyData)

      const { study, error } = await updateStudyInCPMS(Number(studyData.cpmsId), cpmsStudyInput)

      if (!study) {
        throw new Error(error)
      }
    }

    return res.redirect(302, `/studies/${studyData.studyId}?success=2`)
  } catch (e) {
    const searchParams = new URLSearchParams({ fatal: '1' })
    const studyId = req.body.studyId

    return res.redirect(302, `/editStudy/${studyId}?${searchParams.toString()}`)
  }
})
