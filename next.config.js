/** @type {import('next').NextConfig} */
const removeImports = require('next-remove-imports')();
module.exports = removeImports({
    // trailingSlash: true,
    transpilePackages: ['@mdxeditor/editor', 'react-diff-view'],
    swcMinify: true,
    images: {
        domains: ['lh3.googleusercontent.com']
    },
    webpack: (config) => {
        config.experiments = { ...config.experiments, topLevelAwait: true };
        return config;
    },
})