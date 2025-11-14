const siteUrl = process.env.SITE_URL || "https://websitesarena.com";

export const metadata = {
  title: "Websites Arena — Web & Mobile App Developers in Kenya",
  description:
    "Websites Arena is a leading web and mobile app development agency serving Nairobi, Mombasa, Kisumu, Nakuru and across Kenya. We build responsive websites, eCommerce platforms, and native/cross-platform apps — packages from KES 23,400.",
  keywords: 'web development Kenya, mobile app developers Kenya, web developer Nairobi, ecommerce Kenya, M-Pesa integration, app developers Mombasa, website design Kisumu, Nakuru web development',
  openGraph: {
    title: "Websites Arena — Web & Mobile App Developers (Kenya)",
    description:
      "Expert web and mobile app development in Kenya. We build responsive websites, eCommerce stores, and native apps with local payment integrations like M-Pesa.",
    url: siteUrl,
    siteName: "Websites Arena",
    type: "website",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Websites Arena — Web & Mobile App Developers in Kenya",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Websites Arena — Web & Mobile App Developers in Kenya",
    description:
      "We build websites and mobile apps for Kenyan businesses. Packages from KES 23,400. Local support in Nairobi, Mombasa, Kisumu, Nakuru.",
    images: [`${siteUrl}/og-image.jpg`],
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RouteHead() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Websites Arena",
    url: siteUrl,
    logo: `${siteUrl}/logo.jpg`,
    telephone: process.env.BUSINESS_PHONE || "+254-700-000-000",
    address: {
      "@type": "PostalAddress",
      streetAddress: process.env.BUSINESS_ADDRESS || "Office, Nairobi",
      addressLocality: "Nairobi",
      addressRegion: "Nairobi County",
      postalCode: process.env.BUSINESS_POSTAL || "00100",
      addressCountry: "KE",
    },
    sameAs: [
      "https://www.linkedin.com/company/websites-arena/",
      "https://www.tiktok.com/@websitesarena",
      "https://www.instagram.com/websitesarena",
      "https://www.youtube.com/@websitesarena",
    ],
    description:
      "Websites Arena builds websites, eCommerce platforms, and mobile apps for businesses across Kenya (Nairobi, Mombasa, Kisumu, Nakuru).",
    areaServed: [
      { '@type': 'City', name: 'Nairobi' },
      { '@type': 'City', name: 'Mombasa' },
      { '@type': 'City', name: 'Kisumu' },
      { '@type': 'City', name: 'Nakuru' },
      { '@type': 'Country', name: 'Kenya' }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
