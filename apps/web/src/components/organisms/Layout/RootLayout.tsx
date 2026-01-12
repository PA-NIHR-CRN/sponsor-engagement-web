import { GroupIcon, HomeIcon, SettingsIcon, SideNav } from '@nihr-ui/frontend'
import { logger } from '@nihr-ui/logger'
import { useIdle } from '@uidotdev/usehooks'
import { Roboto } from 'next/font/google'
import Link from 'next/link'
import Router, { useRouter } from 'next/router'
import type { Session } from 'next-auth'
import { useSession } from 'next-auth/react'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'

import { Footer, Header } from '@/components/molecules'
import { CookieBanner } from '@/components/organisms/CookieBanner/CookieBanner'
import { SERVICE_NAME } from '@/constants'
import { CONTACT_MANAGERS_PAGE, ORGANISATIONS_PAGE, SIGN_OUT_PAGE } from '@/constants/routes'
import { isContactManager, isContactManagerAndSponsorContact, isSponsorContact } from '@/utils/auth'

import type { BreadcrumbConfig } from '../Breadcrumbs/Breadcrumbs'
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs'

export const primaryFont = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-primary',
})

export interface RootLayoutProps {
  children: ReactNode
  heading?: string
  backLink?: ReactNode
  user?: Session['user']
  breadcrumbConfig?: BreadcrumbConfig
}

export function RootLayout({ children, backLink, heading = SERVICE_NAME, user, breadcrumbConfig }: RootLayoutProps) {
  const router = useRouter()
  const [sideNavOpen, setSideNavOpen] = useState(false)
  const { data: session } = useSession()
  const activeUser = user ?? session?.user
  const idle = useIdle(session ? session.idleTimeout * 1000 : undefined)
  const userOrganisations = user?.organisations.filter((userOrg) => !userOrg.isDeleted) ?? []
  const groupIconLink =
    userOrganisations.length === 1 ? `${ORGANISATIONS_PAGE}/${userOrganisations[0].organisationId}` : ORGANISATIONS_PAGE

  useEffect(() => {
    if (session && session.error === 'RefreshAccessTokenError') {
      logger.info(`refresh access token request error - logging out`)
      void Router.push(SIGN_OUT_PAGE)
    }
  }, [session])

  useEffect(() => {
    if (idle && session?.idleTimeout) {
      logger.info(`user is idle after ${session.idleTimeout} seconds - logging out`)
      void Router.push(SIGN_OUT_PAGE)
    }
  }, [idle, session])

  // Close menu on route changes
  useEffect(() => {
    setSideNavOpen((isOpen) => isOpen && !isOpen)
  }, [router.asPath])

  useEffect(() => {
    document.body.classList.add('js-enabled')
  }, [])

  return (
    <div className={`${primaryFont.variable} font-sans min-h-screen flex flex-col`}>
      <CookieBanner />
      <SideNav.Provider open={sideNavOpen} setOpen={setSideNavOpen}>
        <Header heading={heading} user={activeUser} />
        <div className="flex flex-1">
          <SideNav.Panel className="flex flex-col" data-testid="side-panel">
            <SideNav.Link as={Link} href="/" icon={<HomeIcon />}>
              Home
            </SideNav.Link>
            {isContactManager(user?.roles ?? []) || isContactManagerAndSponsorContact(user?.roles ?? []) ? (
              <SideNav.Link as={Link} href={ORGANISATIONS_PAGE} icon={<GroupIcon />}>
                Manage sponsor contacts
              </SideNav.Link>
            ) : null}
            {isSponsorContact(user?.roles ?? []) && userOrganisations.length > 0 ? (
              <SideNav.Link as={Link} href={groupIconLink} icon={<GroupIcon />}>
                Manage sponsor contacts
              </SideNav.Link>
            ) : null}
            {isContactManager(user?.roles ?? []) || isContactManagerAndSponsorContact(user?.roles ?? []) ? (
              <SideNav.Link as={Link} href={CONTACT_MANAGERS_PAGE} icon={<SettingsIcon />}>
                Manage contact managers
              </SideNav.Link>
            ) : null}
          </SideNav.Panel>
          <SideNav.Main className="flex-1 overflow-auto">
            <div className="-mt-2 govuk-!-margin-bottom-4">
              {backLink}
              <Breadcrumbs {...breadcrumbConfig} />
            </div>
            {children}
          </SideNav.Main>
        </div>
        <Footer />
      </SideNav.Provider>
    </div>
  )
}
