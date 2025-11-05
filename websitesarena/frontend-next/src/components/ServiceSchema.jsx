import React from 'react';
import Head from "next/head";
const ServiceSchema = ({ service }) => {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: 'Websites Arena',
      image: 'https://websitesarena.com/logo.jpg'
    },
    offers: {
      '@type': 'Offer',
      price: service.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 40.7128,
        longitude: -74.0060
      },
      geoRadius: '5000 mi'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Web Development Services',
      itemListElement: service.features.map((feature, index) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: feature
        },
        position: index + 1
      }))
    }
  };

  return (
    <Head>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Head>
  );
};

export default ServiceSchema;