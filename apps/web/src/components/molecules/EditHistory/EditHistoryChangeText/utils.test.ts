import { getColumnChangedLabelText } from './utils'

jest.mock('../../../../constants/editStudyForm', () => ({
  fieldNameToLabelMapping: {
    recruitmentTarget: 'Recruitment target',
    status: 'Study status',
  },
}))

describe('getColumnChangedLabelText()', () => {
  it('should return the input string when it does not exist in the mapping', () => {
    const mockInput = 'test'
    const result = getColumnChangedLabelText(mockInput)
    expect(result).toEqual(mockInput)
  })

  it.each([
    ['UkRecruitmentTarget', 'Recruitment target'],
    ['StudyStatus', 'Study status'],
  ])('should return the correct value given the input %s', (input: string, expectedOutput: string) => {
    const result = getColumnChangedLabelText(input)
    expect(result).toEqual(expectedOutput)
  })
})
