"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const services = [
  // Web Development
  {
    id: 'web-design-development',
    title: 'Custom Website Design & Development',
    desc: 'Beautiful, responsive websites built with modern technologies. Fast, accessible, and SEO-friendly designs tailored to your business goals.',
    tag: 'Web'
  },
  {
    id: 'ecommerce-development',
    title: 'E‑commerce & Online Stores',
    desc: 'Scalable eCommerce solutions with secure payments, inventory management, and conversion-focused UX to boost online sales.',
    tag: 'Web'
  },
  {
    id: 'cms-integration',
    title: 'CMS & Headless CMS Integration',
    desc: 'Flexible content management with WordPress, Strapi, or headless CMS for easy updates and editorial workflows.',
    tag: 'Web'
  },
  {
    id: 'web-performance',
    title: 'Performance & PWAs',
    desc: 'Optimize Core Web Vitals, implement progressive web apps (PWA), caching strategies and offline support for better user experience.',
    tag: 'Web'
  },
  // Mobile App
  {
    id: 'ios-android-apps',
    title: 'iOS & Android App Development',
    desc: 'Native and cross-platform mobile apps designed for performance, security, and delightful user experiences.',
    tag: 'Mobile'
  },
  {
    id: 'react-native-flutter',
    title: 'React Native / Flutter Apps',
    desc: 'Cross-platform apps using React Native or Flutter to accelerate time-to-market while keeping native quality.',
    tag: 'Mobile'
  },
  {
    id: 'mobile-ux-ui',
    title: 'Mobile UX / UI Design',
    desc: 'User-centered mobile designs and interactive prototypes focused on retention and engagement.',
    tag: 'Mobile'
  },
  {
    id: 'mobile-backend',
    title: 'Mobile Backend & APIs',
    desc: 'Secure, scalable backend systems and REST/GraphQL APIs to power your mobile apps and integrations.',
    tag: 'Mobile'
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
      <section className="max-w-6xl mx-auto text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold text-white mb-4"
        >
   
        </motion.h1>
        <p className="text-gray-300 max-w-3xl mx-auto">
Do you need a good and <b>affordable website or mobile App </b> to <b> boost your sales? </b> From as low as 250 USD only - Welcome to Websites Arena.
</p>
      </section>

      <section className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, idx) => (
            <motion.article
              key={s.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="bg-gray-800/60 border border-gray-700 rounded-xl p-6 hover:scale-[1.01] transform transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                <span className="text-sm text-blue-300 bg-blue-900/20 px-3 py-1 rounded">{s.tag}</span>
              </div>
              <p className="text-gray-300 mb-6">{s.desc}</p>
              <div className="mt-auto">
                <Link
                  href="/contact"
                  className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                  aria-label={`Contact about ${s.title}`}
                >
                  Contact Us
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto text-center mt-16">
 
      </section>
    </main>
  );
}

