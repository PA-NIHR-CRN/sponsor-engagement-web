import assert from 'node:assert'

import axios from 'axios'

import type { CPMSStudyResponse, Study } from '@/@types/studies'

interface GetStudyFromCPMSResponse {
  study: Study | null
  error?: string
}

export const getStudyByIdFromCPMS = async (studyId: string): Promise<GetStudyFromCPMSResponse> => {
  const { CPMS_API_URL, CPMS_API_USERNAME, CPMS_API_PASSWORD } = process.env

  try {
    assert(CPMS_API_URL)
    assert(CPMS_API_USERNAME)
    assert(CPMS_API_PASSWORD)

    const requestUrl = `${CPMS_API_URL}/studies/${studyId}/engagement-info`
    const { data } = await axios.get<CPMSStudyResponse>(requestUrl, {
      headers: { username: CPMS_API_USERNAME, password: CPMS_API_PASSWORD },
    })

    if (data.StatusCode !== 200) {
      throw new Error('An error occured fetching study from CPMS')
    }

    return { study: data.Result }
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e)

    return { study: null, error }
  }
}
