import { Head, Html, Main, NextScript } from 'next/document'
import Script from 'next/script'
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
        <Script id="gtm" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);}
         
          gtag('consent', 'default', {
            'ad_storage': 'denied',
            'analytics_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied'
          });
          gtag('js', new Date()); gtag('config', '${process.env.NEXT_PUBLIC_GTM_ID}');

          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtag/js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');

        `}
        </Script>
      </Head>
      <NextSeo title={SERVICE_NAME} />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
