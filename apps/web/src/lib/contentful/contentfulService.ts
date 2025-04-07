import assert from 'node:assert'

import { logger } from '@nihr-ui/logger'
import type { Entry, EntrySkeletonType } from 'contentful'
import { createClient } from 'contentful'

import type { TypeBannerSkeleton, TypeBporFooterSkeleton, TypePageSkeleton } from '@/@types/generated'

function getContentClient() {
  const {
    CONTENTFUL_ACCESS_TOKEN,
    CONTENTFUL_SPACE_ID,
    CONTENTFUL_ENVIRONMENT,
    CONTENTFUL_PREVIEW_MODE,
    CONTENTFUL_PREVIEW_ACCESS_TOKEN,
  } = process.env

  assert(CONTENTFUL_ACCESS_TOKEN, 'CONTENTFUL_ACCESS_TOKEN is required')
  assert(CONTENTFUL_SPACE_ID, 'CONTENTFUL_SPACE_ID is required')

  const contentfulEnvironment = CONTENTFUL_ENVIRONMENT || 'master'

  const contentClient = createClient({
    space: CONTENTFUL_SPACE_ID,
    accessToken: CONTENTFUL_ACCESS_TOKEN,
    environment: contentfulEnvironment,
    ...(CONTENTFUL_PREVIEW_MODE === '1' && {
      host: 'preview.contentful.com',
      accessToken: CONTENTFUL_PREVIEW_ACCESS_TOKEN,
    }),
  })

  return contentClient
}

export const getEntryById = async <T extends EntrySkeletonType>(id: string): Promise<Entry<T>> => {
  const contentClient = getContentClient()
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

export const getPage = async (): Promise<Entry<TypePageSkeleton> | null> => {
  const { CONTENTFUL_PAGE_ENTRY_ID } = process.env

  if (CONTENTFUL_PAGE_ENTRY_ID) {
    try {
      return await getEntryById<TypePageSkeleton>(CONTENTFUL_PAGE_ENTRY_ID)
    } catch (error) {
      logger.error(`Encountered error fetching entry from Contentful: ${error}`)
      return null
    }
  }
  return null
}

export const getBporFooter = async (): Promise<Entry<TypeBporFooterSkeleton> | null> => {
  const { CONTENTFUL_BPOR_FOOTER_ENTRY_ID } = process.env

  if (CONTENTFUL_BPOR_FOOTER_ENTRY_ID) {
    try {
      return await getEntryById<TypeBporFooterSkeleton>(CONTENTFUL_BPOR_FOOTER_ENTRY_ID)
    } catch (error) {
      logger.error(`Encountered error fetching entry from Contentful: ${error}`)
      return null
    }
  }
  return null
}
