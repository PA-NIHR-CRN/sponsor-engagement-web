import type { SessionContextValue } from 'next-auth/react'

export const user = {
  name: 'Test User',
  email: 'testuser@nihr.ac.uk',
  image: null,
} as const

const expires = '123'

const update = jest.fn()

export const authenticatedSessionMock: SessionContextValue = {
  status: 'authenticated',
  data: {
    user,
    expires,
  },
  update,
}

export const unauthenticatedSessionMock: SessionContextValue = {
  status: 'unauthenticated',
  data: null,
  update,
}
