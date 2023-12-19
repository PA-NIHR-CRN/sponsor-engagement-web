import type { AwsRumConfig } from 'aws-rum-web'
import { AwsRum } from 'aws-rum-web'

try {
  const config: AwsRumConfig = {
    sessionSampleRate: 1,
    guestRoleArn: 'arn:aws:iam::841171564302:role/RUM-Monitor-eu-west-2-841171564302-7577665892071-Unauth',
    identityPoolId: 'eu-west-2:aa637c53-f910-49d3-8957-73901313ca44',
    endpoint: 'https://dataplane.rum.eu-west-2.amazonaws.com',
    telemetries: ['performance', 'errors', 'http'],
    allowCookies: true,
    enableXRay: false,
  }

  const APPLICATION_ID = process.env.NEXT_PUBLIC_CLOUDWATCH_RUM_APP_ID
  const APPLICATION_VERSION = '1.0.0'
  const APPLICATION_REGION = 'eu-west-2'

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- expected
  const awsRum: AwsRum = new AwsRum(APPLICATION_ID, APPLICATION_VERSION, APPLICATION_REGION, config)
} catch (error) {
  // Ignore errors thrown during CloudWatch RUM web client initialization
}

export default function RealtimeApplicationMonitoringInit() {
  // Render nothing - this component is only included so that the init code
  // above will run client-side
  return null
}
