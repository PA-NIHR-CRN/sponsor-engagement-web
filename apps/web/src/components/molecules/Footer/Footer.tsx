import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'

import {
  ACCESSIBILITY_PAGE_URL,
  EXTERNAL_COOKIE_POLICY_PAGE_URL,
  PRIVACY_PAGE_URL,
  RELEASE_NOTES_URL,
  SHAW_TRUST_ACCREDITATION_URL,
  TERMS_AND_CONDITIONS_FOOTER_URL,
} from '@/constants/routes'

export function Footer() {
  return (
    <footer className={clsx('govuk-footer', 'py-3', 'bg-navy-100', 'text-white', 'relative', 'z-30')}>
      <div className="govuk-width-container">
        <div className="flex items-center justify-between">
          <div className="align-left ml-0">
            <a
              aria-label="Shaw Trust accessibility website, (opens in a new tab)"
              href={SHAW_TRUST_ACCREDITATION_URL}
              rel="noreferrer noopener"
              target="_blank"
            >
              <Image alt="Shaw Trust Logo" height={40} src="/assets/images/shaw-trust-logo.png" width={220} />
            </a>
          </div>
          <div className="flex h-[var(--footer-links-panel-height)] items-center">
            <h2 className="govuk-visually-hidden">Support links</h2>
            <ul className="govuk-footer__inline-list mb-0 flex w-full md:justify-end">
              <li className="govuk-footer__inline-list-item">
                <Link
                  aria-label="Terms and conditions, (opens in a new tab)"
                  className="govuk-footer__link link--inverse"
                  href={TERMS_AND_CONDITIONS_FOOTER_URL}
                  target="_blank"
                >
                  Terms and conditions
                </Link>
              </li>
              <li className="govuk-footer__inline-list-item">
                <Link
                  aria-label="Privacy policy, (opens in a new tab)"
                  className="govuk-footer__link link--inverse"
                  href={PRIVACY_PAGE_URL}
                  target="_blank"
                >
                  Privacy policy
                </Link>
              </li>
              <li className="govuk-footer__inline-list-item">
                <Link
                  aria-label="Cookie policy, (opens in a new tab)"
                  className="govuk-footer__link link--inverse"
                  href={EXTERNAL_COOKIE_POLICY_PAGE_URL}
                  target="_blank"
                >
                  Cookie policy
                </Link>
              </li>
              <li className="govuk-footer__inline-list-item">
                <Link
                  aria-label="Accessibility, (opens in a new tab)"
                  className="govuk-footer__link link--inverse"
                  href={ACCESSIBILITY_PAGE_URL}
                  target="_blank"
                >
                  Accessibility
                </Link>
              </li>
              <li className="govuk-footer__inline-list-item">
                <Link
                  aria-label="Release notes, (opens in a new tab)"
                  className="govuk-footer__link link--inverse"
                  href={RELEASE_NOTES_URL}
                  target="_blank"
                >
                  Release notes
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
