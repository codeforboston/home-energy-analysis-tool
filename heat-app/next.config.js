/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.py/,
      type: 'asset/source',
    });

    return config;
  },
};

module.exports = nextConfig;
