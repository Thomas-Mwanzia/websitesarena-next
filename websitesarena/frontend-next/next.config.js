// @ts-check

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
export default {
  // Disable production source maps to avoid shipping .map files to clients
  productionBrowserSourceMaps: false,

  images: {
    domains: ['localhost'],
    // Add other image domains as needed
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  // Webpack hook: add client-side obfuscation in production if available
  webpack: (config, { isServer, dev }) => {
    // Load plugin only if installed; this keeps builds working if package isn't present
    let WebpackObfuscator = null;
    try {
      // use require via createRequire so this ESM file can load a CJS package
      WebpackObfuscator = require('webpack-obfuscator');
    } catch (e) {
      // package not installed — skip obfuscation
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
            // controlFlowFlattening can break some code; disabled by default
            controlFlowFlattening: false,
          },
          // exclude nothing (adjust patterns if you see issues)
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
