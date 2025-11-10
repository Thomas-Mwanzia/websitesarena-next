// Template for creating SEO-optimized metadata on new pages
// Copy this to any new page's metadata.js file

export const metadata = {
  // ===== PRIMARY METADATA =====
  // Title: 50-60 characters max, include primary keyword + brand
  // Format: "Main Keyword | Secondary | Brand"
  title: 'Page Title | Subheading | Websites Arena',
  
  // Description: 150-160 characters max, compelling and includes CTA
  description: 'Concise, benefit-focused description that appears in search results. Encourage click-through with action words.',
  
  // Keywords: 5-10 relevant terms, comma-separated
  keywords: 'primary keyword, secondary keyword, long-tail keyword, related terms, service type',
  
  // ===== OPEN GRAPH (for social sharing) =====
  openGraph: {
    title: 'Open Graph Title | May differ from title tag | Brand',
    description: 'Social description - can be different from meta description, 1-2 sentences.',
    type: 'website', // or 'article', 'product', etc.
    url: 'https://websitesarena.com/your-page',
    locale: 'en_US',
    siteName: 'Websites Arena',
    images: [
      {
        url: 'https://websitesarena.com/og-image-1200x630.jpg', // 1200x630 optimal
        width: 1200,
        height: 630,
        alt: 'Descriptive alt text for the image',
        type: 'image/jpeg',
      },
    ],
  },

  // ===== TWITTER CARD =====
  twitter: {
    card: 'summary_large_image', // or 'summary'
    site: '@websitesarena',
    creator: '@websitesarena',
    title: 'Twitter Card Title',
    description: 'Twitter description (can be same as meta description)',
    images: ['https://websitesarena.com/og-image-1200x630.jpg'],
  },

  // ===== CANONICAL URL =====
  // Always set to preferred version of page to prevent duplicate content issues
  alternates: {
    canonical: 'https://websitesarena.com/your-page',
  },

  // ===== ROBOTS & CRAWLING =====
  robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  
  // Additional metadata
  viewport: 'width=device-width, initial-scale=1.0',
  language: 'en-US',
};

export default function RouteHead() {
  // ===== JSON-LD STRUCTURED DATA =====
  // Add appropriate schema based on page type
  
  // For SERVICE PAGES: Use ServiceSchema
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Service Name",
    description: "Service description",
    provider: {
      "@type": "Organization",
      name: "Websites Arena",
      url: "https://websitesarena.com",
      logo: "https://websitesarena.com/logo.jpg",
    },
    serviceType: "Service Category",
    areaServed: "Worldwide",
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: "Starting price",
    },
  };

  // For BLOG/ARTICLE PAGES: Use ArticleSchema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "Article Headline",
    description: "Article description",
    image: "https://websitesarena.com/article-image.jpg",
    author: {
      "@type": "Person",
      name: "Author Name",
      url: "https://websitesarena.com/author",
    },
    datePublished: "2025-11-10",
    dateModified: "2025-11-10",
  };

  // For BREADCRUMBS: Use BreadcrumbListSchema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://websitesarena.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Current Page",
        item: "https://websitesarena.com/your-page",
      },
    ],
  };

  // For FAQ PAGES: Use FAQPageSchema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Question 1?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Answer to question 1.",
        },
      },
      {
        "@type": "Question",
        name: "Question 2?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Answer to question 2.",
        },
      },
    ],
  };

  return (
    <>
      {/* Add the appropriate schema(s) for this page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Add service schema for service pages */}
      {/* Add article schema for blog posts */}
      {/* Add FAQ schema for FAQ pages */}
    </>
  );
}

/*
=============================================================================
                          IMPLEMENTATION CHECKLIST
=============================================================================

□ Title (50-60 chars max)
  - Includes primary keyword
  - Includes brand name
  - Compelling and clickable

□ Meta Description (150-160 chars max)
  - Includes primary keyword
  - Benefit-focused
  - Includes CTA or action word

□ Keywords (5-10 terms)
  - Natural language (NO keyword stuffing)
  - Mix of short-tail and long-tail
  - Related to page content

□ Open Graph
  - Unique title (different from page title is OK)
  - Social-friendly description
  - Image: 1200x630px optimal size

□ Twitter Card
  - summary_large_image or summary
  - Fits within Twitter's constraints

□ Canonical URL
  - Always set to prevent duplicate content

□ Robots Meta
  - index: Allow search engines to index
  - follow: Allow crawling of links
  - max-snippet: Set to -1 (unlimited)

□ Structured Data (JSON-LD)
  - Choose schema type(s): Service, Article, FAQ, BreadcrumbList
  - Validate with schema.org validator
  - Include organization reference where applicable

□ Images
  - All images have descriptive alt text
  - Image file names are descriptive (not IMG_001.jpg)
  - Use next/Image component with width/height

□ H1 Tag
  - Only ONE H1 per page
  - Matches or relates to title tag
  - Contains primary keyword naturally

□ Internal Links
  - Link to relevant services/pages
  - Use descriptive anchor text (not "click here")
  - 3-5 internal links per page

=============================================================================
                              SEO BEST PRACTICES
=============================================================================

✓ DO:
  - Write for users first, SEO second
  - Include keyword in first 100 words
  - Use natural, conversational language
  - Create unique, valuable content
  - Test on mobile and desktop
  - Monitor Core Web Vitals

✗ DON'T:
  - Keyword stuff (looks spam, harms ranking)
  - Copy content from competitors
  - Use hidden text or misleading titles
  - Forget alt text on images
  - Mix up canonical URLs
  - Change URLs frequently (redirects needed)

=============================================================================
*/
