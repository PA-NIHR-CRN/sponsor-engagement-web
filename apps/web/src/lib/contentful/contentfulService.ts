import assert from 'node:assert'

import type { Entry, EntrySkeletonType } from 'contentful'

import type { TypeBannerSkeleton } from '@/@types/generated'

import contentClient from './index'

export const getEntryById = async <T extends EntrySkeletonType>(id: string): Promise<Entry<T>> => {
  return contentClient.getEntry<T>(id)
}

export const getNotificationBanner = async (): Promise<Entry<TypeBannerSkeleton> | null> => {
  const { CONTENTFUL_BANNER_ENTRY_ID } = process.env

  assert(CONTENTFUL_BANNER_ENTRY_ID, 'CONTENTFUL_BANNER_ENTRY_ID is not defined')

  try {
    return await getEntryById<TypeBannerSkeleton>(CONTENTFUL_BANNER_ENTRY_ID)
  } catch {
    return null
  }
}
