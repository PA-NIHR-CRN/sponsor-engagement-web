import { Status } from '@/@types/studies'
import { FormStudyStatus } from '@/constants/editStudyForm'

import type { DateFieldWithParts, ExtendedNextApiRequest } from '../pages/api/forms/editStudy'
import { getCPMSStatusFromEditStudyBody, transformEditStudyBody, validateStatus } from './editStudyForm'
import type { EditStudy } from './schemas'

describe('transformEditStudyBody()', () => {
  it('should transform date fields (day, month, year) correctly', () => {
    const input = {
      'plannedOpeningDate-day': '12',
      'plannedOpeningDate-month': '08',
      'plannedOpeningDate-year': '2023',
    }

    const expectedOutput = {
      plannedOpeningDate: {
        day: '12',
        month: '08',
        year: '2023',
      },
    }

    expect(transformEditStudyBody(input as EditStudy & Partial<DateFieldWithParts>)).toEqual(expectedOutput)
  })

  it('should handle mixed date and non-date fields', () => {
    const input = {
      'plannedOpeningDate-day': '15',
      'plannedOpeningDate-month': '04',
      'plannedOpeningDate-year': '2021',
      status: 'Closed',
      recruitmentTarget: '10',
    }

    const expectedOutput = {
      plannedOpeningDate: {
        day: '15',
        month: '04',
        year: '2021',
      },
      status: 'Closed',
      recruitmentTarget: '10',
    }

    expect(transformEditStudyBody(input as EditStudy & Partial<DateFieldWithParts>)).toEqual(expectedOutput)
  })

  it('should handle partial date fields', () => {
    const input = {
      'plannedOpeningDate-day': '05',
      'plannedOpeningDate-year': '2022',
    }

    const expectedOutput = {
      plannedOpeningDate: {
        day: '05',
        year: '2022',
        month: '',
      },
    }

    expect(transformEditStudyBody(input as EditStudy & Partial<DateFieldWithParts>)).toEqual(expectedOutput)
  })

  it('should handle empty input', () => {
    const input = {}
    const expectedOutput = {}

    expect(transformEditStudyBody(input as EditStudy & Partial<DateFieldWithParts>)).toEqual(expectedOutput)
  })
})

describe('validateStatus()', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  const mockCTX = {
    addIssue: jest.fn(),
    path: [] as (string | number)[],
  }

  const body: ExtendedNextApiRequest['body'] = {
    studyId: '1212',
    cpmsId: '4332',
    status: 'Suspended (from Open, With Recruitment)',
    plannedOpeningDate: {
      day: '28',
      month: '02',
      year: '2003',
    },
    actualClosureDate: {
      day: '28',
      month: '02',
      year: '2003',
    },
    actualOpeningDate: {
      day: '01',
      month: '09',
      year: '1991',
    },
    plannedClosureDate: {
      day: '28',
      month: '02',
      year: '2004',
    },
    estimatedReopeningDate: {
      day: '28',
      month: '02',
      year: '2021',
    },
    recruitmentTarget: '121',
    furtherInformation: '',
    originalValues: {
      status: 'Open to Recruitment',
      plannedOpeningDate: {
        day: '27',
        month: '02',
        year: '2003',
      },
      actualClosureDate: {
        day: '28',
        month: '02',
        year: '2003',
      },
      actualOpeningDate: {
        day: '02',
        month: '09',
        year: '1991',
      },
      plannedClosureDate: {
        day: '27',
        month: '02',
        year: '2004',
      },
      estimatedReopeningDate: {
        day: '27',
        month: '02',
        year: '2021',
      },
      recruitmentTarget: '122',
      furtherInformation: '',
    },
    LSN: '001212121',
  }

  it('shoud not call ctx if the previous and new status is the same', () => {
    validateStatus(mockCTX, { ...body, status: body.originalValues?.status as string })

    expect(mockCTX.addIssue).not.toHaveBeenCalled()
  })

  it('shoud call ctx if status transition from previous status to new status is not allowed', () => {
    validateStatus(mockCTX, { ...body, status: Status.InSetup })

    expect(mockCTX.addIssue).toHaveBeenCalledTimes(1)
    expect(mockCTX.addIssue).toHaveBeenCalledWith({
      code: 'custom',
      message: 'Cannot transition study from Open to recruitment to In setup',
      path: ['status'],
    })
  })

  it('should not call ctx if status transition is allowed', () => {
    validateStatus(mockCTX, body)

    expect(mockCTX.addIssue).not.toHaveBeenCalled()
  })
})

describe('getCPMSStatusFromEditStudyBody()', () => {
  it.each([Status.OpenToRecruitment, Status.OpenWithRecruitment])(
    'should return original status when new status is "Open, to recruitment" and original status is %s',
    (originalStatus: string) => {
      const newStatus = FormStudyStatus.OpenToRecruitment

      const result = getCPMSStatusFromEditStudyBody(originalStatus, newStatus)
      expect(result).toBe(originalStatus)
    }
  )

  it.each([Status.SuspendedFromOpenToRecruitment, Status.SuspendedFromOpenWithRecruitment])(
    'should return original status when new status is "Suspended" and original status is %s',
    (originalStatus: string) => {
      const newStatus = FormStudyStatus.Suspended

      const result = getCPMSStatusFromEditStudyBody(originalStatus, newStatus)
      expect(result).toBe(originalStatus)
    }
  )

  it('should return mapped status when new status is not "Open, to recruitment" or "Suspended"', () => {
    const originalStatus = Status.InSetup
    const result = getCPMSStatusFromEditStudyBody(originalStatus, FormStudyStatus.Closed)

    expect(result).toBe(Status.ClosedToRecruitmentFollowUpComplete)
  })

  it('should return mapped status when new status is "Open, to recruitment" but original status is not a type of Open', () => {
    const originalStatus = Status.SuspendedFromOpenWithRecruitment
    const newStatus = FormStudyStatus.OpenToRecruitment

    const result = getCPMSStatusFromEditStudyBody(originalStatus, newStatus)

    expect(result).toBe(Status.OpenWithRecruitment)
  })

  it('should return mapped status when new status is Suspended but original status is not a type of Suspended', () => {
    const originalStatus = Status.OpenWithRecruitment
    const newStatus = FormStudyStatus.Suspended

    const result = getCPMSStatusFromEditStudyBody(originalStatus, newStatus)

    expect(result).toBe(Status.SuspendedFromOpenWithRecruitment)
  })
})
