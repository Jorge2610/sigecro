/**
 * @type {import('next').NextConfig}
 * */
const nextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      config.devtool = false;
    }
    return config;
  },
};

export default nextConfig;
