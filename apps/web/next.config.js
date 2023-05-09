/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['ui'],
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
