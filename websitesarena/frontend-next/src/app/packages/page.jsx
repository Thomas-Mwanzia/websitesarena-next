'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PackagesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto text-center mb-16"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
          Our <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Packages</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          We offer flexible, affordable packages tailored to your business needs. Whether you're just starting or scaling up, we have the perfect solution for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 transform hover:scale-105"
          >
            Get a Quote
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold bg-gray-700 hover:bg-gray-600 text-white transition-all duration-200"
          >
            Learn More
          </Link>
        </div>
      </motion.section>

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
            Contact our team to discuss which package best fits your needs. We're flexible and open to custom solutions.
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
