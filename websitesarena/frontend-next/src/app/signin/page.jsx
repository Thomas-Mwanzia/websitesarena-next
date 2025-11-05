"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/app/utils/axios';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEnvelope, faSpinner, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [adminPending, setAdminPending] = useState(false);
  const [showAdminVerifyModal, setShowAdminVerifyModal] = useState(false);
  const [adminVerificationCode, setAdminVerificationCode] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Sign in the developer
      const res = await axios.post('http://localhost:5000/api/developers/signin', {
        email,
        password
      });

      if (res.data.adminPending) {
        setPendingEmail(email);
        setAdminPending(true);
        setShowAdminVerifyModal(true);
        toast.success(res.data.message || 'Verification code sent');
      } else if (res.data.success) {
        // Save the token and user info
        if (typeof window !== 'undefined') {
          localStorage.setItem('developer_token', res.data.token);
          localStorage.setItem('developerEmail', email);
          localStorage.setItem('developerId', res.data.developer._id);
          localStorage.setItem('developerName', res.data.developer.name);
        }
        toast.success('Successfully signed in!');
        // Redirect to dashboard
        router.push('/dashboard/developer');
      } else {
        setError(res.data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to sign in. Please try again.'
      );
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl opacity-30 -z-10" />

        <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Developer Sign In
            </h1>
            <p className="text-gray-400">Welcome back! Please sign in to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium" htmlFor="email">
                Email Address
              </label>
              <div className="relative group">
                <FontAwesomeIcon 
                  icon={faEnvelope} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors"
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium" htmlFor="password">
                Password
              </label>
              <div className="relative group">
                <FontAwesomeIcon 
                  icon={faLock} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors"
                />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-gray-900/50 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg"
              >
                <p className="text-red-400 text-sm text-center">{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="text-center space-y-2">
              <div className="text-sm text-gray-400">
                <p>Don&apos;t have a developer account?</p>
                <p className="text-blue-400">Contact admin to request access.</p>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
      {/* Admin verification modal */}
      {showAdminVerifyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div onClick={e => e.stopPropagation()} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-gray-700">
            <h4 className="text-lg font-semibold text-white mb-2">verification</h4>
          {/*   <p className="text-sm text-gray-400 mb-4">Enter the 6-digit code sent to <span className="text-white">{pendingEmail}</span>.</p> */}
            <form onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setError('');
              if (!/^[0-9]{6}$/.test(adminVerificationCode)) { setError('Enter a 6-digit code'); setLoading(false); return; }
              try {
                const v = await axios.post('http://localhost:5000/api/developers/verify-admin', { email: pendingEmail, code: adminVerificationCode });
                if (v.data.success && v.data.token) {
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('token', v.data.token);
                    localStorage.setItem('admin_token', v.data.token);
                    localStorage.setItem('adminEmail', pendingEmail);
                    localStorage.setItem('adminName', v.data.user?.name || 'Admin');
                  }
                  toast.success('Admin verified. Redirecting to admin dashboard');
                  setShowAdminVerifyModal(false);
                  router.push('/dashboard/admin');
                } else {
                  setError(v.data.message || 'Verification failed');
                }
              } catch (err) {
                setError(err.response?.data?.message || err.message || 'Verification failed');
              } finally { setLoading(false); }
            }} className="space-y-4">
              <input value={adminVerificationCode} onChange={e => setAdminVerificationCode(e.target.value)} placeholder="123456" className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 text-center text-xl tracking-widest" maxLength={6} required />
              <div className="flex justify-between gap-4">
                <button type="button" onClick={() => { setShowAdminVerifyModal(false); setAdminVerificationCode(''); setPendingEmail(''); }} className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg border-2 border-gray-600 hover:bg-gray-600">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg border-2 border-emerald-400 hover:bg-emerald-600">{loading ? 'Verifying...' : 'Verify'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}