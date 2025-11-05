"use client";

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@/app/utils/axios'
import { FaStar, FaQuoteLeft, FaQuoteRight } from 'react-icons/fa'
import toast from 'react-hot-toast'

const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    feedback: '',
    rating: 5,
    image: null
  })
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    fetchFeedbacks()
    // Cleanup function to dismiss any lingering toasts
    return () => toast.dismiss()
  }, [])

  const showErrorToast = (message) => {
    toast.error(`${message}. Please try again.`)
  }

  const fetchFeedbacks = async () => {
    try {
      const response = await api.get('/api/feedback');
      if (response.data && response.data.success) {
        setFeedbacks(response.data.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      showErrorToast(error.response?.data?.message || 'Failed to load feedbacks');
    } finally {
      setLoading(false);
    }
  }

  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      }
      return data.secure_url;
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error('Failed to upload image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      let imageUrl;
      if (formData.image) {
        // Validate image
        if (formData.image.size > 5 * 1024 * 1024) {
          throw new Error('Image size should be less than 5MB');
        }
        if (!formData.image.type.startsWith('image/')) {
          throw new Error('Only image files are allowed');
        }
        // Upload to Cloudinary first
        imageUrl = await uploadImage(formData.image);
      }

      // Send feedback data with image URL
      await api.post('/api/feedback', {
        name: formData.name,
        email: formData.email,
        website: formData.website,
        feedback: formData.feedback,
        rating: formData.rating,
        image: imageUrl
      })
      await fetchFeedbacks()
      toast.success('Thank you for your feedback! It will join the rest in no time ❤️')
      setShowFeedbackForm(false)
      setFormData({ name: '', email: '', website: '', feedback: '', rating: 5, image: null })
      setImagePreview(null)
    } catch (error) {
      let errorMessage = 'Failed to submit feedback';
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      showErrorToast(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-yellow-400' : 'text-gray-400'
        }`}
      />
    ))
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white text-center mb-12"
          >
            What Our Clients Say
          </motion.h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
            >
              {feedbacks.map((feedback) => (
                <motion.div
                  key={feedback._id}
                  variants={itemVariants}
                  className="bg-gray-800 rounded-lg p-6 transform hover:scale-105 transition-transform duration-300"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden mr-4 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                      {feedback.image ? (
                        <img
                          src={feedback.image}
                          alt={feedback.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-white">
                          {feedback.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{feedback.name}</h3>
                      {feedback.website && (
                        <a 
                          href={feedback.website} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                        >
                          {new URL(feedback.website).hostname}
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="mb-4 flex space-x-1">
                    {renderStars(feedback.rating)}
                  </div>

                  <div className="relative">
                    <FaQuoteLeft className="absolute top-0 left-0 text-blue-500 opacity-20 text-3xl" />
                    <br />
                    <p className="text-gray-300 italic px-8 py-2 text-center flex justify-center items-center">
  {feedback.feedback}
</p>

                    <br />
                    <FaQuoteRight className="absolute bottom-0 right-0 text-blue-500 opacity-20 text-3xl" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <AnimatePresence>
            {showFeedbackForm ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Share Your Experience</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Website or App URL (Optional)</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://example.com"
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Rating</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating })}
                          className="focus:outline-none"
                        >
                          <FaStar
                            className={`w-8 h-8 ${
                              rating <= formData.rating
                                ? 'text-yellow-400'
                                : 'text-gray-400'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Your Feedback</label>
                    <textarea
                      value={formData.feedback}
                      onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                      required
                      rows="4"
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Profile Image (Optional)</label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setFormData({ ...formData, image: file });
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setImagePreview(reader.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="px-4 py-2 bg-gray-700 text-gray-300 rounded cursor-pointer hover:bg-gray-600 transition duration-200"
                      >
                        Choose Image
                      </label>
                      {imagePreview && (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, image: null });
                              setImagePreview(null);
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600 transition duration-200"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition duration-300"
                    >
                      {submitting ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowFeedbackForm(false)}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded transition duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <button
                  onClick={() => setShowFeedbackForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300"
                >
                  Share Your Experience
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
  )
}

export default Feedbacks


