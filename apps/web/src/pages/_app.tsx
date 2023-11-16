import '@nihr-ui/frontend/globals.scss'

import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import type { ReactElement, ReactNode } from 'react'
import type { Session } from 'next-auth'
import { RootLayout, primaryFont } from '../components/organisms'

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement, props: P) => ReactNode
}

type AppPropsWithLayout = AppProps<{
  user: Session['user']
  heading: string
  page?: string
}> & {
  Component: NextPageWithLayout
}

function App({ Component, pageProps }: AppPropsWithLayout) {
  const { user } = pageProps

  // Use the layout defined at the page level, if available
  const getLayout =
    Component.getLayout ??
    ((page) => (
      <RootLayout heading={pageProps.heading} user={user}>
        {page}
      </RootLayout>
    ))

  return (
    <>
      <style global jsx>
        {`
        html {
          font-family: ${primaryFont.style.fontFamily};
        `}
      </style>
      {getLayout(<Component {...pageProps} />, pageProps)}
    </>
  )
}

export default App
