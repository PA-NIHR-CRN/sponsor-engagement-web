import { render } from '@testing-library/react'
import ServiceUnavailable from '../pages/500'

test('Displays the 500 page', () => {
  const { getByText, getByRole } = render(ServiceUnavailable.getLayout(<ServiceUnavailable />))

  expect(getByRole('heading', { name: 'Assess progress of studies', level: 1 }))
  expect(getByRole('heading', { name: 'Sorry, there is a problem with the service', level: 2 }))
  expect(
    getByText(/Please try again later or contact the Find, Recruit and Follow-up Central Team on/)
  ).toBeInTheDocument()
  expect(getByText('frfteam@nihr.ac.uk')).toHaveAttribute('href', 'mailto:frfteam@nihr.ac.uk')
})
