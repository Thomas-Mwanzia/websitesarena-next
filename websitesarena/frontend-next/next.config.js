// @ts-check

/** @type {import('next').NextConfig} */
export default {
  images: {
    domains: ['localhost'],
    // Add other image domains as needed
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
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
