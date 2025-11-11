// @ts-check

/** @type {import('next').NextConfig} */
export default {
  // Disable production source maps to avoid shipping .map files to clients
  productionBrowserSourceMaps: false,
  images: {
    domains: ['localhost', 'api.websitesarena.com', 'www.websitesarena.com'],
    // Add other image domains as needed
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'https://api.websitesarena.com';
    if (!apiUrl || apiUrl.includes('undefined')) {
      console.warn('[next.config.js] Warning: API URL not configured. Using default fallback.');
    }
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
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
