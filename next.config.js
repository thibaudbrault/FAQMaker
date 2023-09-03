/** @type {import('next').NextConfig} */
const nextConfig = {
    // trailingSlash: true,
    transpilePackages: ['@mdxeditor/editor', 'react-diff-view'],
    swcMinify: true,
    webpack: (config) => {
        config.experiments = { ...config.experiments, topLevelAwait: true };
        return config;
    },
}

module.exports = nextConfig