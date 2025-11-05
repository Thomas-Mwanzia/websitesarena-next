import React from 'react';
import Head from "next/head";
const ReviewSchema = ({ reviews }) => {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://websitesarena.com/#organization',
    name: 'Websites Arena',
    url: 'https://websitesarena.com',
    logo: 'https://websitesarena.com/logo.jpg',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length,
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1
    },
    review: reviews.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1
      },
      datePublished: review.date,
      reviewBody: review.content,
      publisher: {
        '@type': 'Organization',
        name: 'Websites Arena'
      }
    }))
  };

  return (
    <Head>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Head>
  );
};

export default ReviewSchema;