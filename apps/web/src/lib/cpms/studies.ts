import assert from 'node:assert'

import axios from 'axios'

import type {
  CPMSGetStudyResponse,
  CPMSUpdateStudyResponse,
  CPMSValidateStudyResponse,
  CPMSValidationResult,
  Study,
} from '@/@types/studies'
import { constructDateStrFromParts } from '@/utils/date'
import type { EditStudyInputs } from '@/utils/schemas'

export interface GetStudyFromCPMSResponse {
  study: (Study & { CurrentLsn: string }) | null
  error?: string
}

export const getStudyByIdFromCPMS = async (studyId: number): Promise<GetStudyFromCPMSResponse> => {
  const { CPMS_API_URL, CPMS_API_USERNAME, CPMS_API_PASSWORD, EDIT_HISTORY_START_DATE } = process.env

  try {
    assert(CPMS_API_URL, 'CPMS_API_URL is not defined')
    assert(CPMS_API_USERNAME, 'CPMS_API_USERNAME is not defined')
    assert(CPMS_API_PASSWORD, 'CPMS_API_PASSWORD is not defined')
    assert(EDIT_HISTORY_START_DATE, 'EDIT_HISTORY_START_DATE is not defined')

    const requestUrl = `${CPMS_API_URL}/studies/${studyId}/engagement-info`
    const { data } = await axios.get<CPMSGetStudyResponse>(requestUrl, {
      headers: { username: CPMS_API_USERNAME, password: CPMS_API_PASSWORD },
      params: {
        changeHistoryFrom: EDIT_HISTORY_START_DATE,
        changeHistoryMaxItems: 10,
      },
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

export type UpdateStudyInput = Pick<
  Study,
  | 'StudyStatus'
  | 'UkRecruitmentTarget'
  | 'PlannedOpeningDate'
  | 'ActualOpeningDate'
  | 'PlannedClosureToRecruitmentDate'
  | 'ActualClosureToRecruitmentDate'
  | 'EstimatedReopeningDate'
> & { notes?: string }

export interface UpdateStudyFromCPMSResponse {
  study: (Study & { UpdateLsn: string }) | null
  error?: string
}

export const updateStudyInCPMS = async (
  cpmsId: number,
  studyData: UpdateStudyInput
): Promise<UpdateStudyFromCPMSResponse> => {
  const { CPMS_API_URL, CPMS_API_USERNAME, CPMS_API_PASSWORD } = process.env

  try {
    assert(CPMS_API_URL, 'CPMS_API_URL is not defined')
    assert(CPMS_API_USERNAME, 'CPMS_API_USERNAME is not defined')
    assert(CPMS_API_PASSWORD, 'CPMS_API_PASSWORD is not defined')

    const body = JSON.stringify(studyData)

    const requestUrl = `${CPMS_API_URL}/studies/${cpmsId}/engagement-info`

    const { data } = await axios.put<CPMSUpdateStudyResponse>(requestUrl, body, {
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

export const mapEditStudyInputToCPMSStudy = (study: EditStudyInputs): UpdateStudyInput => ({
  StudyStatus: study.status,
  UkRecruitmentTarget: study.recruitmentTarget ? Number(study.recruitmentTarget) : null,
  PlannedOpeningDate: constructDateStrFromParts(study.plannedOpeningDate, false) ?? null,
  ActualOpeningDate: constructDateStrFromParts(study.actualOpeningDate, false) ?? null,
  PlannedClosureToRecruitmentDate: constructDateStrFromParts(study.plannedClosureDate, false) ?? null,
  ActualClosureToRecruitmentDate: constructDateStrFromParts(study.actualClosureDate, false) ?? null,
  EstimatedReopeningDate: constructDateStrFromParts(study.estimatedReopeningDate, false) ?? null,
})

export interface ValidateStudyUpdateResponse {
  validationResult: CPMSValidationResult | null
  error?: string
}

export const validateStudyUpdate = async (
  cpmsId: number,
  studyData: UpdateStudyInput
): Promise<ValidateStudyUpdateResponse> => {
  const { CPMS_API_URL, CPMS_API_USERNAME, CPMS_API_PASSWORD } = process.env

  try {
    assert(CPMS_API_URL, 'CPMS_API_URL is not defined')
    assert(CPMS_API_USERNAME, 'CPMS_API_USERNAME is not defined')
    assert(CPMS_API_PASSWORD, 'CPMS_API_PASSWORD is not defined')

    const body = JSON.stringify(studyData)

    const requestUrl = `${CPMS_API_URL}/studies/${cpmsId}/engagement-info/validate`

    const { data } = await axios.post<CPMSValidateStudyResponse>(requestUrl, body, {
      headers: {
        username: CPMS_API_USERNAME,
        password: CPMS_API_PASSWORD,
        'Content-Type': 'application/json',
      },
    })

    if (data.StatusCode !== 200) {
      throw new Error('An error occured validating study in CPMS')
    }

    return {
      validationResult: data.Result,
    }
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e)

    return { validationResult: null, error }
  }
}
