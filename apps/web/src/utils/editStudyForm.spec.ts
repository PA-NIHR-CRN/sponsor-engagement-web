import type { DateFieldWithParts } from '../pages/api/forms/editStudy'
import { transformEditStudyBody } from './editStudyForm'
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
