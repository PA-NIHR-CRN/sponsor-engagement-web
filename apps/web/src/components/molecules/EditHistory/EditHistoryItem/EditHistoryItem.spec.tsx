import { Accordion } from '@nihr-ui/frontend'
import userEvent from '@testing-library/user-event'

import { render } from '@/config/TestUtils'
import { StudyUpdateType } from '@/constants'

import { EditHistoryItem } from './EditHistoryItem'

const mockEditHistoryChangeText = 'Mock edit history change text'
jest.mock('../EditHistoryChangeText/EditHistoryChangeText', () => ({
  EditHistoryChangeText: () => mockEditHistoryChangeText,
}))

const mockProposedEditHistory = {
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
  ],
}

describe('<EditHistoryItem/>', () => {
  it('should correctly display a proposed change', async () => {
    const { getByRole, getAllByText } = render(
      <Accordion type="multiple">
        <EditHistoryItem
          changes={mockProposedEditHistory.changes}
          id={mockProposedEditHistory.LSN}
          modifiedDate={mockProposedEditHistory.modifiedDate}
          studyUpdateType={StudyUpdateType.Proposed}
          userEmail={mockProposedEditHistory.userEmail}
        />
      </Accordion>
    )

    const accordionTrigger = getByRole('button', {
      name: `Updated on 10 October 2024 Proposed change submitted by ${mockProposedEditHistory.userEmail}`,
    })
    expect(accordionTrigger).toBeInTheDocument()
    await userEvent.click(accordionTrigger)

    expect(getAllByText(mockEditHistoryChangeText)).toHaveLength(mockProposedEditHistory.changes.length)
  })

  it('should correctly display a direct change', async () => {
    const { getByRole, getAllByText } = render(
      <Accordion type="multiple">
        <EditHistoryItem
          changes={mockProposedEditHistory.changes}
          id={mockProposedEditHistory.LSN}
          modifiedDate={mockProposedEditHistory.modifiedDate}
          studyUpdateType={StudyUpdateType.Direct}
          userEmail={mockProposedEditHistory.userEmail}
        />
      </Accordion>
    )

    const accordionTrigger = getByRole('button', {
      name: `Updated on 10 October 2024 Change made by ${mockProposedEditHistory.userEmail}`,
    })
    expect(accordionTrigger).toBeInTheDocument()
    await userEvent.click(accordionTrigger)

    expect(getAllByText(mockEditHistoryChangeText)).toHaveLength(mockProposedEditHistory.changes.length)
  })

  it('should correctly display an indirect change', async () => {
    const { getByRole, getAllByText } = render(
      <Accordion type="multiple">
        <EditHistoryItem
          changes={mockProposedEditHistory.changes}
          id={mockProposedEditHistory.LSN}
          modifiedDate={mockProposedEditHistory.modifiedDate}
        />
      </Accordion>
    )

    const accordionTrigger = getByRole('button', {
      name: 'Updated on 10 October 2024 Change made by RDN',
    })
    expect(accordionTrigger).toBeInTheDocument()
    await userEvent.click(accordionTrigger)

    expect(getAllByText(mockEditHistoryChangeText)).toHaveLength(mockProposedEditHistory.changes.length)
  })
})
