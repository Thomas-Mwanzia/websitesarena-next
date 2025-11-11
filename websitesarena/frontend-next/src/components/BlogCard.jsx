"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import FAQ from './FAQ';

export default function BlogCard({ post }) {
  const [open, setOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <article className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 flex flex-col h-full">
      <header className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{post.title}</h3>
          <p className="text-gray-300 text-sm mt-2">{post.excerpt}</p>
        </div>

        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="ml-4 w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white transform transition-transform"
        >
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="text-xl"
          >
            +
          </motion.span>
        </button>
      </header>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-4 text-gray-300 text-sm"
          >
            <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

            {post.faqs && post.faqs.length > 0 && (
              <div className="mt-4 space-y-3">
                <h4 className="text-white font-semibold">FAQs</h4>
                {post.faqs.map((f, idx) => (
                  <div key={idx} onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                    <FAQ q={f.q} a={f.a} isOpen={openFaq === idx} />
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center gap-3">
              <Link href="#contact" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">Contact Us</Link>
              <Link href={`/blog/${post.slug}`} className="text-sm text-blue-300">Open full post</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
