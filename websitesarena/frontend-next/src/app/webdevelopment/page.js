import WebDevelopment from './WebDevelopment';
import { Suspense } from 'react';

export const metadata = {
  title: 'Web Development Services | Websites Arena',
  description: 'Professional web development services including custom development, responsive design, e-commerce solutions, and performance optimization. Built with modern technologies.',
  openGraph: {
    title: 'Web Development Services | Websites Arena',
    description: 'Professional web development services including custom development, responsive design, e-commerce solutions, and performance optimization. Built with modern technologies.',
    type: 'website',
    url: 'https://websitesarena.com/web-development',
    images: [{ url: '/logo.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web Development Services | Websites Arena',
    description: 'Professional web development services including custom development, responsive design, e-commerce solutions, and performance optimization. Built with modern technologies.',
    images: ['/logo.jpg'],
  },
  alternates: {
    canonical: 'https://websitesarena.com/web-development',
  }
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WebDevelopment />
    </Suspense>
  );
}