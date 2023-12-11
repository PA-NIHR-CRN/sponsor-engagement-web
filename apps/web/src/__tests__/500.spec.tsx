import ServiceUnavailable from '../pages/500'
import { render } from '@/config/TestUtils'

test('Displays the 500 page', () => {
  const { getByText, getByRole } = render(ServiceUnavailable.getLayout(<ServiceUnavailable />))

  expect(getByRole('heading', { name: 'Assess progress of studies', level: 1 }))
  expect(getByRole('heading', { name: 'Sorry, there is a problem with the service', level: 2 }))
  expect(getByText('Please contact crn.servicedesk@nihr.ac.uk for further assistance.')).toBeInTheDocument()
})
