import { StartIcon } from '@nihr-ui/frontend'
import Link from 'next/link'
import { Card } from '../../../atoms'

export function GetSupport() {
  return (
    <Card className="lg:sticky lg:top-4" filled padding={4}>
      <h3 className="govuk-heading-m">Get NIHR CRN support</h3>
      <p className="govuk-body">
        Sponsors or their delegates can get NIHR CRN support with their research study at any time.
      </p>
      <Link className="govuk-button govuk-button--start govuk-!-margin-bottom-0" href="/">
        Get support <StartIcon />
      </Link>
    </Card>
  )
}
