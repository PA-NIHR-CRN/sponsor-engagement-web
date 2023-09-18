import { Roboto } from 'next/font/google'
import { ReactNode, useEffect } from 'react'

import { Header } from '../Header/Header'

const primaryFont = Roboto({ weight: ['400', '700'], subsets: ['latin'], display: 'swap', variable: '--font-primary' })

export type RootLayoutProps = {
  children: ReactNode
  heading?: string
  backLink?: ReactNode
}

export function RootLayout({ children, backLink, heading = 'Find, Recruit and Follow-up' }: RootLayoutProps) {
  useEffect(() => {
    document.body.classList.add('js-enabled')
  }, [])

  return (
    <div className={`${primaryFont.variable} font-sans`}>
      <Header heading={heading} />
      {backLink}
      <main id="main-content" className="govuk-main-wrapper" role="main">
        {children}
      </main>
    </div>
  )
}
