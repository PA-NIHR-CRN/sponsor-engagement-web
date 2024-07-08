import type { TypeBannerSkeleton } from '@/@types/generated'
import { cmsBannerMock } from '@/lib/contentful/cmsBannerMock'

import { getEntryById, getNotificationBanner } from './contentfulService'
import contentClient from './index'

jest.mock('./index')

describe('Contentful Client Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks() // Clear any previous mocks
  })

  describe('getEntryById', () => {
    it('should fetch entry by ID', async () => {
      ;(contentClient.getEntry as jest.Mock).mockResolvedValue(cmsBannerMock)

      const result = await getEntryById<TypeBannerSkeleton>('test-id')
      expect(result).toEqual(cmsBannerMock)
      expect(contentClient.getEntry).toHaveBeenCalledWith('test-id')
    })

    it('should throw an error if fetch fails', async () => {
      ;(contentClient.getEntry as jest.Mock).mockRejectedValue(new Error('Failed to fetch'))

      await expect(getEntryById<TypeBannerSkeleton>('test-id')).rejects.toThrow('Failed to fetch')
      expect(contentClient.getEntry).toHaveBeenCalledWith('test-id')
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
      ;(contentClient.getEntry as jest.Mock).mockResolvedValue(cmsBannerMock)

      const result = await getNotificationBanner()
      expect(result).toEqual(cmsBannerMock)
      expect(contentClient.getEntry).toHaveBeenCalledWith('banner-entry-id')
    })

    it('should return null if fetch fails', async () => {
      ;(contentClient.getEntry as jest.Mock).mockRejectedValue(new Error('Failed to fetch'))

      const result = await getNotificationBanner()
      expect(result).toBeNull()
      expect(contentClient.getEntry).toHaveBeenCalledWith('banner-entry-id')
    })

    it('should throw an assertion error if CONTENTFUL_BANNER_ENTRY_ID is not defined', async () => {
      process.env.CONTENTFUL_BANNER_ENTRY_ID = undefined

      await expect(getNotificationBanner()).rejects.toThrow('CONTENTFUL_BANNER_ENTRY_ID is not defined')
      expect(contentClient.getEntry).not.toHaveBeenCalled()
    })
  })
})
