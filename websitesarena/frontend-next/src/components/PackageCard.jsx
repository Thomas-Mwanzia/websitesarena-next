"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function PackageCard({ pkg }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-gradient-to-br from-gray-800/60 to-gray-800/40 border border-gray-700 rounded-2xl p-6 flex flex-col h-full"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
          <p className="text-sm text-gray-300 mt-1">{pkg.tagline}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-extrabold text-white">{pkg.priceDisplay}</div>
          <div className="text-xs text-gray-400">{pkg.frequency}</div>
        </div>
      </div>

      <ul className="mt-4 space-y-2 text-gray-300 text-sm flex-1">
        {pkg.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-blue-300 font-semibold">•</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-xs text-gray-400">Includes free 7 months maintenance</span>
        <div className="flex items-center gap-2">
          {/* Details button: call pkg.onDetails via parent-controlled handler if provided */}
          <button
            type="button"
            onClick={() => pkg.onDetails && pkg.onDetails(pkg)}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm"
          >
            Details
          </button>

          <a href="/contact" className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">Get Started</a>
        </div>
      </div>
    </motion.article>
  );
}
