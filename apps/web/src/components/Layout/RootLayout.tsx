import { Roboto } from 'next/font/google'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { HomeIcon, SideNav } from '@nihr-ui/frontend'
import type { User } from 'next-auth'
import { Header } from '../Header/Header'

const primaryFont = Roboto({ weight: ['400', '700'], subsets: ['latin'], display: 'swap', variable: '--font-primary' })

export interface RootLayoutProps {
  children: ReactNode
  heading?: string
  backLink?: ReactNode
  emailAddress: User['email']
}

export function RootLayout({ children, backLink, heading = '', emailAddress }: RootLayoutProps) {
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
        <Header emailAddress={emailAddress} heading={heading} />
        {backLink}
        <SideNav.Panel>
          <SideNav.Link as={Link} href="/" icon={<HomeIcon />}>
            Home
          </SideNav.Link>
        </SideNav.Panel>
        <SideNav.Main>{children}</SideNav.Main>
      </SideNav.Provider>
    </div>
  )
}
