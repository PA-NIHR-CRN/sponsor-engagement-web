import clsx from 'clsx'
import Image from 'next/image'
import { useRef } from 'react'
import { Logo, SideNav, SettingsIcon } from '@nihr-ui/frontend'
import { useSession } from 'next-auth/react'
import { HeaderTitle } from './Title'

export function Header({ heading }: { heading: string }) {
  const headerRef = useRef(null)
  const { data: session } = useSession()

  return (
    <>
      <a className="govuk-skip-link" href="#main-content">
        Skip to main content
      </a>
      <header
        className={clsx('govuk-header flex flex-col border-b border-grey-60 bg-[var(--header-bg)]')}
        ref={headerRef}
        role="banner"
      >
        <div
          className={clsx('govuk-header__container govuk-header__container--full-width', 'mb-0 w-full border-b-0 pt-0')}
        >
          <div className="flex h-[var(--header-height)] items-center justify-between">
            <div className="relative flex items-center">
              <SideNav.Trigger />
              <Header.Title>{heading}</Header.Title>
            </div>
            <div className="flex items-center justify-center">
              <span className="hidden text-sm md:block">{session?.user?.email}</span>
              <button
                aria-controls="menu--1"
                aria-haspopup="true"
                aria-label="Settings menu"
                className="ml-3 hidden text-white md:block"
                id="menu-button--menu"
                type="button"
              >
                <SettingsIcon />
              </button>
              <Logo.Link>
                <Logo.Image as={Image} src="/assets/logos/nihr.svg" />
              </Logo.Link>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

Header.Title = HeaderTitle
