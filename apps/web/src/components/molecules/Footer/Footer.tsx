import clsx from 'clsx'
import Image from 'next/image'

import {
  ACCESSIBILITY_PAGE_URL,
  EXTERNAL_COOKIE_POLICY_PAGE_URL,
  PRIVACY_PAGE_URL,
  RELEASE_NOTES_URL,
  SHAW_TRUST_ACCREDITATION_URL,
  TERMS_AND_CONDITIONS_FOOTER_URL,
} from '@/constants/routes'
import { LinkEntry } from '@/utils/Renderers/RichTextRenderer/RichTextRenderer'

export function Footer() {
  return (
    <footer className={clsx('govuk-footer', 'py-3', 'bg-navy-100', 'text-white', 'relative', 'z-30')}>
      <div className="govuk-width-container">
        <div className="flex items-center justify-between">
          <div className="align-left ml-0">
            <a
              aria-label="Shaw Trust accessibility website (opens in new tab)"
              href={SHAW_TRUST_ACCREDITATION_URL}
              rel="noreferrer noopener"
              target="_blank"
            >
              <Image alt="" height={40} src="/assets/images/shaw-trust-logo.png" width={220} />
            </a>
          </div>
          <div className="flex h-[var(--footer-links-panel-height)] items-center">
            <h2 className="govuk-visually-hidden">Support links</h2>
            <ul className="govuk-footer__inline-list mb-0 flex w-full md:justify-end">
              <li className="govuk-footer__inline-list-item govuk-footer__link link--inverse">
                <LinkEntry
                  className="govuk-footer__link link--inverse"
                  text="Terms and conditions"
                  url={TERMS_AND_CONDITIONS_FOOTER_URL}
                />
              </li>
              <li className="govuk-footer__inline-list-item govuk-footer__link link--inverse">
                <LinkEntry className="govuk-footer__link link--inverse" text="Privacy policy" url={PRIVACY_PAGE_URL} />
              </li>
              <li className="govuk-footer__inline-list-item govuk-footer__link link--inverse">
                <LinkEntry
                  className="govuk-footer__link link--inverse"
                  text="Cookie policy"
                  url={EXTERNAL_COOKIE_POLICY_PAGE_URL}
                />
              </li>
              <li className="govuk-footer__inline-list-item govuk-footer__link link--inverse">
                <LinkEntry
                  className="govuk-footer__link link--inverse"
                  text="Accessibility"
                  url={ACCESSIBILITY_PAGE_URL}
                />
              </li>
              <li className="govuk-footer__inline-list-item govuk-footer__link link--inverse">
                <LinkEntry className="govuk-footer__link link--inverse" text="Release notes" url={RELEASE_NOTES_URL} />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
