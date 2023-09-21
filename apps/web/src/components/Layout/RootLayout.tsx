import { Roboto } from 'next/font/google'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { HomeIcon } from 'ui/components/Icons/HomeIcon'
import { SideNav } from 'ui/components/SideNav/SideNav'
import { Header } from '../Header/Header'

const primaryFont = Roboto({ weight: ['400', '700'], subsets: ['latin'], display: 'swap', variable: '--font-primary' })

export interface RootLayoutProps {
  children: ReactNode
  heading?: string
  backLink?: ReactNode
}

export function RootLayout({ children, backLink, heading = '' }: RootLayoutProps) {
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
        <Header heading={heading} />
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
