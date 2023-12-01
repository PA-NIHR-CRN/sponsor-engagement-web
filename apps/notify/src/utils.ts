export const arrayChunks = <T>(array: T[], chunkSize: number) =>
  Array(Math.ceil(array.length / chunkSize))
    .fill(0)
    .map((_, index) => index * chunkSize)
    .map((begin) => array.slice(begin, begin + chunkSize))

export const getAbsoluteUrl = (path: string) => {
  const env = process.env.APP_ENV
  if (!env) return `http://localhost:${process.env.WEB_PORT ?? 3000}${path}`
  if (env === 'prod') return `https://assessmystudy.nihr.ac.uk${path}`
  return `https://${env}.assessmystudy.nihr.ac.uk${path}`
}
