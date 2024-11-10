/** @type {import('next').NextConfig} */
const removeImports = require('next-remove-imports')();

const nextConfig = removeImports({
  transpilePackages: ['@mdxeditor/editor', 'react-diff-view'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      },
      {
        protocol: 'https',
        hostname: '**.cloudfront.net'
      }
    ]
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
});

module.exports = nextConfig;
