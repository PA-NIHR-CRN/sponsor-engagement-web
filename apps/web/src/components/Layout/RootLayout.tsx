import { Roboto } from 'next/font/google'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { HomeIcon, SettingsIcon, SideNav } from '@nihr-ui/frontend'
import type { Session } from 'next-auth'
import { Header } from '../Header/Header'
import { ORGANISATIONS_PAGE } from '../../constants/routes'
import { Roles } from '../../constants/auth'

const primaryFont = Roboto({ weight: ['400', '700'], subsets: ['latin'], display: 'swap', variable: '--font-primary' })

export interface RootLayoutProps {
  children: ReactNode
  heading?: string
  backLink?: ReactNode
  user: Session['user']
}

export function RootLayout({ children, backLink, heading = '', user }: RootLayoutProps) {
  const router = useRouter()
  const [sideNavOpen, setSideNavOpen] = useState(false)

  // Close menu on route changes
  useEffect(() => {
    setSideNavOpen((isOpen) => isOpen && !isOpen)
  }, [router.asPath])

  useEffect(() => {
    document.body.classList.add('js-enabled')
  }, [])

  return (
    <div className={`${primaryFont.variable} font-sans`}>
      <SideNav.Provider open={sideNavOpen} setOpen={setSideNavOpen}>
        <Header heading={heading} user={user} />
        {backLink}
        <SideNav.Panel>
          <SideNav.Link as={Link} href="/" icon={<HomeIcon />}>
            Home
          </SideNav.Link>
          {user?.roles.includes(Roles.ContactManager) ? (
            <SideNav.Link as={Link} href={ORGANISATIONS_PAGE} icon={<SettingsIcon />}>
              Manage sponsor contacts
            </SideNav.Link>
          ) : null}
        </SideNav.Panel>
        <SideNav.Main>{children}</SideNav.Main>
      </SideNav.Provider>
    </div>
  )
}
