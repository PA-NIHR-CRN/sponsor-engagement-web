import { SecretsManager } from 'aws-sdk'
import { getAllSecrets } from './index'

jest.mock('aws-sdk')

const mockGetSecretValue = jest.fn()
SecretsManager.prototype.getSecretValue = mockGetSecretValue

describe('getAllSecrets', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('retrieves and returns secret when secret string is valid JSON', async () => {
    const secretId = 'testSecretId'
    const secretString = JSON.stringify({ key: 'value' })
    mockGetSecretValue.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ SecretString: secretString }),
    })

    const result = await getAllSecrets(secretId)

    expect(result).toEqual({ SecretString: secretString })
    expect(process.env.key).toBe('value')
  })

  it('throws an error when secret string is not valid JSON', async () => {
    const secretId = 'testSecretId'
    const secretString = 'not a valid JSON string'
    mockGetSecretValue.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ SecretString: secretString }),
    })

    await expect(getAllSecrets(secretId)).rejects.toThrow(SyntaxError)
  })

  it('throws an error when AWS_REGION is not defined', async () => {
    delete process.env.AWS_REGION

    await expect(getAllSecrets('testSecretId')).rejects.toThrow('AWS_REGION is not defined')
  })

  it('calls SecretsManager with correct region when AWS_REGION is defined', async () => {
    process.env.AWS_REGION = 'eu-test-1'
    const secretId = 'testSecretId'
    const secretString = JSON.stringify({ key: 'value' })
    mockGetSecretValue.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ SecretString: secretString }),
    })

    await getAllSecrets(secretId)

    expect(SecretsManager).toHaveBeenCalledWith({ region: 'eu-test-1' })
  })

  it('handles and logs error when getSecretValue fails', async () => {
    const secretId = 'testSecretId'
    mockGetSecretValue.mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error('AWS SDK error')),
    })

    await expect(getAllSecrets(secretId)).rejects.toThrow('AWS SDK error')
  })
})
