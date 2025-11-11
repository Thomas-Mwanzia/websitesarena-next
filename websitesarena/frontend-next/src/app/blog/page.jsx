'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/24/outline';
import { FiClock, FiTag, FiTrendingUp, FiTool, FiUsers } from 'react-icons/fi';

import { blogAwareness } from './data';

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
  const [expandedSections, setExpandedSections] = useState({});

  // Icons to represent each awareness section (keeps visuals consistent)
  const sectionIcons = [FiClock, FiTag, FiTrendingUp, FiTool, FiUsers];

  const toggleSection = (sectionIndex) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionIndex]: !prev[sectionIndex],
    }));
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
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          {blogAwareness.title}
        </h1>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed mb-6">
          {blogAwareness.intro}
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/packages"
            className="inline-flex items-center justify-center px-5 py-2 rounded-md font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200"
          >
            See Packages
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-5 py-2 rounded-md font-medium bg-gray-700 hover:bg-gray-600 text-white transition-all duration-200"
          >
            Contact Us
          </Link>
        </div>
      </motion.section>

      {/* Expandable Awareness Sections */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto mb-20"
      >
        <div className="space-y-4">
          {blogAwareness.sections.map((section, index) => {
            const Icon = sectionIcons[index] || FiTag;
            const displayHeading = section.heading.split(' ').slice(1).join(' ');
            return (
              <motion.div
                key={index}
                className="border border-gray-700 rounded-xl overflow-hidden bg-gray-800/30 hover:border-blue-500/50 transition-all duration-200"
                layout
              >
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full px-6 py-6 flex items-start justify-between text-left hover:bg-gray-800/50 transition-colors duration-200 group"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="mt-1 text-blue-400 group-hover:text-blue-300 transition-colors duration-200">
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg md:text-xl text-white group-hover:text-blue-300 transition-colors duration-200">
                        {displayHeading}
                      </h3>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedSections[index] ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <PlusIcon className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-200" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {expandedSections[index] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-700 bg-gradient-to-br from-gray-900/50 to-gray-800/50"
                    >
                      <p className="px-6 py-6 text-gray-300 leading-relaxed whitespace-pre-wrap text-base md:text-lg">
                        {section.content.trim()}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center"
      >
        <div className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border border-blue-700/50 rounded-2xl p-12">
          <h2 className="text-4xl font-bold text-white mb-6">
            {blogAwareness.cta.heading}
          </h2>
          <p className="text-gray-300 mb-8 text-lg leading-relaxed whitespace-pre-wrap">
            {blogAwareness.cta.subheading.trim()}
          </p>
          <Link
            href={blogAwareness.cta.buttonLink}
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 transform hover:scale-105 text-lg"
          >
            {blogAwareness.cta.buttonText}
          </Link>
        </div>
      </motion.section>

      {/* Back to Home Link */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-4xl mx-auto text-center mt-12"
      >
        <Link
          href="/"
          className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200"
        >
          ← Back to Home
        </Link>
      </motion.div>
    </main>
  );
}
