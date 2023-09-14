import { render, screen, within } from '@/config/test-utils'

import { RootLayout } from './RootLayout'

jest.mock('next/router', () => require('next-router-mock'))

export const assertRootLayout = (heading: string) => {
  const { getByRole } = screen

  // Logo
  expect(
    within(getByRole('banner')).getByAltText('National Institute for Health and Care Research logo')
  ).toBeInTheDocument()

  // Title
  expect(within(getByRole('banner')).getByRole('heading', { name: heading, level: 1 }))
}

test('Displays NIHR layout & page content', () => {
  render(
    <RootLayout heading="Welcome">
      <div>Page content</div>
    </RootLayout>
  )

  assertRootLayout('Welcome')

  // Page content
  expect(screen.getByText('Page content')).toBeInTheDocument()
})

test('Adds a class to the body to detect js is enabled', () => {
  render(
    <RootLayout>
      <h1>Welcome</h1>
    </RootLayout>
  )
  expect(document.body.classList.contains('js-enabled')).toBeTruthy()
})
