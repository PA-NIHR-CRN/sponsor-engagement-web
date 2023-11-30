import { arrayChunks, getAbsoluteUrl } from '../utils'

describe('arrayChunks', () => {
  it('should split an array into chunks of the specified size', () => {
    const array = [1, 2, 3, 4, 5, 6]
    const chunkSize = 2
    const result = arrayChunks(array, chunkSize)
    expect(result).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ])
  })

  it('should handle empty arrays', () => {
    const array: number[] = []
    const chunkSize = 3
    const result = arrayChunks(array, chunkSize)
    expect(result).toEqual([])
  })

  it('should handle arrays with a size smaller than the chunk size', () => {
    const array = [1, 2]
    const chunkSize = 3
    const result = arrayChunks(array, chunkSize)
    expect(result).toEqual([[1, 2]])
  })

  it('should split arrays with uneven chunk sizes', () => {
    const array = [1, 2, 3, 4, 5]
    const chunkSize = 2
    const result = arrayChunks(array, chunkSize)
    expect(result).toEqual([[1, 2], [3, 4], [5]])
  })
})

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
    process.env.WEB_PORT = '3000'

    const path = '/example-path'
    const expectedUrl = 'https://oat.assessmystudy.nihr.ac.uk/example-path'

    const result = getAbsoluteUrl(path)

    expect(result).toBe(expectedUrl)
  })

  it('should return an absolute URL with default environment if APP_ENV is not set', () => {
    process.env.WEB_PORT = '3000'

    const path = '/example-path'
    const expectedUrl = 'http://localhost:3000/example-path'

    const result = getAbsoluteUrl(path)

    expect(result).toBe(expectedUrl)
  })
})
