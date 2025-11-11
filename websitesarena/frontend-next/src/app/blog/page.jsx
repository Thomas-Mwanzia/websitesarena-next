"use client";

import React from 'react';
import SEO from '../../components/SEO';
import BlogCard from '../../components/BlogCard';
import PackageCard from '../../components/PackageCard';

const posts = [
  {
    slug: 'why-performance-matters',
    title: 'Why Performance Matters for Your Website',
    excerpt: 'How Core Web Vitals and fast UX convert visitors into customers.',
    content: `
      <p>Performance influences conversion, SEO and user trust. We measure Core Web Vitals and apply targeted improvements like caching, image optimization, and critical CSS.</p>
      <p>Read on for practical steps you can start today to speed up your site.</p>
    `,
    faqs: [
      { q: 'How do you measure site performance?', a: '<p>We use Lighthouse, PageSpeed Insights, and real-user metrics to form a prioritised plan.</p>' },
      { q: 'Will optimizations break my design?', a: '<p>No — we audit carefully and apply progressive enhancements with visual tests.</p>' }
    ]
  },
  {
    slug: 'seo-basics-for-small-business',
    title: 'SEO Basics for Small Businesses',
    excerpt: 'A friendly guide to the most impactful SEO fixes you can do this week.',
    content: `
      <p>Focus on intent-driven content, descriptive titles, and structured data. Avoid keyword stuffing — write for humans first.</p>
    `,
    faqs: [
      { q: 'How often should I publish content?', a: '<p>Quality beats frequency. Publish predictable, useful content — whether weekly or monthly.</p>' }
    ]
  },
  {
    slug: 'progressive-web-apps-pwas',
    title: 'Progressive Web Apps: When They Make Sense',
    excerpt: 'PWAs can boost engagement and offline availability for many businesses.',
    content: `
      <p>PWAs add offline support, installability and push notifications. They are ideal where repeat visits and engagement matter.</p>
    `,
    faqs: []
  }
];

export default function BlogPage() {
  const packages = [
    {
      name: 'Starter',
      tagline: 'Up to 5 pages — perfect for a brochure site',
      priceDisplay: '≈ 23,400 KES',
      frequency: 'one-time (approx)',
      features: [
        'Up to 5 static pages (Home, About, Services, Contact, Privacy)',
        'Responsive design (mobile & desktop)',
        'Basic SEO setup (titles, meta, sitemap)',
        'Free 7 months maintenance & security updates',
        'Includes basic hosting and cloud storage quota'
      ]
    },
    {
      name: 'Basic',
      tagline: 'Up to 10 pages and simple blog',
      priceDisplay: '≈ 30,400 KES',
      frequency: 'one-time (approx)',
      features: [
        'Up to 10 pages and blog section',
        'Contact form and email integration',
        'Performance tuning and image optimisation',
        'Free 7 months maintenance & monitoring',
        'Hosting and 5GB cloud storage included'
      ]
    },
    {
      name: 'Business',
      tagline: 'Ideal for growing businesses',
      priceDisplay: '≈ 38,400 KES',
      frequency: 'one-time (approx)',
      features: [
        'Custom landing pages and CMS integration',
        'Analytics and conversion tracking',
        'Enhanced security and backups',
        'Free 7 months maintenance + email support',
        'Hosting with 20GB cloud storage'
      ]
    },
    {
      name: 'E‑commerce Starter',
      tagline: 'Small online store (limited products)',
      priceDisplay: '≈ 45,400 KES',
      frequency: 'one-time (approx)',
      features: [
        'Product catalogue and shopping cart',
        'Payment gateway setup',
        'Order notifications and basic reporting',
        'Free 7 months maintenance for store operations',
        'Hosting and storage suitable for product images'
      ]
    },
    {
      name: 'Premium / Enterprise',
      tagline: 'Full custom solutions and integrations',
      priceDisplay: '≈ 53,400 KES + ongoing',
      frequency: 'one-time + ongoing',
      features: [
        'Custom integrations (API, CRM, ERP)',
        'High-performance hosting and CDN',
        'Dedicated support and SLA after trial',
        'Free 7 months premium maintenance',
        'Scalable cloud storage and backups'
      ]
    }
  ];

  const pricingExplanation = `
    <p>Our prices cover the full cost of delivering a professional website: paying skilled developers, paying for reliable hosting and cloud storage, and providing seven months of complimentary maintenance and security updates so you can get started with confidence.</p>
    <p>We offer this 7-month maintenance period for free as an empowerment initiative — after that trial, a small ongoing fee of <strong>≈ 1,100 KES per month</strong> helps cover continued hosting, backups, minor updates and support. This ongoing fee is optional and transparently tied to keeping your site live, secure and up-to-date.</p>
    <p>Why we charge developers and infrastructure: building and maintaining web products requires expert time and infrastructure costs. Your one-time payment ensures the project is delivered to a professional standard; the small monthly fee after the trial keeps uptime, security and daily backups in place.</p>
      <p className="mt-2"><strong>We offer the best services at the best prices — professional delivery, reliable hosting, and transparent ongoing support.</strong></p>
  `;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
      <SEO
        title="Websites Arena Blog"
        description="Insights on web development, performance, SEO and product design from Websites Arena."
        keywords="web development blog, SEO tips, performance optimization, PWA, Next.js, tailwind"
      />

      <section className="max-w-6xl mx-auto text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">Websites Arena Blog</h1>
        <p className="text-gray-300 max-w-2xl mx-auto mt-3">Insights, how-tos and case studies about web performance, SEO, and product design.</p>
      </section>

      <section className="max-w-7xl mx-auto px-4">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-white text-center mb-3">Packages & Pricing</h2>
          <p className="text-gray-300 max-w-3xl mx-auto text-center" dangerouslySetInnerHTML={{ __html: pricingExplanation }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {packages.map((pkg) => (
            <PackageCard key={pkg.name} pkg={pkg} />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            <BlogCard key={p.slug} post={p} />
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto text-center mt-12 text-gray-400">
        <p>Want to see a topic covered? <a href="/contact" className="text-blue-300">Contact us</a>.</p>
      </section>
    </main>
  );
}
