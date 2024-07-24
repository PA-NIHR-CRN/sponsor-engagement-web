import { logger } from '@nihr-ui/logger'
import type { Entry, EntrySkeletonType } from 'contentful'

import type { TypeBannerSkeleton } from '@/@types/generated'

import contentClient from './index'

export const getEntryById = async <T extends EntrySkeletonType>(id: string): Promise<Entry<T>> => {
  return contentClient.getEntry<T>(id)
}

export const getNotificationBanner = async (): Promise<Entry<TypeBannerSkeleton> | null> => {
  const { CONTENTFUL_BANNER_ENTRY_ID } = process.env

  if (CONTENTFUL_BANNER_ENTRY_ID) {
    try {
      return await getEntryById<TypeBannerSkeleton>(CONTENTFUL_BANNER_ENTRY_ID)
    } catch (error) {
      logger.error(`Encountered error fetching entry from Contentful when ENV variable was set: ${error}`)
      return null
    }
  }

  return null
}
