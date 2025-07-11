/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config, { isServer }) => {
    // Handle canvas and other native modules for client-side builds
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        jsdom: false,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        buffer: false,
        util: false,
        assert: false,
        http: false,
        https: false,
        url: false,
        zlib: false,
      };
    }

    // Exclude problematic modules
    config.externals = config.externals || [];
    config.externals.push({
      canvas: 'canvas',
      jsdom: 'jsdom',
      'utf-8-validate': 'utf-8-validate',
      'bufferutil': 'bufferutil',
    });

    // Handle binary files and native modules
    config.module.rules.push({
      test: /\.node$/,
      use: 'ignore-loader',
    });

    return config;
  },
};

export default nextConfig;
