/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['ui'],
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    runtime: 'edge',
  },
}

module.exports = nextConfig
