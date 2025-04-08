import { getSponsorEngagementUrl } from './utils'

describe('getSponsorEngagementUrl', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('should return localhost URL with custom WEB_PORT when APP_ENV is not set', () => {
    delete process.env.APP_ENV
    process.env.WEB_PORT = '2000'

    const result = getSponsorEngagementUrl()
    expect(result).toBe('http://localhost:2000')
  })

  it('should return prod URL when APP_ENV is "prod"', () => {
    process.env.APP_ENV = 'prod'

    const result = getSponsorEngagementUrl()
    expect(result).toBe('https://assessmystudy.nihr.ac.uk')
  })

  it.each(['uat', 'oat', 'test', 'dev'])(
    'should return environment-specific URL when APP_ENV is %s',
    (appEnvValue: string) => {
      process.env.APP_ENV = appEnvValue

      const result = getSponsorEngagementUrl()
      expect(result).toBe(`https://${appEnvValue}.assessmystudy.nihr.ac.uk`)
    }
  )
})
