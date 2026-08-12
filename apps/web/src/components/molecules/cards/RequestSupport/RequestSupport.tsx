import { StartIcon } from '@nihr-ui/frontend'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { Card } from '@/components/atoms'
import { SUPPORT_PAGE } from '@/constants/routes'

interface RequestSupportProps {
  showCallToAction?: boolean
  sticky?: boolean
}

export function RequestSupport({ showCallToAction = false, sticky = false }: RequestSupportProps) {
  const { asPath } = useRouter()
  return (
    <Card className={clsx({ 'lg:sticky lg:top-4': sticky}, 'aside')} data-testid="request-support" filled padding={4}>
      <h3 className="govuk-heading-m">Request NIHR RDN support</h3>
      {showCallToAction ? (
        <>
          <p className="govuk-body">
            Sponsors or their delegates can request NIHR RDN support with their research study at any time.
          </p>
          <Link
            className="govuk-link nihr-link-lg nihr-link-arrow-left govuk-!-margin-bottom-0"
            href={`${SUPPORT_PAGE}?returnPath=${asPath}`}
          >
            Request support
          </Link>
        </>
      ) : (
        <p className="govuk-body">
          Sponsors or their delegates can request NIHR RDN support with their research study at any time. Click into
          your study for study level support guidance.
        </p>
      )}
    </Card>
  )
}
