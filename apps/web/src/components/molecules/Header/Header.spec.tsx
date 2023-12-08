import userEvent from '@testing-library/user-event'
import { SideNavProvider } from '@nihr-ui/frontend'
import { render, within } from '../../../config/TestUtils'
import { userNoRoles } from '../../../__mocks__/session'
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

  // Settings menu trigger
  const settingsBtn = getByRole('button', { name: 'Settings menu' })
  expect(settingsBtn).toHaveAttribute('aria-expanded', 'false')
  expect(settingsBtn).toHaveAttribute('aria-haspopup', 'menu')
  expect(settingsBtn).toHaveClass('no-js:hidden')

  // Non-js logout link
  const logoutLink = getByRole('link', { name: 'Logout' })
  expect(logoutLink).toHaveAttribute('href', '/auth/signout')
  expect(logoutLink).toHaveClass('js:hidden')
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

test('Clicking the settings button icon toggles the settings menu open', async () => {
  const { getByRole, queryByRole } = render(
    <SideNavProvider>
      <Header heading="Test Heading" user={userNoRoles.user} />
    </SideNavProvider>
  )

  const trigger = getByRole('button', { name: 'Settings menu' })
  const closedMenu = queryByRole('menu', { name: 'Settings menu' })

  expect(trigger).toHaveAttribute('aria-expanded', 'false')
  expect(closedMenu).not.toBeInTheDocument()

  await userEvent.click(trigger)

  expect(trigger).toHaveAttribute('aria-expanded', 'true')
  const openMenu = getByRole('menu', { name: 'Settings menu' })
  expect(within(openMenu).getAllByRole('menuitem')).toHaveLength(1)
  expect(within(openMenu).getByRole('menuitem', { name: 'Logout' })).toBeInTheDocument()
})
