import { render } from '@/config/TestUtils'

import { EditHistoryChangeText } from './EditHistoryChangeText'
import { getColumnChangedLabelText } from './utils'

jest.mock('./utils')
const mockGetColumnChangedLabelText = getColumnChangedLabelText as jest.MockedFunction<typeof getColumnChangedLabelText>

describe('<EditHistoryChangeText/>', () => {
  it('should display the correct text when there is both a before and after value', () => {
    const mockLabel = 'UK recruitment target'
    mockGetColumnChangedLabelText.mockReturnValue(mockLabel)
    const mockChange = {
      afterValue: '12',
      beforeValue: '14',
      columnChanged: 'UkRecruitmentTarget',
    }
    const { getByText } = render(<EditHistoryChangeText change={mockChange} />)

    expect(
      getByText(`${mockLabel} changed from ${mockChange.beforeValue} to ${mockChange.afterValue}`)
    ).toBeInTheDocument()
  })

  it('should display the correct text when there is no before value and only an after value', () => {
    const mockLabel = 'UK recruitment target'
    mockGetColumnChangedLabelText.mockReturnValue(mockLabel)
    const mockChange = {
      afterValue: '12',
      columnChanged: 'UkRecruitmentTarget',
    }
    const { getByText } = render(<EditHistoryChangeText change={mockChange} />)

    expect(getByText(`${mockLabel} ${mockChange.afterValue} added`)).toBeInTheDocument()
  })

  it('should display the correct text when there is no after value and only a before value', () => {
    const mockLabel = 'UK recruitment target'
    mockGetColumnChangedLabelText.mockReturnValue(mockLabel)
    const mockChange = {
      columnChanged: 'UkRecruitmentTarget',
      beforeValue: '14',
    }
    const { getByText } = render(<EditHistoryChangeText change={mockChange} />)

    expect(getByText(`${mockLabel} ${mockChange.beforeValue} removed`)).toBeInTheDocument()
  })
})
