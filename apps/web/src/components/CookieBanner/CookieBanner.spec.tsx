import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { getCookie } from 'cookies-next'
import mockRouter from 'next-router-mock'
import React from 'react'

import { render } from '@/config/TestUtils'
import { SE_GDPR_COOKIE_ACCEPT_VALUE } from '@/constants/cookies'

import { CookieBanner } from './CookieBanner'

// Mock the getCookie and setCookie functions
jest.mock('cookies-next', () => ({
  getCookie: jest.fn(),
  setCookie: jest.fn(),
}))

const mockedGetCookie = jest.mocked(getCookie)

window.gtag = jest.fn()

beforeEach(() => jest.resetAllMocks())

test('Renders the cookie banner selection view', () => {
  render(<CookieBanner />)

  expect(screen.getByRole('heading', { name: /Cookies on Sponsor Engagement/i })).toBeInTheDocument()
  expect(screen.getByText('We may use some essential cookies to make this service work.')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /accept additional cookies/i })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /reject additional cookies/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /View cookie policy/i })).toBeInTheDocument()

  // Ensure that the confirmation message is not rendered initially
  expect(screen.queryByTestId('confirmation-message')).not.toBeInTheDocument()
})

test('Changes to the confirmation view when accepting cookies', async () => {
  render(<CookieBanner />)

  await userEvent.click(screen.getByRole('button', { name: /accept additional cookies/i }))

  expect(screen.getByTestId('confirmation-message')).toBeInTheDocument()
  expect(screen.getByText(/You’ve accepted additional cookies./)).toBeInTheDocument()

  expect(window.gtag).toHaveBeenLastCalledWith('consent', 'update', {
    ad_storage: 'granted',
    analytics_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
  })
})

test('Changes to the confirmation view when rejecting cookies', async () => {
  render(<CookieBanner />)

  await userEvent.click(screen.getByRole('button', { name: /reject additional cookies/i }))

  expect(screen.getByTestId('confirmation-message')).toBeInTheDocument()
  expect(screen.getByText(/You’ve rejected additional cookies./)).toBeInTheDocument()

  expect(screen.getByRole('link', { name: /cookie policy/ })).toHaveAttribute('href', '#cookie-policy')

  expect(window.gtag).toHaveBeenLastCalledWith('consent', 'update', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })
})

test('Hides the cookie banner when "Hide cookie message" is clicked', async () => {
  render(<CookieBanner />)

  // Click "Accept additional cookies" to show the confirmation view
  await userEvent.click(screen.getByRole('button', { name: /accept additional cookies/i }))

  // Ensure that the confirmation message is visible
  expect(screen.getByTestId('confirmation-message')).toBeInTheDocument()
  mockedGetCookie.mockReturnValue(SE_GDPR_COOKIE_ACCEPT_VALUE)

  // Click "Hide cookie message" to hide the entire cookie banner
  await userEvent.click(screen.getByRole('button', { name: /hide cookie message/i }))

  // Ensure that the entire cookie banner is no longer visible
  expect(screen.queryByLabelText('Cookies on Sponsor Engagement')).not.toBeInTheDocument()
})

// test('Hides the cookie banner and redirects to the cookie policy page when "cookie policy" link is clicked', async () => {
//   render(<CookieBanner  />)

//   await userEvent.click(screen.getByRole('button', { name: /accept additional cookies/i }))
//   mockedGetCookie.mockReturnValue(SE_GDPR_COOKIE_ACCEPT_VALUE)

//   await userEvent.click(screen.getByRole('link', { name: /cookie policy/i }))

//   expect(screen.queryByLabelText('Cookies on Find, Recruit and Follow-Up')).not.toBeInTheDocument()

//   expect(mockRouter.asPath).toBe('/cookie-policy')
// })

test('Does not render the cookie banner if the GDPR cookie is already set', () => {
  // Mock the getCookie function to return a truthy value to simulate the cookie being set
  mockedGetCookie.mockReturnValue(SE_GDPR_COOKIE_ACCEPT_VALUE)

  render(<CookieBanner />)

  // The component should not render the cookie banner
  expect(screen.queryByLabelText('Cookies on Sponsor Engagement')).not.toBeInTheDocument()
})

test('Hides cookie banner on page change if cookie was already set', async () => {
  render(<CookieBanner />)

  expect(screen.getByRole('heading', { name: 'Cookies on Sponsor Engagement' })).toBeInTheDocument()

  // Mock the getCookie function to return a truthy value to simulate the cookie being set
  mockedGetCookie.mockReturnValue(SE_GDPR_COOKIE_ACCEPT_VALUE)

  await act(() => mockRouter.push('/'))

  expect(screen.queryByLabelText('Cookies on Sponsor Engagement')).not.toBeInTheDocument()
})

test('Dispatches custom event when cookie settings are changed', async () => {
  const dispatchEventSpy = jest.spyOn(document, 'dispatchEvent')

  render(<CookieBanner />)

  // Accept cookies
  await userEvent.click(screen.getByRole('button', { name: /accept additional cookies/i }))
  expect((dispatchEventSpy.mock.calls[0][0] as CustomEventInit).detail).toEqual(1)
})
