import type { TypeBannerSkeleton, TypeBporFooterSkeleton, TypePageSkeleton } from '@/@types/generated'
import { bporFooterMock } from '@/lib/contentful/bporFooterMock'
import { cmsBannerMock } from '@/lib/contentful/cmsBannerMock'
import { rdnPageMock } from '@/lib/contentful/rdnPageMock'

import { getBporFooter, getEntryById, getNotificationBanner, getPage } from './contentfulService'

const mockGetEntry = jest.fn()

jest.mock('contentful', () => ({
  createClient: jest.fn(() => {
    return {
      getEntry: mockGetEntry,
    }
  }),
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

  describe('getEntryById', () => {
    it('should fetch entry by ID', async () => {
      mockGetEntry.mockResolvedValue(rdnPageMock)

      const result = await getEntryById<TypePageSkeleton>('test-id-page')
      expect(result).toEqual(rdnPageMock)
      expect(mockGetEntry).toHaveBeenCalledWith('test-id-page')
    })

    it('should throw an error if fetch fails', async () => {
      mockGetEntry.mockRejectedValue(new Error('Failed to fetch'))

      await expect(getEntryById<TypePageSkeleton>('test-id-page')).rejects.toThrow('Failed to fetch')
      expect(mockGetEntry).toHaveBeenCalledWith('test-id-page')
    })
  })

  describe('getPage', () => {
    const originalEnv = process.env

    beforeEach(() => {
      jest.resetModules()
      process.env = { ...originalEnv, CONTENTFUL_PAGE_ENTRY_ID: 'page-entry-id' }
    })

    afterAll(() => {
      process.env = originalEnv
    })

    it('should fetch notification banner', async () => {
      mockGetEntry.mockResolvedValue(rdnPageMock)

      const result = await getPage()
      expect(result).toEqual(rdnPageMock)
      expect(mockGetEntry).toHaveBeenCalledWith('page-entry-id')
    })

    it('should return null if fetch fails', async () => {
      mockGetEntry.mockRejectedValue(new Error('Failed to fetch'))

      const result = await getPage()
      expect(result).toBeNull()
      expect(mockGetEntry).toHaveBeenCalledWith('page-entry-id')
    })
  })

  describe('getEntryById', () => {
    it('should fetch entry by ID', async () => {
      mockGetEntry.mockResolvedValue(bporFooterMock)

      const result = await getEntryById<TypeBporFooterSkeleton>('test-id-bpor')
      expect(result).toEqual(bporFooterMock)
      expect(mockGetEntry).toHaveBeenCalledWith('test-id-bpor')
    })

    it('should throw an error if fetch fails', async () => {
      mockGetEntry.mockRejectedValue(new Error('Failed to fetch'))

      await expect(getEntryById<TypeBporFooterSkeleton>('test-id-bpor')).rejects.toThrow('Failed to fetch')
      expect(mockGetEntry).toHaveBeenCalledWith('test-id-bpor')
    })
  })

  describe('getBporFooter', () => {
    const originalEnv = process.env

    beforeEach(() => {
      jest.resetModules()
      process.env = { ...originalEnv, CONTENTFUL_BPOR_FOOTER_ENTRY_ID: 'bpor-footer-entry-id' }
    })

    afterAll(() => {
      process.env = originalEnv
    })

    it('should fetch notification banner', async () => {
      mockGetEntry.mockResolvedValue(bporFooterMock)

      const result = await getBporFooter()
      expect(result).toEqual(bporFooterMock)
      expect(mockGetEntry).toHaveBeenCalledWith('bpor-footer-entry-id')
    })

    it('should return null if fetch fails', async () => {
      mockGetEntry.mockRejectedValue(new Error('Failed to fetch'))

      const result = await getBporFooter()
      expect(result).toBeNull()
      expect(mockGetEntry).toHaveBeenCalledWith('bpor-footer-entry-id')
    })
  })
})
