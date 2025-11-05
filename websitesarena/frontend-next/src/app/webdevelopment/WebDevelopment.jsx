'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  FiLayout, 
  FiCode, 
  FiSmartphone, 
  FiShoppingCart, 
  FiDatabase, 
  FiLayers,
  FiTrendingUp,
  FiGlobe,
  FiServer,
  FiCpu,
  FiShield,
  FiAward
} from 'react-icons/fi';

const services = [
  {
    title: 'Custom Web Development',
    description: 'Tailored web solutions built with cutting-edge technologies to meet your unique business needs.',
    icon: FiCode,
    features: ['React/Next.js Development', 'Node.js Backend', 'Database Design', 'API Integration'],
    color: 'blue'
  },
  {
    title: 'Responsive Design',
    description: 'Mobile-first designs that look stunning and function flawlessly across all devices.',
    icon: FiSmartphone,
    features: ['Mobile Optimization', 'Cross-Browser Support', 'Fluid Layouts', 'Interactive UI'],
    color: 'purple'
  },
  {
    title: 'E-commerce Solutions',
    description: 'Full-featured online stores with secure payment processing and inventory management.',
    icon: FiShoppingCart,
    features: ['Shopping Cart', 'Payment Gateway', 'Product Management', 'Order Tracking'],
    color: 'emerald'
  },
  {
    title: 'Performance Optimization',
    description: 'Lightning-fast websites optimized for speed, SEO, and user experience.',
    icon: FiTrendingUp,
    features: ['Core Web Vitals', 'Caching Strategy', 'Image Optimization', 'Code Minification'],
    color: 'amber'
  }
];

export default function WebDevelopment() {
  return (
    <div className="bg-gradient-to-br from-blue-900 via-gray-900 to-black min-h-screen">
      {/* Rest of your component code */}
    </div>
  );
}