import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { render } from '@/config/TestUtils'

import { EditHistory } from './EditHistory'

const mockEditHistory = [
  {
    id: '1',
    modifiedDate: new Date().toISOString(),
    changes: [],
    leadAdministrationId: 1,
  },
  {
    id: '2',
    modifiedDate: new Date().toISOString(),
    changes: [],
    leadAdministrationId: 1,
  },
]

describe('<EditHistory/>', () => {
  it('should correctly display the default text', async () => {
    render(<EditHistory editHistoryItems={mockEditHistory} leadAdministrationId={null} />)

    const viewEditHistory = screen.getByRole('group')
    expect(within(viewEditHistory).getByText('View edit history')).toBeInTheDocument()
    expect(viewEditHistory).toBeInTheDocument()

    await userEvent.click(viewEditHistory)

    expect(
      within(viewEditHistory).getByTestId(`edit-history-accordion-item-${mockEditHistory[0].id}`)
    ).toBeInTheDocument()
    expect(
      within(viewEditHistory).getByTestId(`edit-history-accordion-item-${mockEditHistory[1].id}`)
    ).toBeInTheDocument()
  })

  it('should return the correct copy if there are no edit history items', async () => {
    render(<EditHistory editHistoryItems={[]} leadAdministrationId={1} />)

    const viewEditHistory = screen.getByRole('group')
    expect(viewEditHistory).toBeInTheDocument()

    await userEvent.click(viewEditHistory)

    expect(within(viewEditHistory).getByText('There is no edit history.')).toBeInTheDocument()
  })

  it('should return the correct copy when there is an error message', async () => {
    render(<EditHistory editHistoryItems={[]} error leadAdministrationId={2} />)

    const viewEditHistory = screen.getByRole('group')
    expect(viewEditHistory).toBeInTheDocument()

    await userEvent.click(viewEditHistory)

    expect(within(viewEditHistory).getByText(`There's been an error fetching edit history.`)).toBeInTheDocument()
  })

  it('should auto expand the relevant item', async () => {
    render(
      <EditHistory editHistoryItems={mockEditHistory} idToAutoExpand={mockEditHistory[1].id} leadAdministrationId={3} />
    )

    const viewEditHistory = screen.getByRole('group')
    expect(within(viewEditHistory).getByText('View edit history')).toBeInTheDocument()
    expect(viewEditHistory).toBeInTheDocument()
    expect(viewEditHistory).toHaveAttribute('open')

    await userEvent.click(viewEditHistory)

    const accordionItem = within(viewEditHistory).getByTestId(`edit-history-accordion-item-${mockEditHistory[1].id}`)
    expect(accordionItem).toBeInTheDocument()
    expect(accordionItem).toHaveAttribute('data-state', 'open')
  })
})
