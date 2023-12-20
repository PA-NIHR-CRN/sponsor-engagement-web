// TODO: Uncomment and fix - currently failing in docker image https://github.com/PA-NIHR-CRN/sponsor-engagement-web/actions/runs/7274941739/job/19821954258
// require('./src/utils/schemas/env.schema.js')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['ui', 'database'],
}

const { withSuperjson } = require('next-superjson')

module.exports = withSuperjson()(nextConfig)
