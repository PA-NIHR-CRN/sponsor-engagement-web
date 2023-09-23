import '@nihr-ui/frontend/globals.scss'

import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import type { ReactElement, ReactNode } from 'react'
import type { User } from 'next-auth'
import { RootLayout } from '../components/Layout/RootLayout'

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement, props: P) => ReactNode
}

type AppPropsWithLayout = AppProps<{
  emailAddress: User['email']
  heading: string
  page?: string
}> & {
  Component: NextPageWithLayout
}

function App({ Component, pageProps }: AppPropsWithLayout) {
  const { emailAddress } = pageProps

  // Use the layout defined at the page level, if available
  const getLayout =
    Component.getLayout ??
    ((page) => (
      <RootLayout emailAddress={emailAddress} heading={pageProps.heading}>
        {page}
      </RootLayout>
    ))

  return getLayout(<Component {...pageProps} />, pageProps)
}

export default App
