"use client";

import React from 'react';
import { motion } from 'framer-motion';
import ContactForm from '@/components/ContactForm';
const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Get in Touch with Our Team
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Need assistance or have questions? We're here to help.
          </p>
        </motion.div>

        <ContactForm />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg text-center border border-gray-700">
            <h3 className="text-xl font-semibold text-blue-400 mb-2">Email Us</h3>
            <a href="mailto:info@websitesarena.com" className="text-gray-300 hover:text-blue-400 transition-colors">
              info@websitesarena.com
            </a>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg text-center border border-gray-700">
            <h3 className="text-xl font-semibold text-blue-400 mb-2">Call Us</h3>
            <a href="tel:+254115258685" className="text-gray-300 hover:text-blue-400 transition-colors">
              +254115258685
            </a>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg text-center border border-gray-700">
            <h3 className="text-xl font-semibold text-blue-400 mb-2">Working Hours</h3>
            <p className="text-gray-300">
              Monday - Friday<br />
              9:00 AM - 6:00 PM EST
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
