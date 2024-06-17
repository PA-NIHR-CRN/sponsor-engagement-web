import { getCookie, setCookie } from 'cookies-next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { MouseEventHandler } from 'react'
import { useEffect, useRef, useState } from 'react'

import {
  COOKIE_SETTINGS_CHANGE_EVENT,
  SE_GDPR_COOKIE_ACCEPT_VALUE,
  SE_GDPR_COOKIE_NAME,
  SE_GDPR_COOKIE_REJECT_VALUE,
} from '@/constants/cookies'
import { getGDPRCookieExpiryDate } from '@/utils/date'

enum CookieBannerView {
  Hidden,
  Selection,
  Accepted,
  Rejected,
}

export function CookieBanner() {
  const [view, setView] = useState(CookieBannerView.Hidden)

  const regionRef = useRef<HTMLDivElement>(null)

  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (url.includes('?change-settings=1')) {
        setView(CookieBannerView.Selection)
        regionRef.current?.focus()
      } else {
        // Hide banner after navigating away from cookie policy page
        const isCookieSet = Boolean(getCookie(SE_GDPR_COOKIE_NAME))
        if (view === CookieBannerView.Selection && isCookieSet) {
          setView(CookieBannerView.Hidden)
        }
      }
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router, view])

  useEffect(() => {
    const isCookieSet = Boolean(getCookie(SE_GDPR_COOKIE_NAME))

    // Set initial visibility on client
    if (view === CookieBannerView.Hidden && !isCookieSet) {
      setView(CookieBannerView.Selection)
    }

    // Set focus on confirmation screen
    if (view === CookieBannerView.Accepted || view === CookieBannerView.Rejected) {
      regionRef.current?.focus()
    }

    // Set focus after clicking "change settings"
    if (view === CookieBannerView.Selection && isCookieSet) {
      regionRef.current?.focus()
    }
  }, [view])

  const handleAccept: MouseEventHandler = () => {
    setView(CookieBannerView.Accepted)
    setCookie(SE_GDPR_COOKIE_NAME, SE_GDPR_COOKIE_ACCEPT_VALUE, { expires: getGDPRCookieExpiryDate(), secure: true })
    window.gtag('consent', 'update', {
      ad_storage: 'granted',
      analytics_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    })
    document.dispatchEvent(new CustomEvent(COOKIE_SETTINGS_CHANGE_EVENT, { detail: 1 }))
  }

  const handleReject: MouseEventHandler = () => {
    setView(CookieBannerView.Rejected)
    setCookie(SE_GDPR_COOKIE_NAME, SE_GDPR_COOKIE_REJECT_VALUE, { expires: getGDPRCookieExpiryDate(), secure: true })
    window.gtag('consent', 'update', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    })
    document.dispatchEvent(new CustomEvent(COOKIE_SETTINGS_CHANGE_EVENT, { detail: 0 }))
  }

  const handleHide: MouseEventHandler = () => {
    setView(CookieBannerView.Hidden)
  }

  const renderSelection = () => {
    return (
      <div className="govuk-cookie-banner__message govuk-width-container">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <h2 className="govuk-cookie-banner__heading govuk-heading-m">Cookies on Sponsor Engagement</h2>
            <div className="govuk-cookie-banner__content govuk-body focus:outline-0" ref={regionRef} tabIndex={-1}>
              <p>We may use some essential cookies to make this service work.</p>
              <p>
                We’d like to use additional cookies so we can remember your settings, understand how people use the
                Sponsor Engagement Tool and make improvements.
              </p>
            </div>
          </div>
        </div>

        <div className="govuk-button-group mb-0">
          <button className="govuk-button" name="cookies" onClick={handleAccept} type="button" value="accept">
            Accept additional cookies
          </button>
          <button className="govuk-button" name="cookies" onClick={handleReject} type="button" value="reject">
            Reject additional cookies
          </button>
          <Link className="govuk-link" href="#cookie-policy">
            View cookie policy
          </Link>
        </div>
      </div>
    )
  }

  const renderConfirmation = () => {
    return (
      <div className="govuk-cookie-banner__message govuk-width-container">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <div className="govuk-cookie-banner__content focus:outline-0" ref={regionRef} tabIndex={-1}>
              <p className="govuk-body" data-testid="confirmation-message">
                You’ve {view === CookieBannerView.Accepted ? 'accepted' : 'rejected'} additional cookies. You can view
                the{' '}
                <Link className="govuk-link" href="#cookie-policy">
                  cookie policy
                </Link>{' '}
                at any time.
              </p>
            </div>
          </div>
        </div>
        <div className="govuk-button-group mb-0">
          <button className="govuk-button" onClick={handleHide} type="button">
            Hide cookie message
          </button>
        </div>
      </div>
    )
  }

  if (view === CookieBannerView.Hidden) return null

  return (
    <div
      className="govuk-cookie-banner govuk-!-padding-top-5 govuk-!-padding-bottom-3 w-full SE-cookie-banner"
      data-nosnippet=""
      role="region"
    >
      {view === CookieBannerView.Selection ? renderSelection() : renderConfirmation()}
    </div>
  )
}
