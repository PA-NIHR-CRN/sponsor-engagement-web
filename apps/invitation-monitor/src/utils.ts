export const getSponsorEngagementUrl = () => {
  const env = process.env.APP_ENV

  if (!env) return `http://localhost:${process.env.WEB_PORT ?? 3000}`

  if (env === 'prod') {
    return `https://assessmystudy.nihr.ac.uk`
  }

  return `https://${env}.assessmystudy.nihr.ac.uk`
}

export const isFulfilled = <T>(input: PromiseSettledResult<T>): input is PromiseFulfilledResult<T> =>
  input.status === 'fulfilled'
