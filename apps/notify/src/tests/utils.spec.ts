import { getAbsoluteUrl } from '../utils'

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

    const path = '/example-path'
    const expectedUrl = 'https://oat.assessmystudy.nihr.ac.uk/example-path'

    const result = getAbsoluteUrl(path)

    expect(result).toBe(expectedUrl)
  })

  it('should return an absolute URL with default environment if APP_ENV is not set', () => {
    process.env.APP_ENV = ''
    process.env.WEB_PORT = '3000'

    const path = '/example-path'
    const expectedUrl = 'http://localhost:3000/example-path'

    expect(getAbsoluteUrl(path)).toBe(expectedUrl)

    delete process.env.WEB_PORT

    expect(getAbsoluteUrl(path)).toBe(expectedUrl)
  })
})
