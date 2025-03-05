import { GroupsIcons, HomeIcon, SettingsIcon, SideNav } from '@nihr-ui/frontend'
import { logger } from '@nihr-ui/logger'
import { useIdle } from '@uidotdev/usehooks'
import { Roboto } from 'next/font/google'
import Link from 'next/link'
import Router, { useRouter } from 'next/router'
import type { Session } from 'next-auth'
import { useSession } from 'next-auth/react'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'

import { Header } from '@/components/molecules'
import { CookieBanner } from '@/components/organisms/CookieBanner/CookieBanner'
import { SERVICE_NAME } from '@/constants'
import { Roles } from '@/constants/auth'
import { ORGANISATIONS_PAGE, SIGN_OUT_PAGE } from '@/constants/routes'

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
}

export function RootLayout({ children, backLink, heading = SERVICE_NAME, user }: RootLayoutProps) {
  const router = useRouter()
  const [sideNavOpen, setSideNavOpen] = useState(false)
  const { data: session } = useSession()
  const idle = useIdle(session ? session.idleTimeout * 1000 : undefined)
  const isContactManager = user?.roles.includes(Roles.ContactManager)
  const isSponsorContact = user?.roles.includes(Roles.SponsorContact)
  const userOrganisations = user?.organisations.filter((userOrg) => !userOrg.isDeleted) ?? []
  const groupsIconsLink =
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
    <div className={`${primaryFont.variable} font-sans`}>
      <CookieBanner />
      <SideNav.Provider open={sideNavOpen} setOpen={setSideNavOpen}>
        <Header heading={heading} user={user} />
        {backLink}
        <SideNav.Panel>
          <SideNav.Link as={Link} href="/" icon={<HomeIcon />}>
            Home
          </SideNav.Link>
          {isContactManager ? (
            <SideNav.Link as={Link} href={ORGANISATIONS_PAGE} icon={<SettingsIcon />}>
              Manage sponsor contacts
            </SideNav.Link>
          ) : null}
          {isSponsorContact && !isContactManager && userOrganisations.length > 0 ? (
            <SideNav.Link as={Link} href={groupsIconsLink} icon={<GroupsIcons />} />
          ) : null}
        </SideNav.Panel>
        <SideNav.Main>{children}</SideNav.Main>
      </SideNav.Provider>
    </div>
  )
}
