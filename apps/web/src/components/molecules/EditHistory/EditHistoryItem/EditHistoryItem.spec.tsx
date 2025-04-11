import { Accordion } from '@nihr-ui/frontend'
import userEvent from '@testing-library/user-event'
import { LeadAdministrationId } from 'shared-utilities/src/utils/lead-administration-id'

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
  leadAdministrationId: LeadAdministrationId.England,
  changes: [
    {
      id: '3454334',
      afterValue: '120',
      beforeValue: '30',
      columnChanged: 'UkRecruitmentTarget',
    },
  ],
}
const mockProposedEditHistory2 = {
  LSN: '9867557',
  modifiedDate: '2024-11-10T00:00:00.000Z',
  userEmail: 'sponsor.contact2@nihr.ac.uk',
  leadAdministrationId: LeadAdministrationId.Scotland,
  changes: [
    {
      id: '3454334',
      afterValue: '121',
      beforeValue: '31',
      columnChanged: 'UkRecruitmentTarget',
    },
  ],
}
const mockProposedEditHistory3 = {
  LSN: '9867377',
  modifiedDate: '2024-10-11T00:00:00.000Z',
  userEmail: 'sponsor.contact3@nihr.ac.uk',
  leadAdministrationId: LeadAdministrationId.Wales,
  changes: [
    {
      id: '345464',
      afterValue: '123',
      beforeValue: '29',
      columnChanged: 'UkRecruitmentTarget',
    },
  ],
}
const mockProposedEditHistory4 = {
  LSN: '9867687',
  modifiedDate: '2024-10-12T00:00:00.000Z',
  userEmail: 'sponsor.contact4@nihr.ac.uk',
  leadAdministrationId: LeadAdministrationId.NorthernIreland,
  changes: [
    {
      id: '3114334',
      afterValue: '125',
      beforeValue: '35',
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
          leadAdministrationId={null}
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
          leadAdministrationId={null}
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

  it('should correctly display an indirect change by an England lead admin', async () => {
    const { getByRole, getAllByText } = render(
      <Accordion type="multiple">
        <EditHistoryItem
          changes={mockProposedEditHistory.changes}
          id={mockProposedEditHistory.LSN}
          leadAdministrationId={mockProposedEditHistory.leadAdministrationId}
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

  it('should correctly display an indirect change by a Scotland lead admin', async () => {
    const { getByRole, getAllByText } = render(
      <Accordion type="multiple">
        <EditHistoryItem
          changes={mockProposedEditHistory2.changes}
          id={mockProposedEditHistory2.LSN}
          leadAdministrationId={mockProposedEditHistory2.leadAdministrationId}
          modifiedDate={mockProposedEditHistory2.modifiedDate}
        />
      </Accordion>
    )

    const accordionTrigger = getByRole('button', {
      name: 'Updated on 10 November 2024 Change made by Scotland Admin',
    })
    expect(accordionTrigger).toBeInTheDocument()
    await userEvent.click(accordionTrigger)

    expect(getAllByText(mockEditHistoryChangeText)).toHaveLength(mockProposedEditHistory.changes.length)
  })

  it('should correctly display an indirect change by a Wales lead admin', async () => {
    const { getByRole, getAllByText } = render(
      <Accordion type="multiple">
        <EditHistoryItem
          changes={mockProposedEditHistory3.changes}
          id={mockProposedEditHistory3.LSN}
          leadAdministrationId={mockProposedEditHistory3.leadAdministrationId}
          modifiedDate={mockProposedEditHistory3.modifiedDate}
        />
      </Accordion>
    )

    const accordionTrigger = getByRole('button', {
      name: 'Updated on 11 October 2024 Change made by Health and Care Research Wales Admin',
    })
    expect(accordionTrigger).toBeInTheDocument()
    await userEvent.click(accordionTrigger)

    expect(getAllByText(mockEditHistoryChangeText)).toHaveLength(mockProposedEditHistory.changes.length)
  })

  it('should correctly display an indirect change by a Northern Ireland lead admin', async () => {
    const { getByRole, getAllByText } = render(
      <Accordion type="multiple">
        <EditHistoryItem
          changes={mockProposedEditHistory4.changes}
          id={mockProposedEditHistory4.LSN}
          leadAdministrationId={mockProposedEditHistory4.leadAdministrationId}
          modifiedDate={mockProposedEditHistory4.modifiedDate}
        />
      </Accordion>
    )

    const accordionTrigger = getByRole('button', {
      name: 'Updated on 12 October 2024 Change made by NI Portfolio Admin',
    })
    expect(accordionTrigger).toBeInTheDocument()
    await userEvent.click(accordionTrigger)

    expect(getAllByText(mockEditHistoryChangeText)).toHaveLength(mockProposedEditHistory.changes.length)
  })
})
