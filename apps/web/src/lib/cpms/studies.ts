import assert from 'node:assert'

import axios from 'axios'

import type { CPMSStudyResponse, Study } from '@/@types/studies'
import { constructDateObjFromParts } from '@/utils/date'
import type { EditStudyInputs } from '@/utils/schemas'

export interface GetStudyFromCPMSResponse {
  study: Study | null
  error?: string
}

export const getStudyByIdFromCPMS = async (studyId: number): Promise<GetStudyFromCPMSResponse> => {
  const { CPMS_API_URL, CPMS_API_USERNAME, CPMS_API_PASSWORD } = process.env

  try {
    assert(CPMS_API_URL, 'CPMS_API_URL is not defined')
    assert(CPMS_API_USERNAME, 'CPMS_API_USERNAME is not defined')
    assert(CPMS_API_PASSWORD, 'CPMS_API_PASSWORD is not defined')

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

type UpdateStudyInput = Pick<
  Study,
  | 'StudyStatus'
  | 'SampleSize'
  | 'PlannedOpeningDate'
  | 'ActualOpeningDate'
  | 'PlannedClosureToRecruitmentDate'
  | 'ActualClosureToRecruitmentDate'
  | 'EstimatedReopeningDate'
>

export interface UpdateStudyFromCPMSResponse {
  study: Study | null
  error?: string
}

export const updateStudyInCPMS = async (
  cpmsId: number,
  studyData: UpdateStudyInput
): Promise<UpdateStudyFromCPMSResponse> => {
  const { CPMS_API_URL, CPMS_API_USERNAME, CPMS_API_PASSWORD } = process.env

  try {
    assert(CPMS_API_URL)
    assert(CPMS_API_USERNAME)
    assert(CPMS_API_PASSWORD)

    const body = JSON.stringify(studyData)

    const requestUrl = `${CPMS_API_URL}/studies/${cpmsId}/engagement-info`

    const { data } = await axios.put<CPMSStudyResponse>(requestUrl, body, {
      headers: {
        username: CPMS_API_USERNAME,
        password: CPMS_API_PASSWORD,
        'Content-Type': 'application/json',
      },
    })

    if (data.StatusCode !== 200) {
      throw new Error('An error occured updating study in CPMS')
    }

    return {
      study: data.Result,
    }
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e)

    return { study: null, error }
  }
}

export const mapSEStudyToCPMSStudy = (study: EditStudyInputs): UpdateStudyInput => ({
  StudyStatus: study.status,
  SampleSize: study.recruitmentTarget ? Number(study.recruitmentTarget) : null,
  PlannedOpeningDate: constructDateObjFromParts(study.plannedOpeningDate)?.toISOString() ?? null,
  ActualOpeningDate: constructDateObjFromParts(study.actualOpeningDate)?.toISOString() ?? null,
  PlannedClosureToRecruitmentDate: constructDateObjFromParts(study.plannedClosureDate)?.toISOString() ?? null,
  ActualClosureToRecruitmentDate: constructDateObjFromParts(study.actualClosureDate)?.toISOString() ?? null,
  EstimatedReopeningDate: constructDateObjFromParts(study.estimatedReopeningDate)?.toISOString() ?? null,
})
