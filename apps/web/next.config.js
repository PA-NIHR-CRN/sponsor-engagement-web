/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
      },
    ],
  },
  transpilePackages: ['ui', 'database'],
}

const { withSuperjson } = require('next-superjson')

module.exports = withSuperjson()(nextConfig)
