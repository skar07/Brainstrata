/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    serverComponentsExternalPackages: ['@xenova/transformers'],
  },
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

    // Configure aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      "sharp$": false,
      "onnxruntime-node$": false,
    };

    return config;
  },
};

export default nextConfig;
