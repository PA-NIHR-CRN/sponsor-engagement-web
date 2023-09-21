import * as Collapsible from '@radix-ui/react-collapsible'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useClickAway } from 'react-use'

function Logo() {
  return (
    <Link
      aria-label="Go to the Find, Recruit and Follow-up homepage"
      className={clsx('govuk-header__link', 'inline-block')}
      href="/"
    >
      <span className="govuk-header__logotype">
        <div className="flex items-center gap-2">
          <Image
            alt="National Institute for Health and Care Research logo"
            height={18}
            src="/assets/logos/nihr.svg"
            width={154}
          />
        </div>
      </span>
    </Link>
  )
}

function MenuButton({ navOpen }: { navOpen: boolean }) {
  return (
    <div className="flex items-center">
      <Link
        className="js-disabled-show govuk-button govuk-body mb-0 ml-1 hidden items-center justify-end gap-2 bg-white stroke-navy-100 text-navy-100 underline shadow-none focus:bg-[var(--focus)] focus:stroke-black focus:text-black active:top-0"
        href="/browse"
      >
        Menu
      </Link>
      <Collapsible.Trigger asChild>
        <button
          aria-controls="navigation-menu"
          aria-expanded={navOpen}
          aria-label={`${navOpen ? 'Hide' : 'Show'} navigation menu`}
          className={clsx(
            'js-disabled-hide govuk-button govuk-body mb-0 flex items-center justify-end gap-2 shadow-none focus:bg-[var(--focus)] focus:stroke-black focus:text-black active:top-0',
            {
              'mt-[45px] bg-[var(--nav-bg)] stroke-white pb-[52px] text-white': navOpen,
              'bg-white stroke-navy-100 text-navy-100': !navOpen,
            }
          )}
          type="button"
        >
          <span>Menu</span>
          <svg fill="none" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>
      </Collapsible.Trigger>
    </div>
  )
}

function MenuPanel() {
  return (
    <Collapsible.Content
      aria-labelledby="navigation-menu-heading"
      asChild
      className={clsx('js-disabled-show min-h-[var(--nav-height)] w-full bg-[var(--nav-bg)] text-white')}
      id="navigation-menu"
    >
      <nav>
        <h2 className="govuk-visually-hidden" id="navigation-menu-heading">
          Navigation menu
        </h2>
        <div className="govuk-header__container--full-width">
          <div className="govuk-grid-row py-5 lg:py-8">links</div>
        </div>
      </nav>
    </Collapsible.Content>
  )
}

export function Header({ heading }: { heading: string }) {
  const router = useRouter()
  const headerRef = useRef(null)
  const [navOpen, setNavOpen] = useState(false)

  // Close menu on route changes
  useEffect(() => {
    setNavOpen((isOpen) => isOpen && !isOpen)
  }, [router.asPath])

  // Close menu when clicking outside of the header
  useClickAway(headerRef, () => {
    setNavOpen(false)
  })

  return (
    <>
      <a className="govuk-skip-link" href="#main-content">
        Skip to main content
      </a>
      <Collapsible.Root onOpenChange={setNavOpen} open={navOpen}>
        <header
          className={clsx('govuk-header flex flex-col border-b border-grey-60 bg-[var(--header-bg)]')}
          ref={headerRef}
          role="banner"
        >
          <div
            className={clsx(
              'govuk-header__container govuk-header__container--full-width',
              'mb-0 w-full border-b-0 pt-0'
            )}
          >
            <div className="flex h-[var(--header-height)] items-center justify-between">
              <Logo />
              <h1>{heading}</h1>
              <MenuButton navOpen={navOpen} />
            </div>
          </div>
          <MenuPanel />
        </header>
      </Collapsible.Root>
    </>
  )
}
