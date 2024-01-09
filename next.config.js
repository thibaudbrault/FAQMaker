/** @type {import('next').NextConfig} */
const removeImports = require('next-remove-imports')();
module.exports = removeImports({
    transpilePackages: ['@mdxeditor/editor', 'react-diff-view'],
    swcMinify: true,
    images: {
        domains: ['lh3.googleusercontent.com']
    },
    experimental: {
        swcPlugins: [['@swc-jotai/react-refresh', {}]],
    },
    webpack: (config) => {
        config.experiments = { ...config.experiments, topLevelAwait: true };
        return config;
    }
})