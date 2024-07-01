import { getCookie, setCookie } from 'cookies-next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { MouseEventHandler } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { SE_GDPR_COOKIE_ACCEPT_VALUE, SE_GDPR_COOKIE_NAME, SE_GDPR_COOKIE_REJECT_VALUE } from '@/constants/cookies'
import { EXTERNAL_COOKIE_POLICY_PAGE_URL } from '@/constants/routes'
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

  const handleRouteChange = useCallback(() => {
    // Hide banner after navigating away from cookie policy page
    const isCookieSet = Boolean(getCookie(SE_GDPR_COOKIE_NAME))

    if (view === CookieBannerView.Selection && isCookieSet) {
      setView(CookieBannerView.Hidden)
    }
    // Set initial visibility on client
    if (view === CookieBannerView.Hidden && !isCookieSet) {
      setView(CookieBannerView.Selection)
    }

    // Set focus on confirmation screen
    if (view === CookieBannerView.Accepted || view === CookieBannerView.Rejected) {
      regionRef.current?.focus()
    }
  }, [router, view])

  useEffect(() => {
    handleRouteChange()
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router, handleRouteChange])

  const handleAccept: MouseEventHandler = () => {
    setView(CookieBannerView.Accepted)
    handleDecision('granted', SE_GDPR_COOKIE_ACCEPT_VALUE)
  }

  const handleReject: MouseEventHandler = () => {
    setView(CookieBannerView.Rejected)
    handleDecision('denied', SE_GDPR_COOKIE_REJECT_VALUE)
  }

  const handleDecision = (cookieConsent: string, cookieValue: string) => {
    setCookie(SE_GDPR_COOKIE_NAME, cookieValue, { expires: getGDPRCookieExpiryDate(), secure: true })
    window.gtag('consent', 'update', {
      ad_storage: cookieConsent,
      analytics_storage: cookieConsent,
      ad_user_data: cookieConsent,
      ad_personalization: cookieConsent,
    })
  }

  const handleHide: MouseEventHandler = () => {
    setView(CookieBannerView.Hidden)
  }

  const renderSelection = () => (
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
        <button className="govuk-button" name="cookies" onClick={handleAccept} type="button">
          Accept additional cookies
        </button>
        <button className="govuk-button" name="cookies" onClick={handleReject} type="button">
          Reject additional cookies
        </button>
        <Link
          aria-label="View Cookie policy (opens in a new tab)"
          className="govuk-link"
          data-testid="veiwCookiePolicy"
          href={EXTERNAL_COOKIE_POLICY_PAGE_URL}
          target="_blank"
        >
          View cookie policy
        </Link>
      </div>
    </div>
  )

  const renderConfirmation = () => (
    <div className="govuk-cookie-banner__message govuk-width-container">
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <div className="govuk-cookie-banner__content focus:outline-0" ref={regionRef} tabIndex={-1}>
            <p className="govuk-body" data-testid="confirmation-message">
              You’ve {view === CookieBannerView.Accepted ? 'accepted' : 'rejected'} additional cookies. You can view the{' '}
              <Link
                aria-label="Cookie policy (opens in a new tab)"
                className="govuk-link"
                href={EXTERNAL_COOKIE_POLICY_PAGE_URL}
                target="_blank"
              >
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
