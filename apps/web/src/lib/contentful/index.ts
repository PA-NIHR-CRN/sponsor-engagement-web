import assert from 'node:assert'

import { createClient as createContentClient } from 'contentful'

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

const contentClient = createContentClient({
  space: CONTENTFUL_SPACE_ID,
  accessToken: CONTENTFUL_ACCESS_TOKEN,
  environment: contentfulEnvironment,
  ...(CONTENTFUL_PREVIEW_MODE === '1' && {
    host: 'preview.contentful.com',
    accessToken: CONTENTFUL_PREVIEW_ACCESS_TOKEN,
  }),
})

export default contentClient
