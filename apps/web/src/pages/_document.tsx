import { Head, Html, Main, NextScript } from 'next/document'
import { NextSeo } from 'next-seo'
import { SERVICE_NAME } from '../constants'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link href="/assets/images/govuk-apple-touch-icon.png" rel="apple-touch-icon" sizes="120x120" />
        <link href="/assets/images/govuk-apple-touch-icon-152x152.png" rel="apple-touch-icon" sizes="152x152" />
        <link href="/assets/images/govuk-apple-touch-icon-167x167.png" rel="apple-touch-icon" sizes="167x167" />
        <link href="/assets/images/govuk-apple-touch-icon-180x180.png" rel="apple-touch-icon" sizes="180x180" />
      </Head>
      <NextSeo title={SERVICE_NAME} />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
