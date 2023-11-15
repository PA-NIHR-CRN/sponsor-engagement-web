import { StartIcon } from '@nihr-ui/frontend'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Card } from '../../../atoms'
import { getAbsoluteUrl } from '../../../../utils/email'
import { SUPPORT_PAGE } from '../../../../constants/routes'

interface RequestSupportProps {
  showCallToAction?: boolean
}

export function RequestSupport({ showCallToAction = false }: RequestSupportProps) {
  const { asPath } = useRouter()
  return (
    <Card className="lg:sticky lg:top-4" filled padding={4}>
      <h3 className="govuk-heading-m">Request NIHR CRN support</h3>
      {showCallToAction ? (
        <>
          <p className="govuk-body">
            Sponsors or their delegates can request NIHR CRN support with their research study at any time.
          </p>
          <Link
            className="govuk-button govuk-button--start govuk-!-margin-bottom-0"
            href={`${getAbsoluteUrl(SUPPORT_PAGE)}?returnPath=${asPath}`}
          >
            Request support <StartIcon />
          </Link>
        </>
      ) : (
        <p className="govuk-body">
          Sponsors or their delegates can request NIHR CRN support with their research study at any time. Click into
          your study for study level support guidance.
        </p>
      )}
    </Card>
  )
}
