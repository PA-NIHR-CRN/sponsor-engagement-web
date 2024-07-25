import type { TypeBannerSkeleton } from '@/@types/generated'
import { cmsBannerMock } from '@/lib/contentful/cmsBannerMock'

import { getEntryById, getNotificationBanner } from './contentfulService'

const mockGetEntry = jest.fn()
const mockGetEntries = jest.fn()

const mockCreateClient = jest.fn(() => {
  return {
    getEntry: mockGetEntry,
    getEntries: mockGetEntries,
  }
})

jest.mock('contentful', () => ({
  createClient: mockCreateClient,
}))

describe('Contentful Client Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks() // Clear any previous mocks
  })

  describe('getEntryById', () => {
    it('should fetch entry by ID', async () => {
      mockGetEntry.mockResolvedValue(cmsBannerMock)

      const result = await getEntryById<TypeBannerSkeleton>('test-id')
      expect(result).toEqual(cmsBannerMock)
      expect(mockGetEntry).toHaveBeenCalledWith('test-id')
    })

    it('should throw an error if fetch fails', async () => {
      mockGetEntry.mockRejectedValue(new Error('Failed to fetch'))

      await expect(getEntryById<TypeBannerSkeleton>('test-id')).rejects.toThrow('Failed to fetch')
      expect(mockGetEntry).toHaveBeenCalledWith('test-id')
    })
  })

  describe('getNotificationBanner', () => {
    const originalEnv = process.env

    beforeEach(() => {
      jest.resetModules()
      process.env = { ...originalEnv, CONTENTFUL_BANNER_ENTRY_ID: 'banner-entry-id' }
    })

    afterAll(() => {
      process.env = originalEnv
    })

    it('should fetch notification banner', async () => {
      mockGetEntry.mockResolvedValue(cmsBannerMock)

      const result = await getNotificationBanner()
      expect(result).toEqual(cmsBannerMock)
      expect(mockGetEntry).toHaveBeenCalledWith('banner-entry-id')
    })

    it('should return null if fetch fails', async () => {
      mockGetEntry.mockRejectedValue(new Error('Failed to fetch'))

      const result = await getNotificationBanner()
      expect(result).toBeNull()
      expect(mockGetEntry).toHaveBeenCalledWith('banner-entry-id')
    })
  })
})
