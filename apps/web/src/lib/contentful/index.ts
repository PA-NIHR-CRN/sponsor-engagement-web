import { createClient as createContentClient } from 'contentful'

const contentfulEnvironment = process.env.CONTENTFUL_ENVIRONMENT || 'master'

const contentClient = createContentClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  environment: contentfulEnvironment,
})

export default contentClient
