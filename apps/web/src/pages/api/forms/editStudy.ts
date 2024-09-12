import assert from 'node:assert'

import axios from 'axios'
import type { NextApiRequest } from 'next'

import type { CPMSStudyResponse } from '@/@types/studies'
import { Roles } from '@/constants'
import { constructDateObjFromParts } from '@/utils/date'
import type { EditStudyInputs } from '@/utils/schemas'
import { studySchema } from '@/utils/schemas'
import { withApiHandler } from '@/utils/withApiHandler'

export interface ExtendedNextApiRequest extends NextApiRequest {
  body: EditStudyInputs
}

export default withApiHandler<ExtendedNextApiRequest>(Roles.SponsorContact, async (req, res) => {
  const { CPMS_API_URL, CPMS_API_USERNAME, CPMS_API_PASSWORD } = process.env

  try {
    assert(CPMS_API_URL)
    assert(CPMS_API_USERNAME)
    assert(CPMS_API_PASSWORD)

    const { id, studyId, plannedClosureDate, plannedOpeningDate, actualClosureDate, actualOpeningDate, ...studyData } =
      studySchema.parse(req.body)

    const body = JSON.stringify({
      ...studyData,
      ...(plannedOpeningDate && { PlannedOpeningDate: constructDateObjFromParts(plannedOpeningDate) }),
      ...(actualOpeningDate && { ActualOpeningDate: constructDateObjFromParts(actualOpeningDate) }),
      ...(plannedClosureDate && { PlannedClosureToRecruitmentDate: constructDateObjFromParts(plannedClosureDate) }),
      ...(actualClosureDate && { ActualClosureToRecruitmentDate: constructDateObjFromParts(actualClosureDate) }),
    })

    const requestUrl = `${CPMS_API_URL}/studies/${studyId}/engagement-info`

    const { data } = await axios.put<CPMSStudyResponse>(requestUrl, body, {
      headers: {
        username: CPMS_API_USERNAME,
        password: CPMS_API_PASSWORD,
        'Content-Type': 'application/json',
      },
    })

    if (data.StatusCode !== 200) {
      throw new Error('An error occured fetching study from CPMS')
    }

    return res.redirect(302, `/studies/${id}?success=2`)
  } catch (e) {
    const searchParams = new URLSearchParams({ fatal: '1' })
    const id = req.body.id

    return res.redirect(302, `/studies/${id}/?${searchParams.toString()}`)
  }
})
