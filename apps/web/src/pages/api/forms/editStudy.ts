import assert from 'node:assert'

import type { Prisma } from 'database'
import type { NextApiRequest } from 'next'

import { Roles, StudyUpdateType } from '@/constants'
import { prismaClient } from '@/lib/prisma'
import { constructDateObjFromParts } from '@/utils/date'
import type { EditStudyInputs } from '@/utils/schemas'
import { studySchema } from '@/utils/schemas'
import { withApiHandler } from '@/utils/withApiHandler'

export interface ExtendedNextApiRequest extends NextApiRequest {
  body: EditStudyInputs
}

export default withApiHandler<ExtendedNextApiRequest>(Roles.SponsorContact, async (req, res, session) => {
  const { CPMS_API_URL, CPMS_API_USERNAME, CPMS_API_PASSWORD } = process.env

  try {
    assert(CPMS_API_URL)
    assert(CPMS_API_USERNAME)
    assert(CPMS_API_PASSWORD)

    const {
      studyId,
      // cpmsId,
      plannedClosureDate,
      plannedOpeningDate,
      actualClosureDate,
      actualOpeningDate,
      estimatedReopeningDate,
      ...studyData
    } = studySchema.parse(req.body)

    const formattedPlannedOpeningDate = constructDateObjFromParts(plannedOpeningDate)
    const formattedActualOpeningDate = constructDateObjFromParts(actualOpeningDate)
    const formattedPlannedClosureDate = constructDateObjFromParts(plannedClosureDate)
    const formattedActualClosureDate = constructDateObjFromParts(actualClosureDate)
    const formattedEstimatedReopeningDate = constructDateObjFromParts(estimatedReopeningDate)

    const studyUpdate: Prisma.StudyUpdatesCreateInput = {
      studyStatus: studyData.status,
      plannedOpeningDate: formattedPlannedOpeningDate,
      actualOpeningDate: formattedActualOpeningDate,
      plannedClosureToRecruitmentDate: formattedPlannedClosureDate,
      actualClosureToRecruitmentDate: formattedActualClosureDate,
      estimatedReopeningDate: formattedEstimatedReopeningDate,
      ukRecruitmentTarget: Number(studyData.recruitmentTarget),
      comment: studyData.furtherInformation,
      study: {
        connect: {
          id: studyId,
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

    // const body = {
    //   ...studyData,
    //   ...(plannedOpeningDate && { PlannedOpeningDate: formattedPlannedOpeningDate }),
    //   ...(actualOpeningDate && { ActualOpeningDate: formattedActualOpeningDate }),
    //   ...(plannedClosureDate && { PlannedClosureToRecruitmentDate: formattedPlannedClosureDate }),
    //   ...(actualClosureDate && { ActualClosureToRecruitmentDate: formattedActualClosureDate }),
    //   ...(estimatedReopeningDate && {
    //     EstimatedReopeningDate: formattedEstimatedReopeningDate,
    //   }),
    // }

    // Only update CPMS if it is a direct change
    // const { study, error } = await updateStudyInCPMS(Number(cpmsId), body)

    // if (!study) {
    //   throw new Error(error)
    // }

    return res.redirect(302, `/studies/${studyId}?success=2`)
  } catch (e) {
    const searchParams = new URLSearchParams({ fatal: '1' })
    const studyId = req.body.studyId

    return res.redirect(302, `/editStudy/${studyId}?${searchParams.toString()}`)
  }
})
