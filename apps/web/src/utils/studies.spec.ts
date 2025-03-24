import { setStudyAssessmentDueDate, setStudyAssessmentNotDue } from '@/lib/studies'

import { getStudyAssessmentDueDate } from './studies'

jest.mock('../lib/studies')

const mockSetStudyAssessmentNotDue = setStudyAssessmentNotDue as jest.MockedFunction<typeof setStudyAssessmentNotDue>
const mockSetStudyAssessmentDueDate = setStudyAssessmentDueDate as jest.MockedFunction<typeof setStudyAssessmentDueDate>

describe('getStudyAssessmentDueDate', () => {
  const studyId = 1
  const mockDate = new Date('2025-03-20T00:00:00.000Z')

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(mockDate)
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should return current assessment due date when there is an error checking if an assessment is not due', async () => {
    mockSetStudyAssessmentNotDue.mockResolvedValue({ data: null, error: 'An error occurred' })
    const currentAssessmentDueDate = new Date('2025-01-01T00:00:00.000Z')

    const result = await getStudyAssessmentDueDate(studyId, currentAssessmentDueDate)

    expect(result).toBe(currentAssessmentDueDate)
    expect(setStudyAssessmentNotDue).toHaveBeenCalledWith([studyId])
    expect(setStudyAssessmentDueDate).not.toHaveBeenCalled()
  })

  it('should return null when study is not due an assessment', async () => {
    mockSetStudyAssessmentNotDue.mockResolvedValue({ data: 1 })

    const result = await getStudyAssessmentDueDate(studyId, null)

    expect(result).toBeNull()
    expect(setStudyAssessmentNotDue).toHaveBeenCalledWith([studyId])
    expect(setStudyAssessmentDueDate).not.toHaveBeenCalled()
  })

  it('should return current assessment due date when there is an error checking if an assessment is due ', async () => {
    mockSetStudyAssessmentNotDue.mockResolvedValue({ data: 0 })
    mockSetStudyAssessmentDueDate.mockResolvedValue({ data: null, error: 'An error occurred' })

    const currentAssessmentDueDate = new Date('2025-01-01T00:00:00.000Z')
    const result = await getStudyAssessmentDueDate(studyId, currentAssessmentDueDate)

    expect(result).toBe(currentAssessmentDueDate)
    expect(setStudyAssessmentNotDue).toHaveBeenCalledWith([studyId])
    expect(setStudyAssessmentDueDate).toHaveBeenCalledWith([studyId])
  })

  it('should return current assessment due date when study is due an assessment and current date exists', async () => {
    mockSetStudyAssessmentNotDue.mockResolvedValue({ data: 0 })
    mockSetStudyAssessmentDueDate.mockResolvedValue({ data: 0 })

    const currentAssessmentDueDate = new Date('2025-01-01T00:00:00.000Z')
    const result = await getStudyAssessmentDueDate(studyId, currentAssessmentDueDate)

    expect(result).toBe(currentAssessmentDueDate)
    expect(setStudyAssessmentNotDue).toHaveBeenCalledWith([studyId])
    expect(setStudyAssessmentDueDate).toHaveBeenCalledWith([studyId])
  })

  it('should return a new date when an assessment is due for an assessment and no previous date exists', async () => {
    mockSetStudyAssessmentNotDue.mockResolvedValue({ data: 0 })
    mockSetStudyAssessmentDueDate.mockResolvedValue({ data: 1 })

    const result = await getStudyAssessmentDueDate(studyId, null)

    expect(result).toEqual(mockDate)
    expect(setStudyAssessmentNotDue).toHaveBeenCalledWith([studyId])
    expect(setStudyAssessmentDueDate).toHaveBeenCalledWith([studyId])
  })
})
