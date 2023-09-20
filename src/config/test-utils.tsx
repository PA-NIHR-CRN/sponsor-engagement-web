/* eslint-disable import/named, import/export */
import { render, RenderOptions } from '@testing-library/react'
import React, { ReactElement, useState } from 'react'

import { SideNav } from '@/components/SideNav/SideNav'

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const [sideNavOpen, setSideNavOpen] = useState(false)

  return (
    <SideNav.Provider open={sideNavOpen} setOpen={setSideNavOpen}>
      <>{children}</>
    </SideNav.Provider>
  )
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
