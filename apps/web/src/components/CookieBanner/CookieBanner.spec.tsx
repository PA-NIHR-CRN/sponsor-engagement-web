import { act } from '@testing-library/react'
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
  const { getByRole, getByText, queryByTestId } = render(<CookieBanner />)

  expect(getByRole('heading', { name: /Cookies on Sponsor Engagement/i })).toBeInTheDocument()
  expect(getByText('We may use some essential cookies to make this service work.')).toBeInTheDocument()
  expect(getByRole('button', { name: /accept additional cookies/i })).toBeInTheDocument()
  expect(getByRole('button', { name: /reject additional cookies/i })).toBeInTheDocument()
  expect(queryByTestId('veiwCookiePolicy')).toBeInTheDocument()

  // Ensure that the confirmation message is not rendered initially
  expect(queryByTestId('confirmation-message')).not.toBeInTheDocument()
})

test('Changes to the confirmation view when accepting cookies', async () => {
  const { getByRole, getByText, getByTestId } = render(<CookieBanner />)

  await userEvent.click(getByRole('button', { name: /accept additional cookies/i }))

  expect(getByTestId('confirmation-message')).toBeInTheDocument()
  expect(getByText(/You’ve accepted additional cookies./)).toBeInTheDocument()

  expect(window.gtag).toHaveBeenLastCalledWith('consent', 'update', {
    ad_storage: 'granted',
    analytics_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
  })
})

test('Changes to the confirmation view when rejecting cookies', async () => {
  const { getByRole, getByText, getByTestId } = render(<CookieBanner />)

  await userEvent.click(getByRole('button', { name: /reject additional cookies/i }))

  expect(getByTestId('confirmation-message')).toBeInTheDocument()
  expect(getByText(/You’ve rejected additional cookies./)).toBeInTheDocument()

  expect(window.gtag).toHaveBeenLastCalledWith('consent', 'update', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })
})

test('Hides the cookie banner when "Hide cookie message" is clicked', async () => {
  const { getByRole, queryByLabelText, getByTestId } = render(<CookieBanner />)

  // Click "Accept additional cookies" to show the confirmation view
  await userEvent.click(getByRole('button', { name: /accept additional cookies/i }))

  // Ensure that the confirmation message is visible
  expect(getByTestId('confirmation-message')).toBeInTheDocument()
  mockedGetCookie.mockReturnValue(SE_GDPR_COOKIE_ACCEPT_VALUE)

  // Click "Hide cookie message" to hide the entire cookie banner
  await userEvent.click(getByRole('button', { name: /hide cookie message/i }))

  // Ensure that the entire cookie banner is no longer visible
  expect(queryByLabelText('Cookies on Sponsor Engagement')).not.toBeInTheDocument()
})

test('Does not render the cookie banner if the GDPR cookie is already set', () => {
  // Mock the getCookie function to return a truthy value to simulate the cookie being set
  mockedGetCookie.mockReturnValue(SE_GDPR_COOKIE_ACCEPT_VALUE)

  const { queryByLabelText } = render(<CookieBanner />)

  // The component should not render the cookie banner
  expect(queryByLabelText('Cookies on Sponsor Engagement')).not.toBeInTheDocument()
})

test('Hides cookie banner on page change if cookie was already set', async () => {
  const { getByRole, queryByLabelText } = render(<CookieBanner />)

  expect(getByRole('heading', { name: 'Cookies on Sponsor Engagement' })).toBeInTheDocument()

  // Mock the getCookie function to return a truthy value to simulate the cookie being set
  mockedGetCookie.mockReturnValue(SE_GDPR_COOKIE_ACCEPT_VALUE)

  await act(() => mockRouter.push('/'))

  expect(queryByLabelText('Cookies on Sponsor Engagement')).not.toBeInTheDocument()
})
