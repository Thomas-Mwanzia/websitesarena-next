// @ts-check

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
export default {
  // Disable production source maps to avoid shipping .map files to clients
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**',
      }
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  // Webpack hook: add client-side obfuscation in production if available
  webpack: (config, { isServer, dev }) => {
    let WebpackObfuscator = null;
    try {
      WebpackObfuscator = require('webpack-obfuscator');
    } catch (e) {
      WebpackObfuscator = null;
    }

    if (!dev && !isServer && WebpackObfuscator) {
      config.plugins.push(
        new WebpackObfuscator(
          {
            rotateStringArray: true,
            stringArray: true,
            stringArrayEncoding: ['rc4'],
            compact: true,
            controlFlowFlattening: false,
          },
          []
        )
      );
    }

    return config;
  },

  // Enable static export if needed
  // output: 'export',
  
  // Add redirects if needed
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/client',
        permanent: true,
      },
    ];
  },
}
