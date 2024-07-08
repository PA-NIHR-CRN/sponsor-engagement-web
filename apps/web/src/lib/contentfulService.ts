import type { Entry, EntrySkeletonType } from 'contentful'

import type { TypeBannerSkeleton } from '@/@types/generated'

import contentClient from './contentful'

export const getEntryById = async <T extends EntrySkeletonType>(id: string): Promise<Entry<T>> => {
  const entry = await contentClient.getEntry<T>(id)
  return entry
}

export const getNotificationBanner = async (): Promise<Entry<TypeBannerSkeleton> | null> => {
  const bannerEntryId = '60C0kd55BPlECeAZbFlHsc'
  try {
    return await getEntryById<TypeBannerSkeleton>(bannerEntryId)
  } catch {
    return null
  }
}
