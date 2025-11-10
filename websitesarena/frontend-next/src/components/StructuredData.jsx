import React from 'react';

/**
 * StructuredData Component - Renders JSON-LD schema markup
 * Use this to inject structured data for better SEO
 */
export const OrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://websitesarena.com/#organization",
    name: "Websites Arena",
    url: "https://websitesarena.com",
    logo: "https://websitesarena.com/logo.jpg",
    description: "Award-winning web development agency specializing in custom websites, mobile apps, e-commerce solutions, and digital transformation.",
    sameAs: [
      "https://www.linkedin.com/company/websites-arena/",
      "https://www.tiktok.com/@websitesarena",
      "https://www.instagram.com/websitesarena",
      "https://www.youtube.com/@websitesarena",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-XXX-XXX-XXXX",
      contactType: "Customer Service",
      email: "contact@websitesarena.com",
      areaServed: "Worldwide",
      availableLanguage: "en",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "150",
      bestRating: "5",
      worstRating: "1",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

/**
 * Service Schema - Use for service pages
 */
export const ServiceSchema = ({ serviceName, description, serviceUrl }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceName,
    description: description,
    provider: {
      "@type": "Organization",
      name: "Websites Arena",
      url: "https://websitesarena.com",
    },
    serviceType: serviceName,
    url: serviceUrl,
    areaServed: "Worldwide",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

/**
 * BreadcrumbList Schema - Use on all pages
 */
export const BreadcrumbSchema = ({ items }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

/**
 * FAQ Schema - Use on pages with FAQs
 */
export const FAQSchema = ({ faqs }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

/**
 * Product/Service Review Schema
 */
export const ReviewSchema = ({ reviews, organizationName }) => {
  const aggregateRating = reviews.length > 0
    ? {
        "@type": "AggregateRating",
        ratingValue: (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1),
        reviewCount: reviews.length,
        bestRating: "5",
        worstRating: "1",
      }
    : null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: organizationName,
    aggregateRating,
    review: reviews.map((review) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: review.author,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: "5",
        worstRating: "1",
      },
      datePublished: review.date,
      reviewBody: review.content,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

/**
 * LocalBusiness Schema - Use if targeting local markets
 */
export const LocalBusinessSchema = ({ businessName, address, phone, email, coordinates }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: businessName,
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.state,
      postalCode: address.zip,
      addressCountry: address.country,
    },
    telephone: phone,
    email: email,
    url: "https://websitesarena.com",
    ...(coordinates && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: coordinates.lat,
        longitude: coordinates.lng,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default {
  OrganizationSchema,
  ServiceSchema,
  BreadcrumbSchema,
  FAQSchema,
  ReviewSchema,
  LocalBusinessSchema,
};
