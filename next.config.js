/** @type {import('next').NextConfig} */
const removeImports = require('next-remove-imports')();
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = removeImports({
  transpilePackages: ['@mdxeditor/editor', 'react-diff-view'],
  swcMinify: true,
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
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
});

// const sentryConfig = withSentryConfig(
//   nextConfig,
//   {
//     authToken: process.env.SENTRY_AUTH_TOKEN,
//     silent: true,
//     org: 'thibaud-brault',
//     project: 'faqmaker',
//   },
//   {
//     widenClientFileUpload: true,
//     transpileClientSDK: true,
//     tunnelRoute: '/monitoring',
//     hideSourceMaps: true,
//     disableLogger: true,
//   },
// );

module.exports = nextConfig;
