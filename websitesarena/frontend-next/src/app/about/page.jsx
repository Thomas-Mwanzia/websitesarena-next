"use client";

import React from 'react'
import { motion } from 'framer-motion'
import { FiTarget, FiUsers, FiAward, FiCode, FiHeart, FiTrendingUp } from 'react-icons/fi'
import Head from 'next/head';


// Stats removed per content update — we use narrative mission/vision instead

const values = [
  {
    icon: FiHeart,
    title: 'Passion',
    description: 'We are passionate about creating exceptional digital experiences.'
  },
  {
    icon: FiCode,
    title: 'Innovation',
    description: 'We embrace new technologies and creative solutions.'
  },
  {
    icon: FiUsers,
    title: 'Collaboration',
    description: 'We work closely with clients to achieve their goals.'
  },
  {
    icon: FiAward,
    title: 'Excellence',
    description: 'We strive for excellence in every project we undertake.'
  }
];

const milestones = [
  {
    year: '2025',
    title: 'The Journey Begins',
    description: 'We launched Websites Arena to deliver affordable, high‑quality web and mobile solutions.'
  },
  {
    year: '2026',
    title: 'Templates & Marketplace',
    description: 'Rolling out ready‑made website and mobile app templates to help businesses launch faster.'
  },
  {
    year: '2027+',
    title: 'Scaling Globally',
    description: 'Expanding our marketplace, partnerships and team to become a global leader in templates and services.'
  }
];

const About = () => {
  return (
    <>
      <Head>
        <title>About Us - Websites Arena</title>
        <meta 
          name="description" 
          content="Learn about Websites Arena - our mission, values, team, and journey in creating exceptional digital experiences." 
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        {/* Hero — concise narrative */}
        <section className="pt-32 pb-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              Nov 5th, 2025
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-lg text-gray-300 max-w-3xl mx-auto"
            >
              In 2025 we launched Websites Arena to make great web and mobile experiences affordable
              and accessible. We offer flexible payment plans, connect clients with the best third‑party
              services, and operate with a distributed team of experienced developers worldwide.
              Starting next year we'll also offer ready‑made website and mobile app templates to help
              entrepreneurs and businesses move faster.
            </motion.p>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4 bg-gray-800/50">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-white text-center mb-12"
            >
              Our Values
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center group hover:bg-gray-700/50 transition-all duration-300"
                >
                  <div className="inline-block p-3 rounded-xl bg-blue-500/10 text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                  <p className="text-gray-400">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 px-4 bg-gray-800/40">
          <div className="max-w-5xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-white text-center mb-6"
            >
              Mission & Vision
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 rounded-xl p-6"
              >
                <h3 className="text-xl font-semibold text-blue-400 mb-2">Our Mission</h3>
                <p className="text-gray-300">
                  To empower businesses and creators worldwide with affordable, reliable, and
                  beautiful digital products — delivered with flexible payment options and backed by
                  a global network of talented developers.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 rounded-xl p-6"
              >
                <h3 className="text-xl font-semibold text-blue-400 mb-2">Our Vision</h3>
                <p className="text-gray-300">
                  To be the go‑to global platform for web and mobile templates and services — helping
                  customers launch faster and helping developers reach clients everywhere.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-white text-center mb-12"
            >
              Our Journey
            </motion.h2>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-500/20"></div>
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.year}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} gap-8`}
                  >
                    <div className="flex-1 text-right md:text-left">
                      <div className="text-xl font-semibold text-blue-400 mb-1">{milestone.year}</div>
                      <h3 className="text-lg font-semibold text-white mb-2">{milestone.title}</h3>
                      <p className="text-gray-400">{milestone.description}</p>
                    </div>
                    <div className="relative flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center z-10">
                        <FiTrendingUp className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="absolute w-16 h-16 rounded-full bg-blue-500/5 animate-ping"></div>
                    </div>
                    <div className="flex-1"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-blue-600/10 via-purple-500/10 to-blue-400/10 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden"
            >
              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Project?</h2>
                <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                  Join tens of satisfied clients who have transformed their digital presence with us.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-semibold inline-flex items-center space-x-2 transition-colors duration-300"
                  onClick={() => window.location.href = '/contact'}
                >
                  <span>Start Your Project</span>
                  <FiTarget className="w-5 h-5" />
                </motion.button>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 transform rotate-6 scale-150"></div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
