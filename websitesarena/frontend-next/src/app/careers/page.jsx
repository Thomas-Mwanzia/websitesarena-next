"use client";

import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'api.websitesraena.com';

const Careers = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    cv: null
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cvName, setCvName] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'cv' && files && files[0]) {
      setForm((prev) => ({ ...prev, cv: files[0] }));
      setCvName(files[0].name);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileClick = () => {
    fileInputRef.current && fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    if (!form.cv) {
      setError('Please upload your CV/Resume (PDF).');
      toast.error('Please upload your CV/Resume (PDF).');
      setIsSubmitting(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('message', form.message);
      formData.append('cv', form.cv);
      const res = await fetch(`${apiUrl}/api/careers`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        toast.success('Application submitted successfully!');
      } else {
        setError(data.message || 'Submission failed.');
        toast.error(data.message || 'Submission failed.');
      }
    } catch (err) {
      setError('Submission failed. Please try again.');
      toast.error('Submission failed. Please try again.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-20 px-4">
      <div className="max-w-3xl mx-auto bg-gray-900/80 rounded-xl shadow-lg p-8 mt-12">
        <h1 className="text-4xl font-bold text-blue-400 mb-6 text-center">Careers at Websites Arena</h1>
        <p className="text-gray-300 text-lg mb-8 text-center">
          We welcome talented, passionate individuals who believe they are a great fit for our team! If you have skills in web development, mobile apps, design, or related fields, we want to hear from you.
        </p>
        <h2 className="text-xl font-semibold text-blue-300 mb-2">Apply Now</h2>
        {submitted ? (
          <div className="text-green-400 text-center text-lg font-semibold py-8">
            Thank you for your application! We will review your submission and contact you if there’s a match.
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
            <div>
              <label className="block text-gray-300 mb-1 font-medium">Full Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:border-blue-500 focus:outline-none"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1 font-medium">Email Address *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:border-blue-500 focus:outline-none"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1 font-medium">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:border-blue-500 focus:outline-none"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1 font-medium">Tell us about yourself *</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:border-blue-500 focus:outline-none"
                placeholder="Why do you want to join Websites Arena? What makes you a great fit?"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1 font-medium">Attach CV/Resume (PDF, max 2MB)</label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleFileClick}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {cvName ? 'Change File' : 'Choose File'}
                </button>
                <span className="text-gray-400 text-sm truncate max-w-xs">
                  {cvName ? cvName : 'No file chosen'}
                </span>
              </div>
              <input
                type="file"
                name="cv"
                accept="application/pdf"
                onChange={handleChange}
                ref={fileInputRef}
                className="hidden"
              />
            </div>
            {error && <div className="text-red-400 text-sm text-center">{error}</div>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg transition-all duration-200 disabled:opacity-60 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </>
              ) : 'Submit Application'}
            </button>
          </form>
        )}
        <div className="mt-8 text-center text-gray-400 text-sm">
          We review all applications and will contact you if there’s a match. Thank you for your interest!
        </div>
      </div>
    </div>
  );
};

export default Careers;
