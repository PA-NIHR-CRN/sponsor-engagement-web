import type { TypeBannerSkeleton } from '@/@types/generated'

import contentClient from './contentful'

export const getEntryById = async (id: string) => {
  const entry = await contentClient.getEntry(id)
  return entry
}

export const getNotficationBanner = async () => {
  const entries = await contentClient.getEntries<TypeBannerSkeleton>({
    limit: 1,
    content_type: 'banner',
  })
  return entries.items.length ? entries.items[0] : null
}
