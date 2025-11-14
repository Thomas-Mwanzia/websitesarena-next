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

const technologies = [
  { name: 'Frontend', icon: FiLayout, items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'] },
  { name: 'Backend', icon: FiServer, items: ['Node.js', 'Express', 'Python', 'Java'] },
  { name: 'Database', icon: FiDatabase, items: ['MongoDB', 'PostgreSQL', 'Redis', 'Firebase'] },
  { name: 'DevOps', icon: FiCpu, items: ['Docker', 'AWS', 'CI/CD', 'Kubernetes'] }
];

const WebDevelopment = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        {/* Hero Section */}
        <div className="relative overflow-hidden pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 bg-clip-text bg-gradient-to-r from-blue-500 to-blue-200">
                Web Development Services
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Transform your digital presence with our expert web development services. 
                We build modern, scalable, and high-performance web applications.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 hover:bg-gray-800/70 transition-all duration-300 border border-gray-700/50 hover:border-gray-600/50">
                  <div className={`inline-block p-3 rounded-xl bg-${service.color}-500/10 text-${service.color}-500 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                  <p className="text-gray-300 mb-6">{service.description}</p>
                  <ul className="space-y-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center text-gray-400">
                        <FiAward className="w-4 h-4 mr-2 text-blue-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Technologies Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Our Technology Stack</h2>
            <p className="text-gray-300">We use the latest technologies to build modern web applications</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <tech.icon className="w-5 h-5 text-blue-500 mr-2" />
                  <h3 className="text-lg font-semibold text-white">{tech.name}</h3>
                </div>
                <ul className="space-y-2">
                  {tech.items.map((item) => (
                    <li key={item} className="text-gray-400 flex items-center">
                      <FiLayers className="w-4 h-4 mr-2 text-blue-500/70" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ JSON-LD for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'What web development services do you offer in Nairobi?',
                  acceptedAnswer: { '@type': 'Answer', text: 'We offer custom web development, eCommerce, responsive design, performance optimization, and SEO for businesses in Nairobi and across Kenya.' }
                },
                {
                  '@type': 'Question',
                  name: 'Can you build eCommerce websites with local payment integrations?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Yes — we integrate M-Pesa, PayPal, and other payment gateways used in Kenya.' }
                }
              ]
            })
          }}
        />

        {/* CTA Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-blue-600/10 via-blue-500/10 to-blue-400/10 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden"
          >
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Project?</h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Let's discuss your project requirements and create a roadmap for success.
              </p>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-semibold inline-flex items-center space-x-2 transition-colors duration-300"
                >
                  <span>Get Started</span>
                  <FiGlobe className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 transform rotate-6 scale-150"></div>
          </motion.div>
        </div>
      </div>
    
  );
};

export default WebDevelopment;