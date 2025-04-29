import type { UserOrganisation } from '@prisma/client'
import mockRouter from 'next-router-mock'

import { userNoRoles, userWithSponsorContactRole } from '@/__mocks__/session'
import { render, within } from '@/config/TestUtils'

import { RootLayout } from './RootLayout'

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

test('Displays breadcrumbs', () => {
  mockRouter.asPath = `/studies/121/edit`

  const { getByRole } = render(
    <RootLayout breadcrumbConfig={{ showBreadcrumb: true }} heading="Welcome" user={userNoRoles.user}>
      <div>Page content</div>
    </RootLayout>
  )

  expect(getByRole('link', { name: 'Navigate to All studies page' })).toBeInTheDocument()
  expect(getByRole('link', { name: 'Navigate to Study details page' })).toBeInTheDocument()
})

describe('Displays the correct navigation links for a user who is only a Sponsor Contact', () => {
  test('and is associated with no organisations', () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- test data is not null
    const user = { ...userWithSponsorContactRole.user! }
    user.organisations = []

    const { getByTestId, getByRole } = render(
      <RootLayout heading="Welcome" user={user}>
        <div>Page content</div>
      </RootLayout>
    )

    const navLinksContainer = getByTestId('side-panel')
    expect(within(navLinksContainer).getAllByRole('link')).toHaveLength(1)

    const homeLinkElement = getByRole('link', { name: 'Home' })
    expect(homeLinkElement).toBeInTheDocument()
    expect(within(homeLinkElement).queryByTestId('home-icon')).toBeInTheDocument()
    expect(homeLinkElement).toHaveAttribute('href', '/')

    expect(within(navLinksContainer).queryByTestId('settings-icon')).toBeNull()
    expect(within(navLinksContainer).queryByTestId('group-icon')).toBeNull()
  })

  test('and is associated with one organisation', () => {
    const { getByTestId, getByRole } = render(
      <RootLayout heading="Welcome" user={userWithSponsorContactRole.user}>
        <div>Page content</div>
      </RootLayout>
    )

    const navLinksContainer = getByTestId('side-panel')
    expect(within(navLinksContainer).getAllByRole('link')).toHaveLength(2)

    const homeLinkElement = getByRole('link', { name: 'Home' })
    expect(homeLinkElement).toBeInTheDocument()
    expect(within(homeLinkElement).queryByTestId('home-icon')).toBeInTheDocument()
    expect(homeLinkElement).toHaveAttribute('href', '/')

    const groupLinkElement = getByRole('link', { name: 'Manage sponsor contacts' })
    expect(groupLinkElement).toBeInTheDocument()
    expect(within(groupLinkElement).queryByTestId('group-icon')).toBeInTheDocument()
    expect(groupLinkElement).toHaveAttribute(
      'href',
      `/organisations/${userWithSponsorContactRole.user?.organisations[0].organisationId}`
    )

    expect(within(navLinksContainer).queryByTestId('settings-icon')).toBeNull()
  })

  test('and is associated with multiple organisations', () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- test data is not null
    const user = { ...userWithSponsorContactRole.user! }
    user.organisations = [
      userWithSponsorContactRole.user?.organisations[0],
      { ...userWithSponsorContactRole.user?.organisations[0], id: 2, organisationId: 3534 },
    ] as UserOrganisation[]

    const { getByTestId, getByRole } = render(
      <RootLayout heading="Welcome" user={user}>
        <div>Page content</div>
      </RootLayout>
    )

    const navLinksContainer = getByTestId('side-panel')
    expect(within(navLinksContainer).getAllByRole('link')).toHaveLength(2)

    const homeLinkElement = getByRole('link', { name: 'Home' })
    expect(homeLinkElement).toBeInTheDocument()
    expect(within(homeLinkElement).queryByTestId('home-icon')).toBeInTheDocument()
    expect(homeLinkElement).toHaveAttribute('href', '/')

    const groupLinkElement = getByRole('link', { name: 'Manage sponsor contacts' })
    expect(groupLinkElement).toBeInTheDocument()
    expect(within(groupLinkElement).queryByTestId('group-icon')).toBeInTheDocument()
    expect(groupLinkElement).toHaveAttribute('href', '/organisations')

    expect(within(navLinksContainer).queryByTestId('settings-icon')).toBeNull()
  })
})
