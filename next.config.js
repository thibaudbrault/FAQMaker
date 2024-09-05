/** @type {import('next').NextConfig} */
const removeImports = require('next-remove-imports')();
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = removeImports({
  transpilePackages: ['@mdxeditor/editor', 'react-diff-view'],
  swcMinify: true,
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'storage.googleapis.com',
    ],
  },
  // experimental: {
  //   swcPlugins: [['@swc-jotai/react-refresh', {}]],
  // },
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
