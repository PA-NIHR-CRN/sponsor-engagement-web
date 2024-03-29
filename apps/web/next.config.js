require('./src/utils/schemas/env.schema.js')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['ui', 'database'],
}

const { withSuperjson } = require('next-superjson')

module.exports = withSuperjson()(nextConfig)
