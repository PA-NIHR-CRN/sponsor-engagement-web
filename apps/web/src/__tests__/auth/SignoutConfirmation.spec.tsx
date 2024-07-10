import { NextSeo } from 'next-seo'

import { render } from '@/config/TestUtils'
import SignoutConfirmation from '@/pages/auth/signout/confirmation'

jest.mock('next-auth/next')
jest.mock('next-seo')

describe('Sign out confirmation', () => {
  test('shows content and a sign in link', () => {
    const { getByRole, getByText } = render(<SignoutConfirmation />)

    expect(NextSeo).toHaveBeenCalledWith({ title: 'You are signed out' }, {})
    expect(getByRole('heading', { level: 2, name: 'You are signed out' })).toBeInTheDocument()
    expect(getByText('Please sign in to access this application.')).toBeInTheDocument()
    expect(getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/auth/signin')
  })
})
