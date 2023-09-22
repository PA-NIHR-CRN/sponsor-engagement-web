import '@nihr-ui/frontend/globals.scss'

import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import type { ReactElement, ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import type { Session } from 'next-auth'
import { RootLayout } from '../components/Layout/RootLayout'

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement, props: P) => ReactNode
}

type AppPropsWithLayout = AppProps<{
  session: Session
  heading: string
  page?: string
}> & {
  Component: NextPageWithLayout
}

function App({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => <RootLayout heading={pageProps.heading}>{page}</RootLayout>)

  return <SessionProvider session={session}>{getLayout(<Component {...pageProps} />, pageProps)}</SessionProvider>
}

export default App
