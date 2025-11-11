const siteUrl = process.env.SITE_URL || "https://websitesarena.com";

export const metadata = {
  title: "Websites Arena | Custom Web Development & Digital Solutions",
  description:
    "Transform your digital presence with expert web development, mobile apps, and custom software solutions. Affordable rates, modern design, and SEO optimization.",
  openGraph: {
    title: "Websites Arena | Custom Web Development & Digital Solutions",
    description:
      "Websites Arena offers expert web and mobile app development, stunning design, SEO optimization, and a proven portfolio.",
    url: siteUrl,
    siteName: "Websites Arena",
    type: "website",
    images: [
      {
        url: `${siteUrl}/logo.jpg`,
        width: 1200,
        height: 630,
        alt: "Websites Arena",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Websites Arena | Modern Web & App Development Agency",
    description:
      "Websites Arena offers expert web and mobile app development, stunning design, SEO optimization, and a proven portfolio.",
    images: [`${siteUrl}/logo.jpg`],
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RouteHead() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Websites Arena",
    url: siteUrl,
    logo: `${siteUrl}/logo.jpg`,
    sameAs: [
      "https://www.linkedin.com/company/websites-arena/",
      "https://www.tiktok.com/@websitesarena",
      "https://www.instagram.com/websitesarena",
      "https://www.youtube.com/@websitesarena",
    ],
    description:
      "Websites Arena offers expert web and mobile app development, SEO optimization, and digital transformation services.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
