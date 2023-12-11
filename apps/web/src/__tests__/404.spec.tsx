import PageNotFound from '../pages/404'
import { render } from '@/config/TestUtils'

test('Displays the 404 page', () => {
  const { getByText, getByRole } = render(PageNotFound.getLayout(<PageNotFound />))

  expect(getByRole('heading', { name: 'Assess progress of studies', level: 1 }))
  expect(getByRole('heading', { name: 'Page not found', level: 2 }))
  expect(getByText('If you typed the web address, check it is correct.')).toBeInTheDocument()
  expect(getByText('If you pasted the web address, check you copied the entire address.')).toBeInTheDocument()
  expect(getByText('Please contact crn.servicedesk@nihr.ac.uk for further assistance.')).toBeInTheDocument()
})
