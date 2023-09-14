import { Head, Html, Main, NextScript } from 'next/document'
import { NextSeo } from 'next-seo'

import { PAGE_TITLE } from '@/constants'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="apple-touch-icon" sizes="120x120" href="/assets/images/govuk-apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/assets/images/govuk-apple-touch-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/assets/images/govuk-apple-touch-icon-167x167.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/govuk-apple-touch-icon-180x180.png" />
      </Head>
      <NextSeo title={PAGE_TITLE} />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
