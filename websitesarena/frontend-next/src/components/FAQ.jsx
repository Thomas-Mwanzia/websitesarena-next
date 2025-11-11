"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQ({ q, a, isOpen }) {
  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <motion.div
        layout
        initial={false}
        className="p-4 bg-gray-800/30 flex items-start gap-4"
      >
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-white">{q}</h4>
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                key="answer"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="text-gray-300 text-sm mt-3"
              >
                <div dangerouslySetInnerHTML={{ __html: a }} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
