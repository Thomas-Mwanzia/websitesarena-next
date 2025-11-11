'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PackagesPage() {
  const packages = [
    {
      title: 'Starter',
      price: 'KES 23,400',
      description:
        'Perfect for small businesses or first-time website owners. Get a beautiful, fast, and mobile-friendly site that gives you a solid online presence.',
      features: [
        'Up to 5 pages (Home, About, Services, Gallery, Contact)',
        'Responsive design for all devices',
        'SEO basics to get found on Google',
        '1 business email setup',
        'Free 7 months of maintenance, upgrades & support',
      ],
    },
    {
      title: 'Professional',
      price: 'KES 30,800',
      description:
        'Ideal for growing businesses that want visibility and performance. We blend strong design with marketing tools that help you attract clients faster.',
      features: [
        'Up to 10 pages + Blog integration',
        'Advanced SEO setup & keyword targeting',
        'Speed optimization & Google Analytics',
        'Email newsletter setup',
        'Free 7 months of maintenance, upgrades & support',
      ],
    },
    {
      title: 'Business',
      price: 'KES 38,200',
      description:
        'A complete solution for established brands. Includes professional content setup, social integrations, and premium hosting reliability.',
      features: [
        'Unlimited pages',
        'Full SEO & content optimization',
        'Social media & WhatsApp integrations',
        'Custom forms & analytics dashboard',
        'Free 7 months of maintenance, upgrades & support',
      ],
    },
    {
      title: 'Enterprise',
      price: 'KES 45,600',
      description:
        'Built for organizations that need scalability, performance, and custom features. We create a secure, powerful digital system for your brand.',
      features: [
        'All Business features + advanced integrations',
        'API connections & automation tools',
        'Priority support & dedicated manager',
        'Custom hosting setup & backups',
        'Free 7 months of maintenance, upgrades & support',
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
          Our <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Packages</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          We believe in transparency and real value. Every package is designed to help you grow online — with expert work, honest pricing, and long-term support.
        </p>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
          Remember: a website is not a one-time plug-and-play thing — it’s hosted online, runs on professional services, and requires expert maintenance. That’s why we include 7 months of free upgrades and support.
          After that, we only charge <span className='font-semibold text-blue-400'>KES 1,000 per month</span> to keep your site secure and updated.
        </p>
      </motion.section>

      {/* Packages Grid */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-24"
      >
        {packages.map((pkg, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-b from-blue-900/30 to-cyan-900/20 border border-blue-700/40 rounded-2xl p-8 flex flex-col justify-between shadow-xl"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">{pkg.title}</h3>
              <p className="text-blue-400 text-3xl font-extrabold mb-4">{pkg.price}</p>
              <p className="text-gray-300 mb-6">{pkg.description}</p>
              <ul className="text-gray-400 text-left space-y-2 mb-6">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-blue-400 mr-2">✔</span> {feature}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 transform hover:scale-105"
            >
              Choose Package
            </Link>
          </motion.div>
        ))}
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center"
      >
        <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-700/50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Contact our team to discuss which package best fits your business goals. 
            We’ll guide you honestly — no pressure, just results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 transform hover:scale-105"
            >
              Contact Us
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold bg-gray-700 hover:bg-gray-600 text-white transition-all duration-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
