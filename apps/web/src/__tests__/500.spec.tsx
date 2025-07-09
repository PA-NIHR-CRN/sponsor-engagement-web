import { render } from '@/config/TestUtils'

import ServiceUnavailable from '../pages/500'

test('Displays the 500 page', () => {
  const { getByRole, getByTestId } = render(ServiceUnavailable.getLayout(<ServiceUnavailable />))

  expect(getByRole('heading', { name: 'Assess progress of studies', level: 1 }))
  expect(getByRole('heading', { name: 'Sorry, there is a problem with the service', level: 2 }))
  expect(getByTestId('ErrorContactForAssitance')).toBeInTheDocument()
})
