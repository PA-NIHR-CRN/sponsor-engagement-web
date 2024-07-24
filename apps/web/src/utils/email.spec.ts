import { getAbsoluteUrl } from './email'

describe('getAbsoluteUrl', () => {
  // Mock process.env.APP_ENV and process.env.PORT
  const originalEnv = process.env
  beforeEach(() => {
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('should return an absolute URL with production environment', () => {
    process.env.APP_ENV = 'prod'

    const path = '/example-path'
    const expectedUrl = 'https://assessmystudy.nihr.ac.uk/example-path'

    const result = getAbsoluteUrl(path)

    expect(result).toBe(expectedUrl)
  })

  it('should return an absolute URL with development environment', () => {
    process.env.APP_ENV = 'dev'

    const path = '/example-path'
    const expectedUrl = 'https://dev.assessmystudy.nihr.ac.uk/example-path'

    const result = getAbsoluteUrl(path)

    expect(result).toBe(expectedUrl)
  })

  it('should return an absolute URL with custom environment', () => {
    process.env.APP_ENV = 'oat'
    process.env.PORT = '3000'

    const path = '/example-path'
    const expectedUrl = 'https://oat.assessmystudy.nihr.ac.uk/example-path'

    const result = getAbsoluteUrl(path)

    expect(result).toBe(expectedUrl)
  })

  it('should return an absolute URL with default environment if APP_ENV is not set', () => {
    process.env.PORT = '3000'

    const path = '/example-path'
    const expectedUrl = 'http://localhost:3000/example-path'

    const result = getAbsoluteUrl(path)

    expect(result).toBe(expectedUrl)
  })
})
