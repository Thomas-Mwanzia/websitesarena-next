"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faStore, 
  faComments, 
  faCreditCard, 
  faMobile,
  faSignOutAlt, 
  faTrash,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import axios from '@/app/utils/axios';
import { toast } from 'react-hot-toast';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'api.websitesraena.com';

export default function ClientDashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('update-details');
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/users/me`);
        if (res.data.success) {
          // Check if user is a client (server stores clients as role 'user')
          if (res.data.data.role !== 'user') {
            router.replace('/clientauth');
            return;
          }
          
          setUser(res.data.data);
          setName(res.data.data.name || '');
          setPhone(res.data.data.phone || '');
          setCompany(res.data.data.company || '');
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
        router.replace('/clientauth');
      }
    };
    
    // Check for token first
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/clientauth');
      return;
    }
    
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      if (password && password !== confirmPassword) return toast.error('Passwords do not match');
      const payload = { name, phone, company };
      if (password) payload.password = password;
      const res = await axios.put(`${apiUrl}/api/users/me`, payload);
      if (res.data.success) {
        setUser(res.data.data);
        toast.success('Profile updated');
        setPassword(''); setConfirmPassword('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const [showDeletionConfirm, setShowDeletionConfirm] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const handleRequestDeletion = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
    try {
      const res = await axios.post(`${apiUrl}/api/clients/request-deletion`);
      if (res.data.success) {
        toast.success('Verification code sent to your email');
        setShowDeletionConfirm(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to request account deletion');
    }
  };

  const handleVerifyDeletion = async () => {
    try {
      if (!/^\d{6}$/.test(verificationCode)) {
        return toast.error('Please enter a valid 6-digit code');
      }
      const res = await axios.post(`${apiUrl}/api/clients/verify-deletion`, { code: verificationCode });
      if (res.data.success) {
        localStorage.removeItem('token');
        toast.success('Account successfully deleted');
        router.push('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account');
    }
  };

  const navigationItems = [
    { id: 'update-details', name: 'Update Details', icon: faUser },
    { id: 'apps-sale', name: 'Apps on Sale', icon: faStore },
    { id: 'communication', name: 'Communication', icon: faComments },
    { id: 'payments', name: 'Payments', icon: faCreditCard },
    { id: 'm-apps', name: 'M-Apps', icon: faMobile },
    { id: 'logout', name: 'Log Out', icon: faSignOutAlt },
    { id: 'delete-account', name: 'Delete Account', icon: faTrash, danger: true },
  ];

  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-gray-800 border-r border-gray-700`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4">
            <h2 className={`text-white font-semibold ${!isSidebarOpen && 'hidden'}`}>Client Dashboard</h2>
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300"
            >
              <FontAwesomeIcon icon={isSidebarOpen ? faChevronLeft : faChevronRight} className="w-4 h-4" />
            </button>
          </div>

          <nav className="flex-1 p-2 space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${activeSection === item.id 
                    ? 'bg-blue-600 text-white' 
                    : `${item.danger ? 'text-red-400 hover:bg-red-500/10' : 'text-gray-300 hover:bg-gray-700'}`
                  }
                  ${!isSidebarOpen && 'justify-center'}`}
              >
                <FontAwesomeIcon icon={item.icon} className={`w-5 h-5 ${item.danger && 'text-red-400'}`} />
                <span className={`ml-3 ${!isSidebarOpen && 'hidden'}`}>{item.name}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-700">
            <div className={`flex items-center ${!isSidebarOpen && 'justify-center'}`}>
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-white" />
              </div>
              {isSidebarOpen && (
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">John Doe</p>
                  <p className="text-xs text-gray-400">Premium Client</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="bg-gray-800 rounded-xl p-6">
            {activeSection === 'update-details' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white">Update Details</h3>
                <div className="grid gap-6 max-w-xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                    <input 
                      type="text" 
                      value={company}
                      onChange={e => setCompany(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter new password"
                    />
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full mt-2 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <button onClick={handleSaveProfile} className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            )}
            
            {activeSection === 'apps-sale' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white">Apps on Sale</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((app) => (
                    <div key={app} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
                      <div className="h-40 bg-gray-600 rounded-lg mb-4"></div>
                      <h4 className="text-white font-medium">App Name {app}</h4>
                      <p className="text-gray-300 text-sm mt-2">Description of the app goes here...</p>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-blue-400 font-semibold">$99.99</span>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'communication' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white">Communication</h3>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="space-y-4">
                    {[1, 2, 3].map((message) => (
                      <div key={message} className="flex items-start space-x-4">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                          <FontAwesomeIcon icon={faUser} className="text-white w-4 h-4" />
                        </div>
                        <div className="flex-1 bg-gray-600 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <h4 className="text-white font-medium">Support Team</h4>
                            <span className="text-gray-400 text-xs">2h ago</span>
                          </div>
                          <p className="text-gray-300 text-sm mt-2">Message content goes here...</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex space-x-4">
                    <input 
                      type="text" 
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-600 border border-gray-500 text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="Type your message..."
                    />
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'payments' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white">Payments</h3>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="space-y-4">
                    {[1, 2, 3].map((payment) => (
                      <div key={payment} className="flex items-center justify-between p-4 bg-gray-600 rounded-lg">
                        <div>
                          <h4 className="text-white font-medium">Payment #{payment}</h4>
                          <p className="text-gray-400 text-sm">App Purchase</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">$99.99</p>
                          <p className="text-green-400 text-sm">Completed</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'm-apps' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white">My Apps</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((app) => (
                    <div key={app} className="bg-gray-700 rounded-lg p-4">
                      <div className="h-40 bg-gray-600 rounded-lg mb-4"></div>
                      <h4 className="text-white font-medium">My App {app}</h4>
                      <p className="text-gray-300 text-sm mt-2">Status: Active</p>
                      <div className="flex justify-between items-center mt-4">
                        <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                          Manage
                        </button>
                        <button className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-500">
                          Support
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'delete-account' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-red-400">Delete Account</h3>
                <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                  <p className="text-gray-300">This action cannot be undone. All your data will be permanently deleted.</p>
                  {!showDeletionConfirm ? (
                    <div className="mt-4">
                      <p className="text-sm text-gray-400 mb-4">
                        For security, we'll send a verification code to your email address. You'll need this code to complete the account deletion.
                      </p>
                      <button 
                        onClick={handleRequestDeletion} 
                        className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Request Deletion Code
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <p className="text-sm text-gray-400 mb-4">
                        Enter the 6-digit verification code sent to your email. The code expires in 15 minutes.
                      </p>
                      <div className="space-y-4">
                        <input 
                          type="text"
                          maxLength={6}
                          value={verificationCode}
                          onChange={e => setVerificationCode(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-red-500 text-center text-xl tracking-widest"
                          placeholder="000000"
                        />
                        <div className="flex gap-4">
                          <button 
                            onClick={() => setShowDeletionConfirm(false)} 
                            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={handleVerifyDeletion}
                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                          >
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
