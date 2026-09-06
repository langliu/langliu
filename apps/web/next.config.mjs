/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@langliu/ui'],
  typescript: {
    ignoreBuildErrors: true,
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  images: {
    loader: 'custom',
    loaderFile: './supabase-image-loader.js',
    unoptimized: true,
  },
}

export default nextConfig
