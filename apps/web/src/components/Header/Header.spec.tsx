import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import { SideNavProvider } from '@nihr-ui/frontend'
import { userNoRoles } from '../../__mocks__/session'
import { Header } from './Header'

test('Displays the header', () => {
  const { getByText, getByRole, getByAltText } = render(
    <SideNavProvider>
      <Header heading="Test Heading" user={userNoRoles.user} />
    </SideNavProvider>
  )

  // Skip link
  expect(getByText('Skip to main content')).toHaveAttribute('href', '#main-content')

  // Logo link
  expect(
    getByRole('heading', {
      name: 'Test Heading',
      level: 1,
    })
  ).toBeVisible()

  // Logo image
  const logo = getByAltText('National Institute for Health and Care Research logo')
  expect(logo).toBeInTheDocument()
  expect(logo).toHaveAttribute('height', '18')
  expect(logo).toHaveAttribute('width', '154')

  // Menu trigger button
  expect(getByRole('button', { name: 'Show navigation menu' })).toBeInTheDocument()

  // Email Address
  expect(getByText(userNoRoles.user?.email ?? '')).toBeInTheDocument()
})

test('Clicking the navigation menu button toggles the button an open state', async () => {
  const { getByRole, queryByRole } = render(
    <SideNavProvider>
      <Header heading="Test Heading" user={userNoRoles.user} />
    </SideNavProvider>
  )

  const trigger = getByRole('button', { name: 'Show navigation menu' })
  const closedMenu = queryByRole('navigation', { name: 'Navigation menu' })

  expect(trigger).toHaveAttribute('aria-expanded', 'false')
  expect(closedMenu).not.toBeInTheDocument()

  await userEvent.click(trigger)

  expect(trigger).toHaveAttribute('aria-expanded', 'true')
})
