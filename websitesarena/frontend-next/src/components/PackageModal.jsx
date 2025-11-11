"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PackageModal({ pkg, open, onClose }) {
  if (!pkg) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="max-w-3xl w-full bg-gray-900 border border-gray-700 rounded-2xl shadow-xl overflow-auto"
          >
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">{pkg.name}</h3>
                  <p className="text-gray-300 mt-2">{pkg.tagline}</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-extrabold text-white">{pkg.priceDisplay}</div>
                  <div className="text-xs text-gray-400">{pkg.frequency}</div>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-gray-300">
                <div>
                  <h4 className="text-lg font-semibold text-white">What this includes</h4>
                  <ul className="mt-2 space-y-2">
                    {pkg.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-blue-300 font-semibold">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white">Pricing explanation</h4>
                  <p className="text-gray-300 mt-2">Our one-time price covers developer time, hosting allocation, cloud storage, and seven months of maintenance. After seven months a small monthly fee of <strong>≈ 1,100 KES per month</strong> keeps hosting, backups and minor updates running.</p>
                  <p className="mt-2 text-gray-300"><strong>We offer the best services at the best prices — professional delivery, reliable hosting, and transparent ongoing support.</strong></p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white">Next steps</h4>
                  <p className="text-gray-300 mt-2">Click "Get Started" to contact our team and arrange delivery timelines, or request a custom quote for integrations and e-commerce.</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button onClick={onClose} className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md">Close</button>
                <a href="/contact" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">Get Started</a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
