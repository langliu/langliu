/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@langliu/ui'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
}

export default nextConfig
