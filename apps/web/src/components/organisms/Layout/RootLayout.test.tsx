import { render, within } from '../../../config/TestUtils'
import { userNoRoles } from '../../../__mocks__/session'
import { RootLayout } from './RootLayout'

jest.mock('next/router', () => require('next-router-mock'))

test('Displays NIHR layout & page content', () => {
  const { getByRole, getByText } = render(
    <RootLayout heading="Welcome" user={userNoRoles.user}>
      <div>Page content</div>
    </RootLayout>
  )

  expect(
    within(getByRole('banner')).getByAltText('National Institute for Health and Care Research logo')
  ).toBeInTheDocument()

  // Title
  expect(within(getByRole('banner')).getByRole('heading', { name: 'Welcome', level: 1 }))

  // Page content
  expect(getByText('Page content')).toBeInTheDocument()
})

test('Adds a class to the body to detect js is enabled', () => {
  render(
    <RootLayout user={userNoRoles.user}>
      <h1>Welcome</h1>
    </RootLayout>
  )
  expect(document.body.classList.contains('js-enabled')).toBeTruthy()
})
