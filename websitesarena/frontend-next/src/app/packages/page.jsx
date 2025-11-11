"use client";

import React, { useState } from 'react';
import SEO from '../../components/SEO';
import PackageCard from '../../components/PackageCard';
import PackageModal from '../../components/PackageModal';

export default function PackagesPage() {
  const [active, setActive] = useState(null);
  const [open, setOpen] = useState(false);

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
      priceDisplay: '≈ 53,400 KES',
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

  function handleDetails(pkg) {
    setActive(pkg);
    setOpen(true);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
      <SEO title="Packages — Websites Arena" description="Affordable packages with free 7 months maintenance. Transparent pricing that covers developers, hosting and cloud storage." />

      <section className="max-w-6xl mx-auto text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">Packages & Pricing</h1>
        <p className="text-gray-300 max-w-2xl mx-auto mt-3">Choose a package that fits your business. All packages include 7 months of free maintenance; afterwards a small $7/month fee keeps hosting and updates running.</p>
      </section>

      <section className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {packages.map((pkg) => (
            <PackageCard key={pkg.name} pkg={{...pkg, onDetails: handleDetails}} />
          ))}
        </div>

            <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Comparison</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-300">
                  <thead>
                    <tr className="text-gray-400">
                      <th className="py-2">Feature</th>
                      {packages.map((p) => (
                        <th key={p.name} className="py-2">{p.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-700">
                      <td className="py-3">Pages included</td>
                      <td className="py-3">Up to 5</td>
                      <td className="py-3">Up to 10</td>
                      <td className="py-3">Custom</td>
                      <td className="py-3">Custom</td>
                      <td className="py-3">Custom</td>
                    </tr>
                    <tr className="border-t border-gray-700">
                      <td className="py-3">Hosting</td>
                      <td className="py-3">Basic</td>
                      <td className="py-3">Standard</td>
                      <td className="py-3">Enhanced</td>
                      <td className="py-3">E‑commerce ready</td>
                      <td className="py-3">High-performance</td>
                    </tr>
                    <tr className="border-t border-gray-700">
                      <td className="py-3">Storage</td>
                      <td className="py-3">Small</td>
                      <td className="py-3">5GB</td>
                      <td className="py-3">20GB</td>
                      <td className="py-3">50GB</td>
                      <td className="py-3">Scalable</td>
                    </tr>
                    <tr className="border-t border-gray-700">
                      <td className="py-3">7 months maintenance</td>
                      <td className="py-3">Included</td>
                      <td className="py-3">Included</td>
                      <td className="py-3">Included</td>
                      <td className="py-3">Included</td>
                      <td className="py-3">Included</td>
                    </tr>
                    <tr className="border-t border-gray-700">
                      <td className="py-3">Monthly fee after trial</td>
                      <td className="py-3">≈ 1,100 KES</td>
                      <td className="py-3">≈ 1,100 KES</td>
                      <td className="py-3">≈ 1,100 KES</td>
                      <td className="py-3">≈ 1,100 KES</td>
                      <td className="py-3">Custom</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
      </section>

      <PackageModal pkg={active} open={open} onClose={() => setOpen(false)} />
    </main>
  );
}
