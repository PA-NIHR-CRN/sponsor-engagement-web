import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { render } from '@/config/TestUtils'

import { Status } from '../../../@types/studies'
import { StudyUpdateType } from '../../../constants/index'
import { EditHistory } from './EditHistory'
import { type EditHistoryItemProps } from './EditHistoryItem/EditHistoryItem'

const proposedEditHistory = {
  LSN: '9867677',
  modifiedDate: '2024-10-10T00:00:00.000Z',
  userEmail: 'sponsor.contact@nihr.ac.uk',
  changes: [
    {
      id: '3454334',
      afterValue: '120',
      beforeValue: '30',
      columnChanged: 'UkRecruitmentTarget',
    },
    {
      id: '3432343',
      afterValue: Status.OpenToRecruitment,
      beforeValue: Status.SuspendedFromOpenToRecruitment,
      columnChanged: 'Status',
    },
  ],
  studyUpdateType: StudyUpdateType.Proposed,
}

const mockEditHistories: EditHistoryItemProps[] = [
  {
    LSN: '1212121',
    modifiedDate: '2024-11-10T00:00:00.000Z',
    userEmail: 'sponsor.contact@nihr.ac.uk',
    changes: [
      {
        id: '3434',
        afterValue: '120',
        beforeValue: '30',
        columnChanged: 'UkRecruitmentTarget',
      },
      {
        id: '34334',
        afterValue: Status.OpenToRecruitment,
        beforeValue: Status.SuspendedFromOpenToRecruitment,
        columnChanged: 'StudyStatus',
      },
    ],
    studyUpdateType: StudyUpdateType.Direct,
  },
  proposedEditHistory,
]

describe('<EditHistory/>', () => {
  it('should correctly display the default values', async () => {
    render(<EditHistory editHistoryItems={mockEditHistories} />)

    const viewEditHistory = screen.getByRole('group')
    expect(within(viewEditHistory).getByText('View edit history')).toBeInTheDocument()
    expect(viewEditHistory).toBeInTheDocument()

    await userEvent.click(viewEditHistory)

    expect(
      within(viewEditHistory).getByTestId(`edit-history-accordion-item-${mockEditHistories[0].LSN}`)
    ).toBeInTheDocument()
    expect(
      within(viewEditHistory).getByTestId(`edit-history-accordion-item-${mockEditHistories[1].LSN}`)
    ).toBeInTheDocument()
  })

  it('should return correct copy if there are no edit history items', async () => {
    render(<EditHistory editHistoryItems={[]} />)

    const viewEditHistory = screen.getByRole('group')
    expect(viewEditHistory).toBeInTheDocument()

    await userEvent.click(viewEditHistory)

    expect(within(viewEditHistory).getByText('There is no edit history.')).toBeInTheDocument()
  })

  it('should return correct copy when there is an error message', async () => {
    const mockErrorMessage = 'There has been an error'

    render(<EditHistory editHistoryItems={[]} errorMessage={mockErrorMessage} />)

    const viewEditHistory = screen.getByRole('group')
    expect(viewEditHistory).toBeInTheDocument()

    await userEvent.click(viewEditHistory)

    expect(within(viewEditHistory).getByText(mockErrorMessage)).toBeInTheDocument()
  })

  it('should auto expand the relevant item', async () => {
    render(<EditHistory editHistoryItems={mockEditHistories} lsnToAutoExpand={mockEditHistories[1].LSN} />)

    const viewEditHistory = screen.getByRole('group')
    expect(within(viewEditHistory).getByText('View edit history')).toBeInTheDocument()
    expect(viewEditHistory).toBeInTheDocument()
    expect(viewEditHistory).toHaveAttribute('open')

    await userEvent.click(viewEditHistory)

    const accordionItem = within(viewEditHistory).getByTestId(`edit-history-accordion-item-${mockEditHistories[1].LSN}`)
    expect(accordionItem).toBeInTheDocument()
    expect(accordionItem).toHaveAttribute('data-state', 'open')
  })
})
