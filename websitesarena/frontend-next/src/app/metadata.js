const siteUrl = process.env.SITE_URL || "https://websitesarena.com";

export const metadata = {
  title: "Websites Arena - Web Development & Mobile App Design Agency",
  description:
    "Websites Arena (Website Arena): Award-winning web development agency specializing in custom websites, mobile apps, e-commerce solutions, and digital transformation. 100+ projects, expert developers, affordable rates.",
  keywords: "Websites Arena, Website Arena, web development agency, website design, mobile app development, custom websites, e-commerce development, React development, Next.js development, digital solutions, web design company",
  openGraph: {
    title: "Websites Arena - Custom Web Development & Mobile Apps",
    description:
      "Websites Arena (Website Arena): Award-winning agency specializing in custom websites, mobile apps, e-commerce solutions. 100+ successful projects delivered.",
    url: siteUrl,
    siteName: "Websites Arena",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${siteUrl}/logo.jpg`,
        width: 1200,
        height: 630,
        alt: "Websites Arena - Web Development & Digital Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@websitesarena",
    title: "Websites Arena - Web Development Agency",
    description:
      "Websites Arena: Expert web development, mobile apps, e-commerce solutions. 100+ projects completed. Get started today!",
    images: [`${siteUrl}/logo.jpg`],
    creator: "@websitesarena",
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
  viewport: "width=device-width, initial-scale=1.0",
};

export default function RouteHead() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Websites Arena",
    alternateName: "Website Arena",
    url: siteUrl,
    logo: `${siteUrl}/logo.jpg`,
    description:
      "Award-winning web development agency specializing in custom websites, mobile apps, e-commerce solutions, and digital transformation.",
    sameAs: [
      "https://www.linkedin.com/company/websites-arena/",
      "https://www.tiktok.com/@websitesarena",
      "https://www.instagram.com/websitesarena",
      "https://www.youtube.com/@websitesarena",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+254115258685",
      contactType: "Customer Service",
      email: "info@websitesarena.com",
      areaServed: "Worldwide",
      availableLanguage: "en",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Nairobi, Kenya",
      addressLocality: "Nairobi",
      addressRegion: "Nairobi County",
      postalCode: "1234 00611",
      addressCountry: "Kenya",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "150",
      bestRating: "5",
      worstRating: "1",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Web Development",
        item: `${siteUrl}/web-development`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Mobile App Development",
        item: `${siteUrl}/mobileappdev`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Contact",
        item: `${siteUrl}/contact`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Websites Arena?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Websites Arena (also known as Website Arena) is an award-winning web development agency specializing in custom websites, mobile apps, e-commerce solutions, and digital transformation services. We've completed 100+ projects for clients worldwide.",
        },
      },
      {
        "@type": "Question",
        name: "Who is Websites Arena?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Websites Arena is a professional web development company offering expert services in custom website design, mobile app development, e-commerce solutions, React development, Next.js development, and digital transformation.",
        },
      },
      {
        "@type": "Question",
        name: "What web development services do you offer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Websites Arena offers custom web development, responsive design, e-commerce solutions, CMS integration, performance optimization, and progressive web apps (PWAs) tailored to your business needs.",
        },
      },
      {
        "@type": "Question",
        name: "How much does custom website development cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Websites Arena web development projects start from $150 for basic sites and scale based on complexity, features, and customization requirements. Contact us for a personalized quote.",
        },
      },
      {
        "@type": "Question",
        name: "Do you develop mobile applications?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Websites Arena develops native iOS and Android apps, as well as cross-platform applications using React Native and Flutter for faster deployment.",
        },
      },
      {
        "@type": "Question",
        name: "What technologies does Websites Arena use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Websites Arena uses modern tech stacks including React, Next.js, Node.js, MongoDB, PostgreSQL, and other cutting-edge technologies to ensure scalability, performance, and maintainability.",
        },
      },
      {
        "@type": "Question",
        name: "Does Websites Arena provide SEO optimization?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Websites Arena builds SEO-friendly websites with proper metadata, schema markup, fast loading times, mobile responsiveness, and technical SEO best practices built into every project.",
        },
      },
      {
        "@type": "Question",
        name: "How long does a typical web development project take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Project timelines vary based on scope and complexity. Simple sites take 2-4 weeks, while complex applications may take 8-16 weeks. We provide detailed timelines during the consultation.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
