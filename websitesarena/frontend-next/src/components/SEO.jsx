import React from 'react';
import Head from "next/head";
const SEO = ({ 
  title = 'Websites Arena - Professional Web Development Solutions',
  description = 'Transform your online presence with Websites Arena. We create modern, responsive, and SEO-optimized websites tailored to your business needs. Get started from $150.',
  keywords = 'web development Kenya, web developer Nairobi, mobile app developers Kenya, website design Mombasa, e-commerce Kenya, M-Pesa integration, affordable websites Kisumu, Nakuru web development',
  ogImage = 'https://websitesarena.com/og-image.jpg',
  ogType = 'website',
  schemaType = 'WebSite',
  canonicalUrl = 'https://websitesarena.com',
  children 
}) => {
  const siteName = 'Websites Arena';
  const siteUrl = 'https://websitesarena.com';

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: siteName,
    url: canonicalUrl || siteUrl,
    description,
    ...(schemaType === 'Organization' && {
      logo: `${siteUrl}/logo.jpg`,
      sameAs: [
        'https://facebook.com/websitesarena',
        'https://twitter.com/websitesarena',
        'https://linkedin.com/company/websitesarena'
      ]
    })
  };

  return (
    <Head>
      {/* Basic Metadata */}
      <title>{`${title} | ${siteName}`}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl || siteUrl} />

      {/* Open Graph */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl || siteUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@websitesarena" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#1E40AF" />

      {/* Schema.org */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>

      {/* Additional Meta Tags */}
      {children}
    </Head>
  );
};

export default SEO;
