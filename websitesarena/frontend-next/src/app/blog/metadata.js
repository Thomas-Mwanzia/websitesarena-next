const siteUrl = process.env.SITE_URL || 'https://websitesarena.com';

export const metadata = {
  title: 'Websites Arena Blog — Web Development, Performance & SEO',
  description: 'Read practical guides, case studies and how‑tos on web development, performance optimisation, SEO and small business digital strategy from Websites Arena.',
  keywords: 'web development blog, web performance, SEO tips, Next.js, Tailwind, PWA, small business website',
  openGraph: {
    title: 'Websites Arena Blog — Web Development, Performance & SEO',
    description: 'Practical guides and case studies on building fast, accessible, and SEO-friendly websites.',
    url: `${siteUrl}/blog`,
    siteName: 'Websites Arena',
    type: 'website',
    images: [{ url: `${siteUrl}/logo.jpg`, width: 1200, height: 630, alt: 'Websites Arena' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Websites Arena Blog',
    description: 'Guides, case studies and tips on web development, SEO, and performance.'
  },
  alternates: { canonical: `${siteUrl}/blog` }
};

export default function BlogRouteHead() {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Websites Arena Blog',
    url: `${siteUrl}/blog`,
    description: 'Practical guides and case studies on building fast, accessible, and SEO-friendly websites.',
    publisher: {
      '@type': 'Organization',
      name: 'Websites Arena',
      logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.jpg` }
    }
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
  );
}
