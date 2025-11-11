"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import api from '@/app/utils/axios';
import { toast } from 'react-hot-toast';

export const metadata = {
  robots: 'noindex, follow',
  title: 'Client Authentication | Websites Arena',
  description: 'Client sign in and registration'
};

export default function ClientAuth() {
  const [tab, setTab] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [pending, setPending] = useState(null); // { name, email, password }
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pwValid, setPwValid] = useState(false);
  const router = useRouter();

  const close = () => router.back();

  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false
  });

  function checkPasswordStrength(pw) {
    const checks = {
      length: pw.length >= 8,
      lowercase: /[a-z]/.test(pw),
      uppercase: /[A-Z]/.test(pw),
      number: /\d/.test(pw),
      special: /[^A-Za-z0-9]/.test(pw)
    };
    setPasswordChecks(checks);
    const ok = Object.values(checks).every(Boolean);
    setPwValid(ok);
    return ok;
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirm) return toast.error('Passwords do not match');
    if (!checkPasswordStrength(password)) return toast.error('Password must be at least 8 characters and include uppercase, lowercase, number and special character.');
    setLoading(true);
    try {
      // Request verification instead of creating account immediately
      const res = await api.post('/api/clients/request-verification', { name, email, password });
      if (res.data.success) {
        toast.success('Verification code sent to your email');
        setPending({ name, email, password });
        setShowVerifyModal(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally { setLoading(false); }
  };

  const handleResendCode = async () => {
    if (!pending?.email || !pending?.password || !pending?.name) {
      return toast.error('Missing signup information');
    }
    setLoading(true);
    try {
      const res = await api.post('/api/clients/request-verification', {
        name: pending.name,
        email: pending.email,
        password: pending.password
      });
      if (res.data.success) {
        toast.success('New verification code sent to your email');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!pending?.email) return toast.error('No pending signup found');
    if (!/^[0-9]{6}$/.test(verificationCode)) return toast.error('Enter a 6-digit code');
    setLoading(true);
    try {
      const res = await api.post('/api/clients/verify', { email: pending.email, code: verificationCode });
      if (res.data.success) {
        toast.success('Email verified. Please sign in.');
        setShowVerifyModal(false);
        setTab('signin');
        // clear pending
        setPending(null);
        setVerificationCode('');
        setName(''); setEmail(''); setPassword(''); setConfirm('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally { setLoading(false); }
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/api/clients/signin', { email, password });
      if (res.data.success && res.data.token) {
        localStorage.setItem('token', res.data.token);
        // also store client email for dashboard usage
        localStorage.setItem('clientEmail', res.data.user?.email || email);
        toast.success('Signed in');
        router.push('/dashboard/client');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Sign in failed');
    } finally { setLoading(false); }
  };

  const cancelVerification = () => {
    setShowVerifyModal(false);
    setPending(null);
    setVerificationCode('');
  };

  return (
    // overlay: darker gray background
    <div onClick={close} className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-white">Welcome to Websites Arena</h3>
            <p className="text-sm text-gray-400">Sign in or create a client account to manage your projects and track requests.</p>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setTab('signin')} 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                tab === 'signin' 
                  ? 'bg-blue-600 text-white border-2 border-blue-500 shadow-lg shadow-blue-500/20' 
                  : 'bg-gray-800 text-gray-300 border-2 border-gray-700 hover:border-gray-600 hover:bg-gray-700/50'
              }`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setTab('signup')} 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                tab === 'signup' 
                  ? 'bg-blue-600 text-white border-2 border-blue-500 shadow-lg shadow-blue-500/20' 
                  : 'bg-gray-800 text-gray-300 border-2 border-gray-700 hover:border-gray-600 hover:bg-gray-700/50'
              }`}
            >
              Sign Up
            </button>
            <button 
              onClick={close} 
              aria-label="Close" 
              className="ml-2 text-gray-400 hover:text-white p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        {tab === 'signup' ? (
          <form onSubmit={handleSignup} className="space-y-4">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-600" required />
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-600" required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <input value={password} onChange={e => { setPassword(e.target.value); checkPasswordStrength(e.target.value); }} type={showPassword ? 'text' : 'password'} placeholder="Password" className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-600" required />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(s => !s)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-4 h-4" />
                </button>
              </div>
              <div className="relative">
                <input 
                  value={confirm} 
                  onChange={e => setConfirm(e.target.value)} 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  placeholder="Confirm password" 
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-600" 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(s => !s)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-300">
              <div>Password requirements:</div>
              <ul className="mt-1 text-xs space-y-1">
                <li className={`flex items-center space-x-2 ${passwordChecks.length ? 'text-green-400' : 'text-gray-400'}`}>
                  {passwordChecks.length ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    </svg>
                  )}
                  <span>At least 8 characters</span>
                </li>
                <li className={`flex items-center space-x-2 ${passwordChecks.lowercase ? 'text-green-400' : 'text-gray-400'}`}>
                  {passwordChecks.lowercase ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    </svg>
                  )}
                  <span>One lowercase letter</span>
                </li>
                <li className={`flex items-center space-x-2 ${passwordChecks.uppercase ? 'text-green-400' : 'text-gray-400'}`}>
                  {passwordChecks.uppercase ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    </svg>
                  )}
                  <span>One uppercase letter</span>
                </li>
                <li className={`flex items-center space-x-2 ${passwordChecks.number ? 'text-green-400' : 'text-gray-400'}`}>
                  {passwordChecks.number ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    </svg>
                  )}
                  <span>One number</span>
                </li>
                <li className={`flex items-center space-x-2 ${passwordChecks.special ? 'text-green-400' : 'text-gray-400'}`}>
                  {passwordChecks.special ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    </svg>
                  )}
                  <span>One special character</span>
                </li>
              </ul>
            </div>
            <div className="flex justify-between items-center">
              <button type="button" onClick={close} className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg">Cancel</button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg">{loading ? 'Sending code...' : 'Sign Up'}</button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignin} className="space-y-4">
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-600" required />
            <div className="relative">
              <input 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Password" 
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-600" 
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(s => !s)} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-4 h-4" />
              </button>
            </div>
            <div className="flex justify-between items-center">
              <button type="button" onClick={close} className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg">Cancel</button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg">{loading ? 'Signing in...' : 'Sign In'}</button>
            </div>
          </form>
        )}
      </div>
      {/* Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div onClick={e => e.stopPropagation()} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-gray-700">
            <h4 className="text-lg font-semibold text-white mb-2">Verify your email</h4>
            <p className="text-sm text-gray-400 mb-4">Enter the 6-digit code sent to <span className="text-white">{pending?.email}</span>. Code expires in 15 minutes.</p>
            <form onSubmit={handleVerify} className="space-y-4">
              <input 
                value={verificationCode} 
                onChange={e => setVerificationCode(e.target.value)} 
                placeholder="123456" 
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 text-center text-xl tracking-widest" 
                maxLength={6}
                required 
              />
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={loading}
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  Didn't receive the code? Click to resend
                </button>
              </div>
              <div className="flex justify-between gap-4">
                <button 
                  type="button" 
                  onClick={cancelVerification} 
                  className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg border-2 border-gray-600 hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg border-2 border-emerald-400 hover:bg-emerald-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
