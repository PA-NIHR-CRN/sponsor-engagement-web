import '@nihr-ui/frontend/globals.scss'
import 'public/assets/styles/one-login-header.css'
import 'public/assets/styles/nihr.govuk.css'
import 'public/assets/styles/tweaks.css'

import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import type { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import type { ReactElement, ReactNode } from 'react'

import { primaryFont, RootLayout } from '../components/organisms'

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement, props: P) => ReactNode
}

type AppPropsWithLayout = AppProps<{
  session: Session
  user: Session['user']
  heading: string
  page?: string
}> & {
  Component: NextPageWithLayout
}

function App({ Component, pageProps }: AppPropsWithLayout) {
  const { user, session } = pageProps

  // Use the layout defined at the page level, if available
  const getLayout =
    Component.getLayout ??
    ((page) => (
      <RootLayout heading={pageProps.heading} user={user}>
        {page}
      </RootLayout>
    ))

  return (
    <SessionProvider session={session}>
        <style global jsx>
          {`
          html {
            font-family: ${primaryFont.style.fontFamily};
          `}
        </style>
        {getLayout(<Component {...pageProps} />, pageProps)}
    </SessionProvider>
  )
}

export default App
