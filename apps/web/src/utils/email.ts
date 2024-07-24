export function getAbsoluteUrl(path: string) {
  const env = process.env.APP_ENV
  if (!env) return `http://localhost:${process.env.PORT}${path}`
  if (env === 'prod') return `https://assessmystudy.nihr.ac.uk${path}`
  return `https://${env}.assessmystudy.nihr.ac.uk${path}`
}
