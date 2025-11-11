'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, CheckIcon, PlusIcon } from '@heroicons/react/24/outline';

import { blogPackages, blogFaqs } from './data';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function BlogPage() {
  const [expandedCards, setExpandedCards] = useState({});
  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleCard = (cardId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const toggleFaq = (faqIndex) => {
    setExpandedFaq(expandedFaq === faqIndex ? null : faqIndex);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto text-center mb-16"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
          Blog <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Solutions</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Launch your blog with powerful tools, beautiful design, and built-in SEO. Choose the perfect plan for your needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 transform hover:scale-105"
          >
            Get Started Now
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold bg-gray-700 hover:bg-gray-600 text-white transition-all duration-200"
          >
            Schedule Demo
          </Link>
        </div>
      </motion.section>

      {/* Pricing Cards Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="max-w-7xl mx-auto mb-20"
      >
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Simple, Transparent Pricing
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogPackages.map((pkg) => (
            <motion.div
              key={pkg.id}
              variants={itemVariants}
              className={`relative rounded-2xl border-2 transition-all duration-300 ${
                pkg.popular
                  ? 'border-blue-500 bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl lg:scale-105'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Package Header */}
                <h3 className="text-2xl font-bold text-white mb-2">{pkg.title}</h3>
                <p className="text-gray-400 text-sm mb-6">{pkg.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-white">
                    {formatPrice(pkg.price)}
                  </span>
                  <span className="text-gray-400 text-sm">/month</span>
                </div>

                {/* CTA Button */}
                <Link
                  href="/contact"
                  className={`w-full py-3 rounded-lg font-semibold text-center transition-all duration-200 mb-8 block ${
                    pkg.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  Choose Plan
                </Link>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckIcon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Expandable FAQ Section */}
                <div className="border-t border-gray-700 pt-6">
                  <button
                    onClick={() => toggleCard(pkg.id)}
                    className="w-full flex items-center justify-between text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200"
                  >
                    <span className="flex items-center gap-2">
                      <PlusIcon
                        className={`w-5 h-5 transition-transform duration-300 ${
                          expandedCards[pkg.id] ? 'rotate-45' : ''
                        }`}
                      />
                      FAQ
                    </span>
                    <ChevronDownIcon
                      className={`w-5 h-5 transition-transform duration-300 ${
                        expandedCards[pkg.id] ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {expandedCards[pkg.id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 space-y-4"
                      >
                        {pkg.faqs.map((faq, idx) => (
                          <div key={idx} className="bg-gray-900/50 rounded-lg p-4">
                            <p className="font-semibold text-gray-200 text-sm mb-2">
                              Q: {faq.q}
                            </p>
                            <p className="text-gray-400 text-sm">A: {faq.a}</p>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* General FAQs Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {blogFaqs.map((faq, index) => (
            <motion.div
              key={index}
              className="border border-gray-700 rounded-xl overflow-hidden bg-gray-800/30 hover:border-gray-600 transition-colors duration-200"
              layout
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-800/50 transition-colors duration-200"
              >
                <h3 className="font-semibold text-lg text-white">{faq.question}</h3>
                <motion.div
                  animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDownIcon className="w-6 h-6 text-blue-400" />
                </motion.div>
              </button>

              <AnimatePresence>
                {expandedFaq === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-700 bg-gray-900/50"
                  >
                    <p className="px-6 py-4 text-gray-300 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto mt-20 text-center"
      >
        <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-700/50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to start blogging?
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Join hundreds of content creators who trust Websites Arena to power their blogs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 transform hover:scale-105"
            >
              Get Started
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
