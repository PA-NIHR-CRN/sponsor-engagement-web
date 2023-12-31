import type { RenderOptions } from '@testing-library/react'
// eslint-disable-next-line no-restricted-imports -- allowed
import { render } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import type { ReactElement } from 'react'
import React from 'react'

import { userNoRoles } from '../__mocks__/session'

function AllTheProviders({ children }: { children: React.ReactNode }) {
  return <SessionProvider session={userNoRoles}>{children}</SessionProvider>
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// eslint-disable-next-line no-restricted-imports -- allowed
export * from '@testing-library/react'
export { customRender as render }
