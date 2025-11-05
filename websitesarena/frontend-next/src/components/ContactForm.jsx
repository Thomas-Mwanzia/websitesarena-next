"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { FaCheck } from 'react-icons/fa';
import api from '@/app/utils/axios';
import { packages } from '@/app/BookService/data';

const ContactForm = () => {
  // useSearchParams from next/navigation causes a CSR bailout when used
  // in certain app-router prerender flows. We already read location.search
  // in useEffect to get the package param, so remove useSearchParams to
  // avoid prerender issues.
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    requirements: ''
  });
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Dismiss any existing toasts when component mounts
    toast.dismiss();
    // Access window.location only on the client to avoid SSR errors
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const packageId = params.get('package');
      if (packageId) {
        const selected = packages.find(p => p.id === parseInt(packageId));
        if (selected) {
          setSelectedPackage(selected);
          setFormData(prev => ({
            ...prev,
            service: selected.name
          }));
        }
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/api/bookings', formData);
      toast.success('Message Sent Successfully! We\'ll respond ASAP!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: '',
        requirements: ''
      });
      setSelectedPackage(null);
    } catch (error) {
      toast.error('Failed to submit booking. Please try again.');
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <section className="max-w-3xl mx-auto bg-gray-800 rounded-lg p-8" aria-label="Contact form section">
      <h2 className="sr-only">Contact Form</h2>
      {selectedPackage && (
        <div className="mb-8 p-4 bg-gray-700/50 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{selectedPackage.name}</h3>
              <p className="text-blue-400 font-semibold">{selectedPackage.price}</p>
              <p className="text-sm text-gray-400">{selectedPackage.timeline}</p>
            </div>
            <div className="bg-blue-500/20 p-2 rounded-full">
              <FaCheck className="text-blue-500" />
            </div>
          </div>
          <ul className="space-y-2">
            {selectedPackage.features.slice(0, 3).map((feature) => (
              <li key={feature} className="flex items-start space-x-2 text-gray-300">
                <FaCheck className="text-blue-500 flex-shrink-0 mt-1 text-xs" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-gray-300 mb-2">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 bg-gray-700 text-white rounded cursor-text 
                hover:bg-gray-600 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 
                transition-all duration-300"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 bg-gray-700 text-white rounded cursor-text 
                hover:bg-gray-600 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 
                transition-all duration-300"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-gray-300 mb-2">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded cursor-text 
                hover:bg-gray-600 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 
                transition-all duration-300"
              placeholder="Your phone number"
            />
          </div>
          <div>
            <label htmlFor="company" className="block text-gray-300 mb-2">Company (Optional)</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded cursor-text 
                hover:bg-gray-600 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 
                transition-all duration-300"
              placeholder="Your company name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="requirements" className="block text-gray-300 mb-2">Message</label>
          <textarea
            id="requirements"
            name="requirements"
            value={formData.requirements}
            onChange={handleInputChange}
            required
            rows="6"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded cursor-text 
              hover:bg-gray-600 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 
              transition-all duration-300 resize-none"
            placeholder="How can we help you?"
            aria-label="Your message"
          ></textarea>
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg 
            transition-all duration-300 flex items-center justify-center gap-2
            ${isSubmitting ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'}`}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            'Submit'
          )}
        </motion.button>
      </form>
    </section>
  );
};

export default ContactForm;