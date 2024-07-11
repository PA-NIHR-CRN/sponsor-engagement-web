import assert from 'node:assert'
import { SecretsManager } from 'aws-sdk'

type SecretsManagerResponse = Record<string, string>

export const getAllSecrets = async (secretId: string) => {
  const { AWS_REGION } = process.env

  assert(AWS_REGION, 'AWS_REGION is not defined')
  const client = new SecretsManager({
    region: AWS_REGION,
  })

  const secret = await client.getSecretValue({ SecretId: secretId }).promise()

  if (typeof secret.SecretString === 'string') {
    const secretsManagerResponse: SecretsManagerResponse = JSON.parse(secret.SecretString) as SecretsManagerResponse

    Object.keys(secretsManagerResponse).forEach((key) => {
      process.env[key] = secretsManagerResponse[key]
    })
  }

  return secret
}
