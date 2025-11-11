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
      // Only redirect /dashboard to /dashboard/client (permanent 301 redirect)
      // This helps preserve SEO value if any external links point to /dashboard
      {
        source: '/dashboard',
        destination: '/dashboard/client',
        permanent: true, // 301 redirect preserves SEO
      },
    ];
  },
  
  // Add headers to control indexing
  async headers() {
    return [
      {
        // Prevent indexing of dashboard pages (protected routes)
        source: '/dashboard/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow'
          }
        ]
      },
      {
        // Prevent indexing of signin page
        source: '/signin',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, follow'
          }
        ]
      },
      {
        // Prevent indexing of clientauth page
        source: '/clientauth',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, follow'
          }
        ]
      },
      {
        // Prevent indexing of notfound and networkerror pages
        source: '/:path(notfound|networkerror)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, follow'
          }
        ]
      }
    ];
  },
}
