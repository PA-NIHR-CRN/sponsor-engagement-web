import { render, within } from '@testing-library/react'
import { RootLayout } from './RootLayout'

// eslint-disable-next-line @typescript-eslint/no-unsafe-return -- no types
jest.mock('next/router', () => require('next-router-mock'))

test('Displays NIHR layout & page content', () => {
  const { getByRole, getByText } = render(
    <RootLayout heading="Welcome">
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
    <RootLayout>
      <h1>Welcome</h1>
    </RootLayout>
  )
  expect(document.body.classList.contains('js-enabled')).toBeTruthy()
})
