import { render } from '@/config/TestUtils'

import PageNotFound from '../pages/404'

test('Displays the 404 page', () => {
  const { getByText, getByRole, getByTestId } = render(PageNotFound.getLayout(<PageNotFound />))

  expect(getByRole('heading', { name: 'Assess progress of studies', level: 1 }))
  expect(getByRole('heading', { name: 'Page not found', level: 2 }))
  expect(getByText('If you typed the web address, check it is correct.')).toBeInTheDocument()
  expect(getByText('If you pasted the web address, check you copied the entire address.')).toBeInTheDocument()
  expect(getByTestId('PageNotFoundContactForAssistance')).toBeInTheDocument()
})
