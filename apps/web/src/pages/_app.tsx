import 'ui/globals.scss'

import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'
import type { ReactElement, ReactNode } from 'react'
import { RootLayout } from '../components/Layout/RootLayout'

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement, props: P) => ReactNode
}

type AppPropsWithLayout = AppProps<{
  heading: string
  page?: string
}> & {
  Component: NextPageWithLayout
}

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => <RootLayout heading={pageProps.heading}>{page}</RootLayout>)

  return getLayout(
    <>
      <DefaultSeo description="Find, Recruit and Follow-up service." title="Find, Recruit and Follow-up" />
      <Component {...pageProps} />
    </>,
    pageProps
  )
}

export default App
