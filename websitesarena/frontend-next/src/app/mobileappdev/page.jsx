'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  FiSmartphone, 
  FiLayout, 
  FiShield, 
  FiCloud,
  FiGlobe,
  FiCpu,
  FiBox,
  FiCode,
  FiLayers,
  FiRefreshCw,
  FiSettings,
  FiTrendingUp
} from 'react-icons/fi';

const services = [
  {
    title: 'iOS Development',
    description: 'Native iOS applications built with Swift and SwiftUI for optimal performance.',
    icon: <FiSmartphone className="w-8 h-8" />,
    features: ['Swift/SwiftUI', 'iOS SDK', 'App Store Publishing', 'iOS Optimization']
  },
  {
    title: 'Android Development',
    description: 'Native Android apps using Kotlin and Jetpack Compose.',
    icon: <FiBox className="w-8 h-8" />,
    features: ['Kotlin', 'Android SDK', 'Material Design', 'Play Store Publishing']
  },
  {
    title: 'Cross-Platform Apps',
    description: 'Build once, run everywhere with React Native and Flutter.',
    icon: <FiGlobe className="w-8 h-8" />,
    features: ['React Native', 'Flutter', 'Single Codebase', 'Multi-platform Support']
  },
  {
    title: 'App UI/UX Design',
    description: 'Intuitive and engaging mobile interfaces following platform guidelines.',
    icon: <FiLayout className="w-8 h-8" />,
    features: ['Custom UI Design', 'UX Research', 'Prototyping', 'User Testing']
  },
  {
    title: 'Backend Integration',
    description: 'Robust server-side solutions and APIs for mobile apps.',
    icon: <FiCloud className="w-8 h-8" />,
    features: ['API Development', 'Cloud Services', 'Data Sync', 'Push Notifications']
  },
  {
    title: 'App Security',
    description: 'Implementing advanced security measures to protect user data.',
    icon: <FiShield className="w-8 h-8" />,
    features: ['Data Encryption', 'Secure Authentication', 'GDPR Compliance', 'Security Testing']
  },
  {
    title: 'Performance Optimization',
    description: 'Optimizing apps for speed, battery life, and resource usage.',
    icon: <FiTrendingUp className="w-8 h-8" />,
    features: ['Code Optimization', 'Battery Efficiency', 'Load Time Reduction', 'Memory Management']
  },
  {
    title: 'App Maintenance',
    description: 'Regular updates and maintenance to ensure optimal performance.',
    icon: <FiRefreshCw className="w-8 h-8" />,
    features: ['Regular Updates', 'Bug Fixes', 'Performance Monitoring', 'Platform Compliance']
  }
];

const technologies = [
  { name: 'iOS', items: ['Swift', 'SwiftUI', 'Xcode', 'CocoaPods'] },
  { name: 'Android', items: ['Kotlin', 'Jetpack Compose', 'Android Studio', 'Gradle'] },
  { name: 'Cross-Platform', items: ['React Native', 'Flutter', 'Expo', 'Firebase'] },
  { name: 'Backend & Cloud', items: ['Node.js', 'AWS', 'Google Cloud', 'MongoDB'] }
];

const MobileAppDevelopment = () => {
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
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                Mobile App Development
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Transform your ideas into powerful mobile applications. 
                We build innovative, scalable, and user-friendly apps for iOS and Android.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 hover:bg-gray-800/70 transition-all duration-300 border border-gray-700/50 hover:border-purple-500/50">
                  <div className="inline-block p-3 rounded-xl bg-purple-500/10 text-purple-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                  <p className="text-gray-300 mb-6">{service.description}</p>
                  <ul className="space-y-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center text-gray-400">
                        <FiCode className="w-4 h-4 mr-2 text-purple-500" />
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
            <h2 className="text-3xl font-bold text-white mb-4">Development Stack</h2>
            <p className="text-gray-300">We use the latest mobile development technologies</p>
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
                <h3 className="text-lg font-semibold text-white mb-4">{tech.name}</h3>
                <ul className="space-y-2">
                  {tech.items.map((item) => (
                    <li key={item} className="text-gray-400 flex items-center">
                      <FiLayers className="w-4 h-4 mr-2 text-purple-500/70" />
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
                  name: 'Do you integrate M-Pesa into mobile apps?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Yes — we build mobile apps with M-Pesa and other local payment integrations for Kenyan users.' }
                },
                {
                  '@type': 'Question',
                  name: 'How long does it take to build a mobile app in Kenya?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Mobile apps typically take between 6–12 weeks depending on complexity; we provide a delivery timeline during scoping.' }
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
            className="bg-gradient-to-r from-purple-600/10 via-blue-500/10 to-purple-400/10 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden"
          >
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Build Your App?</h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Let's turn your app idea into reality. Our team is ready to help you create an exceptional mobile experience.
              </p>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-full font-semibold inline-flex items-center space-x-2 transition-colors duration-300"
                >
                  <span>Start Your Project</span>
                  <FiSmartphone className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 transform rotate-6 scale-150"></div>
          </motion.div>
        </div>
      </div>
    
  );
};

export default MobileAppDevelopment;