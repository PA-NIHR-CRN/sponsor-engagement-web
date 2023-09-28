import { Button, StartIcon } from '@nihr-ui/frontend'
import { Card } from '../../../atoms'

export function GetSupport() {
  return (
    <Card filled padding={4}>
      <h3 className="govuk-heading-m">Get NIHR CRN support</h3>
      <p className="govuk-body">
        Sponsors or their delegates can get NIHR CRN support with their research study at any time.
      </p>
      <Button className="govuk-button--start govuk-!-margin-bottom-0">
        Get support <StartIcon />
      </Button>
    </Card>
  )
}
