/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['ui', 'database'],
  experimental: {
    instrumentationHook: true,
  },
}

const { withSuperjson } = require('next-superjson')

module.exports = withSuperjson()(nextConfig)
