/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['ui', 'database'],
  experimental: {
    instrumentationHook: true,
  },
  experimental:{
    serverComponentsExternalPackages: ['pino', 'pino-pretty']
  }
}

const { withSuperjson } = require('next-superjson')

module.exports = withSuperjson()(nextConfig)
