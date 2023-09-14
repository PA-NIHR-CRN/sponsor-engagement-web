import { render } from '@/config/test-utils'
import PageNotFound from '@/pages/404'

test('Displays the 404 page', () => {
  const { getByText, getByRole } = render(PageNotFound.getLayout(<PageNotFound />))

  expect(getByRole('heading', { name: 'Page not found', level: 1 }))
  expect(getByText('If you typed the web address, check it is correct.')).toBeInTheDocument()
  expect(getByText('If you pasted the web address, check you copied the entire address.')).toBeInTheDocument()
  expect(
    getByText(/Please try again later or contact the Find, Recruit and Follow-up Central Team on/)
  ).toBeInTheDocument()
  expect(getByText('frfteam@nihr.ac.uk')).toHaveAttribute('href', 'mailto:frfteam@nihr.ac.uk')
})
