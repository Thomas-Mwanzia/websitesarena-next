"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from '@/app/utils/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  faTasks,
  faUsers,
  faCheckCircle,
  faTimesCircle,
  faCodeBranch,
  faSpinner,
  faKey,
  faChevronLeft,
  faChevronRight,
  faLock,
  faListAlt,
  faExternalLinkAlt,
  faBook,
  faComments,
  faPray,
  faReply, 
  faThumbsUp, 
  faThumbtack, 
  faWhatsapp, 
  faBell,
  faHeart
} from '@fortawesome/free-solid-svg-icons';
import { 
  FaEye, 
  FaEyeSlash, 
  FaPray, 
  FaHeart, 
  FaReply, 
  FaCheckCircle,
  FaThumbtack,
  FaBell,
  FaWhatsapp
} from 'react-icons/fa';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

export default function DeveloperDashboard() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workingOn, setWorkingOn] = useState({});
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePassword, setProfilePassword] = useState('');
  const [profileNewPassword, setProfileNewPassword] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [showTeams, setShowTeams] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const [showDeveloperGuide, setShowDeveloperGuide] = useState(false); // Add this state
  const [showSidePanel, setShowSidePanel] = useState(false);  // Add this state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [successWish, setSuccessWish] = useState("Happy coding!");

  useEffect(() => {
    const wishes = [
      "May your code be bug-free!",
      "Happy coding!",
      "Keep crushing it!",
      "You're doing great!"
    ];
    setSuccessWish(wishes[Math.floor(Math.random() * wishes.length)]);
  }, []); // Only run once when component mounts
  const [activeLink, setActiveLink] = useState('activities'); // Add this state
  const [developerName, setDeveloperName] = useState('');
  const [showComms, setShowComms] = useState(false);
  const [adminMessages, setAdminMessages] = useState([]);
  const [messageLoading, setMessageLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [editingMessage, setEditingMessage] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef(null);
  const chatRef = useRef(null);

  // Initialize state from localStorage after mount
  useEffect(() => {
    // Handle workingOn initialization
    try {
      const savedWorkingOn = JSON.parse(localStorage?.getItem('workingOnActivities') || '{}');
      setWorkingOn(savedWorkingOn);
    } catch {
      // If parsing fails, keep default empty object
    }

    // Handle email initialization
    const savedEmail = localStorage?.getItem('developerEmail');
    if (savedEmail) {
      setProfileEmail(savedEmail);
    }
  }, []);

  // Redirect if not signed in
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage?.getItem('developer_token');
      if (!token) {
        router.replace('/signin');
      }
    }
  }, [router]);

  // Show loading state while checking authentication
  if (typeof window !== 'undefined' && !localStorage?.getItem('developer_token')) {
    return null;
  }

  const fetchActivities = async () => {
    setLoading(true);
    try {
  const res = await axios.get('/api/activities');
      setActivities(res.data.data || []);
    } catch {
      // handle error
    }
    setLoading(false);
  };

  const handleWorkingOnIt = async (id) => {
    if (workingOn[id]) return;
    try {
      const developerId = typeof window !== 'undefined' ? localStorage?.getItem('developerId') : null;
  const res = await axios.post(`/api/activities/${id}/working`, developerId ? { developerId } : {});
      setActivities(activities.map(a => a._id === id ? res.data.data : a));
      const updated = { ...workingOn, [id]: true };
      setWorkingOn(updated);
      if (typeof window !== 'undefined') {
        localStorage?.setItem('workingOnActivities', JSON.stringify(updated));
      }
    } catch {
      // handle error
    }
  };

  const handleNotWorkingOnIt = async (id) => {
    if (!workingOn[id]) return;
    try {
      const developerId = typeof window !== 'undefined' ? localStorage?.getItem('developerId') : null;
  const res = await axios.post(`/api/activities/${id}/not-working`, developerId ? { developerId } : {});
      setActivities(activities.map((a) => a._id === id ? res.data.data : a));
      const updated = { ...workingOn };
      delete updated[id];
      setWorkingOn(updated);
      if (typeof window !== 'undefined') {
        localStorage?.setItem('workingOnActivities', JSON.stringify(updated));
      }
    } catch {
      // handle error
    }
  };

  // --- FIX: Use async/await properly and handle errors ---
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage('');
    try {
      // Check if email and password are valid
  const testRes = await axios.post('/api/developers/test-password', {
        email: profileEmail,
        password: profilePassword
      });
      if (!testRes.data.found) {
        setProfileMessage('Developer not found.');
        setProfileLoading(false);
        return;
      }
      if (!testRes.data.valid) {
        setProfileMessage('Current password is incorrect.');
        setProfileLoading(false);
        return;
      }
      // Update password
  const updateRes = await axios.post('/api/developers/reset-password', {
        email: profileEmail,
        newPassword: profileNewPassword
      });
      if (updateRes.data.success) {
        setProfileMessage('Password updated successfully.');
        setProfilePassword('');
        setProfileNewPassword('');
      } else {
        setProfileMessage(updateRes.data.message || 'Error updating password.');
      }
    } catch (err) {
      setProfileMessage(
        err.response?.data?.message ||
        err.message ||
        'Error updating password.'
      );
    }
    setProfileLoading(false);
  };

  // Helper for days remaining
  const getDaysRemaining = (deadline) => {
    if (!deadline) return null;
    const now = new Date();
    const end = new Date(deadline);
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // Priority and status options
  const priorityOptions = ['High', 'Medium', 'Low'];
  const statusOptions = ['Open', 'In Progress', 'Completed'];

  // Add function to get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Add function to get success wish
  const getSuccessWish = () => {
    const wishes = [
      "May your code be bug-free!",
      "Happy coding!",
      "Keep crushing it!",
      "You're doing great!",
      "Success is loading..."
    ];
    return wishes[Math.floor(Math.random() * wishes.length)];
  };

  // Fetch developer name when component mounts
  useEffect(() => {
    const fetchDeveloperName = async () => {
      if (typeof window === 'undefined') return;
      
      try {
        const devEmail = localStorage?.getItem('developerEmail');
        if (!devEmail) return;
  const response = await axios.get(`/api/developers/name/${devEmail}`);
        // backend returns { success: true, data: { name, email } }
        const name = response?.data?.data?.name ?? response?.data?.name ?? '';
        setDeveloperName(name);
        if (name) localStorage?.setItem('developerName', name);
      } catch (error) {
        console.error('Failed to fetch developer name:', error);
      }
    };
    fetchDeveloperName();
  }, []);

  useEffect(() => {
    fetchActivities();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowProfileDropdown(false);
      }
    }
    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  // Update button click handlers to properly reset states
  const handlePasswordClick = () => {
    setShowPasswordModal(true);
    setShowTeams(false);
    setShowStory(false);
    setShowDeveloperGuide(false);
    setShowComms(false); // Add this
    setActiveLink('password');
  };

  const handleActivitiesClick = () => {
    setShowTeams(false);
    setShowStory(false);
    setShowDeveloperGuide(false);
    setShowPasswordModal(false);
    setShowComms(false); // Add this
    setActiveLink('activities');
  };

  const handleTeamsClick = () => {
    setShowTeams(true);
    setShowStory(false);
    setShowDeveloperGuide(false);
    setShowPasswordModal(false);
    setShowComms(false); // Add this
    setActiveLink('teams');
  };

  const handleStoryClick = () => {
    setShowStory(true);
    setShowTeams(false);
    setShowDeveloperGuide(false);
    setShowPasswordModal(false);
    setShowComms(false); // Add this
    setActiveLink('story');
  };

  const handleDeveloperGuideClick = () => {
    setShowDeveloperGuide(true);
    setShowTeams(false);
    setShowStory(false);
    setShowPasswordModal(false);
    setShowComms(false); // Add this
    setActiveLink('guide');
  };

  // Add close handlers for each modal
  const handleCloseTeams = () => {
    setShowTeams(false);
    setShowComms(false);
    setActiveLink('activities');
  };

  const handleCloseStory = () => {
    setShowStory(false);
    setShowComms(false);
    setActiveLink('activities');
  };

  const handleCloseGuide = () => {
    setShowDeveloperGuide(false);
    setShowComms(false);
    setActiveLink('activities');
  };

  const handleClosePassword = () => {
    setShowPasswordModal(false);
    setShowComms(false);
    setProfileMessage('');
    setActiveLink('activities');
  };

  // Add handler for communication button
  const handleCommsClick = () => {
    setShowComms(true);
    setShowTeams(false);
    setShowStory(false);
    setShowDeveloperGuide(false);
    setShowPasswordModal(false);
    setActiveLink('comms');
    fetchAdminMessages(); // Fetch messages when opening
  };

  const handleCloseComms = () => {
    setShowComms(false);
    setActiveLink('activities');
  };

  // Add function to fetch messages
  const fetchAdminMessages = async () => {
    setMessageLoading(true);
    try {
      if (typeof window === 'undefined') return;
      
      const devEmail = localStorage?.getItem('developerEmail');
      if (!devEmail) return;
      
  const res = await axios.get(`/api/chats/${devEmail}`);
      const messages = res.data.data || [];
      setAdminMessages(messages);
      
      // Mark all unread messages as read
      const unreadMessages = messages.filter(msg => !msg.read);
      await Promise.all(
        unreadMessages.map(msg => 
          axios.patch(`/api/chats/${msg._id}/read`)
        )
      );
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
    setMessageLoading(false);
  };

  // Polling for unread messages
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const devEmail = localStorage?.getItem('developerEmail');
    if (!devEmail) return;

    const checkUnread = async () => {
      try {
  const res = await axios.get(`/api/chats/unread/${devEmail}`);
        setUnreadCount(res.data.data);
      } catch (error) {
        console.error('Error checking unread messages:', error);
      }
    };

    checkUnread();
    const interval = setInterval(checkUnread, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Update handleEditMessage to use toast for confirmation
const handleEditMessage = async (messageId, currentText) => {
  toast((t) => {
    let newText = currentText;
    const inputRef = React.createRef();

    const handleSubmit = async () => {
      toast.dismiss(t.id);
      if (!newText || newText === currentText) return;

      try {
  const res = await axios.patch(`/api/chats/${messageId}`, {
          message: newText
        });
        setAdminMessages(messages =>
          messages.map(msg => msg._id === messageId ? res.data.data : msg)
        );
        toast.success('Message updated successfully');
      } catch (error) {
        toast.error('Failed to edit message');
        console.error('Error editing message:', error);
      }
    };

    // Focus input and move cursor to end
    setTimeout(() => {
      if (inputRef.current) {
        const el = inputRef.current;
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }
    }, 100);

    return (
      <div
        style={{
          background: '#2f2f2f',
          color: '#e0e0e0',
          padding: '12px',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          minWidth: '250px'
        }}
      >
        <input
          ref={inputRef}
          type="text"
          defaultValue={currentText}
          onChange={(e) => (newText = e.target.value)}
          style={{
            background: '#3a3a3a',
            color: '#e0e0e0',
            border: '1px solid #555',
            borderRadius: '4px',
            padding: '6px',
            outline: 'none',
            caretColor: '#3b82f6' // blue blinking cursor
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={handleSubmit}
            style={{
              background: 'transparent',
              color: '#4ade80', // green
              border: '1px solid #4ade80',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer'
            }}
          >
            Save
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{
              background: 'transparent',
              color: '#3b82f6', // blue
              border: '1px solid #3b82f6',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }, { duration: Infinity });
};


  // Update handleDeleteMessage to use toast for confirmation
  const handleDeleteMessage = async (messageId) => {
    const confirmed = await new Promise((resolve) => {
      toast.custom((t) => (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg">
          <p className="text-white mb-4">Delete this message?</p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(false);
              }}
              className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(true);
              }}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      ), { duration: Infinity });
    });

    if (!confirmed) return;

    try {
  await axios.delete(`/api/chats/${messageId}`);
      setAdminMessages(messages => messages.filter(msg => msg._id !== messageId));
      toast.success('Message deleted successfully');
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  // Add markAsRead function
  const markAsRead = async (messageId) => {
    try {
  await axios.patch(`/api/chats/${messageId}/read`);
      setAdminMessages(messages =>
        messages.map(msg =>
          msg._id === messageId ? { ...msg, read: true } : msg
        )
      );
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
      toast.success('Message marked as read', {
        duration: 2000,
        position: 'bottom-right'
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast.error('Failed to mark message as read', {
        duration: 3000,
        position: 'bottom-right'
      });
    }
  };

  // Add function to send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setSendingMessage(true);
    try {
  const res = await axios.post('/api/chats/send', {
        sender: profileEmail,
        receiver: 'admin',
        message: newMessage.trim()
      });
      setAdminMessages(prev => [...prev, res.data.data]);
      setNewMessage('');
      toast.success('Message sent');
      
      // Auto scroll
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    } catch (error) {
      toast.error('Failed to send message');
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  useEffect(() => {
    if (showComms) {
      fetchAdminMessages();
    }
  }, [showComms]);

  return (
    <div className="bg-gradient-to-br from-blue-900 via-gray-900 to-black flex">
      {/* Permanent Side Navigation - Increase z-index */}
      <div 
        className={`fixed inset-y-0 left-0 bg-gray-900 transform transition-all duration-300 ease-in-out z-[100] border-r border-blue-700/30 flex flex-col ${
          isSidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="p-4 flex-1">
          <div className="flex items-center justify-between mb-8">
            {!isSidebarCollapsed && (
              <span className="text-xl font-bold text-blue-400">Menu</span>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800"
            >
              <FontAwesomeIcon 
                icon={isSidebarCollapsed ? faChevronRight : faChevronLeft} 
                className="text-lg"
              />
            </button>
          </div>

          <div className="space-y-4">
            {/* Add this button before the other buttons in the sidebar */}
            <button
              className={`w-full px-4 py-3 text-left hover:bg-orange-700/20 rounded-lg transition-all flex items-center gap-3 relative ${
                isSidebarCollapsed ? 'justify-center' : ''
              } ${activeLink === 'comms' ? 'bg-orange-700/40 text-white' : 'text-gray-200'}`}
              onClick={handleCommsClick}
              title="Communication"
            >
              <FontAwesomeIcon icon={faComments} />
              {!isSidebarCollapsed && "Communication"}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              className={`w-full px-4 py-3 text-left hover:bg-green-700/20 rounded-lg transition-all flex items-center gap-3 ${
                isSidebarCollapsed ? 'justify-center' : ''
              } ${activeLink === 'password' ? 'bg-green-700/40 text-white' : 'text-gray-200'}`}
              onClick={handlePasswordClick}
              title="Update Password"
            >
              <FontAwesomeIcon icon={faKey} />
              {!isSidebarCollapsed && "Update Password"}
            </button>
            
            <button
              className={`w-full px-4 py-3 text-left hover:bg-green-700/20 rounded-lg transition-all flex items-center gap-3 ${
                isSidebarCollapsed ? 'justify-center' : ''
              } ${activeLink === 'activities' ? 'bg-green-700/40 text-white' : 'text-gray-200'}`}
              onClick={handleActivitiesClick}
              title="Activities"
            >
              <FontAwesomeIcon icon={faListAlt} />
              {!isSidebarCollapsed && "Activities"}
            </button>

            <button
              className={`w-full px-4 py-3 text-left hover:bg-blue-700/20 rounded-lg transition-all flex items-center gap-3 ${
                isSidebarCollapsed ? 'justify-center' : ''
              } ${activeLink === 'teams' ? 'bg-blue-700/40 text-white' : 'text-gray-200'}`}
              onClick={handleTeamsClick}
              title="Teams"
            >
              <FontAwesomeIcon icon={faUsers} />
              {!isSidebarCollapsed && "Teams"}
            </button>

            <button
              className={`w-full px-4 py-3 text-left hover:bg-blue-700/20 rounded-lg transition-all flex items-center gap-3 ${
                isSidebarCollapsed ? 'justify-center' : ''
              } ${activeLink === 'story' ? 'bg-blue-700/40 text-white' : 'text-gray-200'}`}
              onClick={handleStoryClick}
              title="Story of Hope"
            >
              <FontAwesomeIcon icon={faCodeBranch} />
              {!isSidebarCollapsed && "Story of Hope"}
            </button>

            {/* Add Developer Guide button before Sign Out */}
            <button
              className={`w-full px-4 py-3 text-left hover:bg-purple-700/20 rounded-lg transition-all flex items-center gap-3 ${
                isSidebarCollapsed ? 'justify-center' : ''
              } ${activeLink === 'guide' ? 'bg-purple-700/40 text-white' : 'text-gray-200'}`}
              onClick={handleDeveloperGuideClick}
              title="Developer Guide"
            >
              <FontAwesomeIcon icon={faBook} />
              {!isSidebarCollapsed && "Developer Guide"}
            </button>
          </div>
        </div>

        <button
          className={`p-4 text-left text-red-200 hover:bg-red-700/20 transition-all flex items-center gap-3 mb-4 ${
            isSidebarCollapsed ? 'justify-center' : ''
          }`}
          onClick={() => {
            if (typeof window !== 'undefined') {
              // Clear all developer-related localStorage to avoid leaking state between accounts
              localStorage?.removeItem('developer_token');
              localStorage?.removeItem('developerEmail');
              localStorage?.removeItem('developerId');
              localStorage?.removeItem('developerName');
              localStorage?.removeItem('workingOnActivities');
              router.push('/signin');
            }
          }}
          title="Sign Out"
        >
          <FontAwesomeIcon icon={faTimesCircle} />
          {!isSidebarCollapsed && "Sign Out"}
        </button>
      </div>

      {/* Main Content - Add margin to account for sidebar */}
      <div className={`flex-1 transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <div className="p-8">
          {/* Add greeting section */}
          <div className="mb-8 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-700/30">
            <h1 className="text-2xl font-bold text-white mb-2">
              {getGreeting()}, {developerName || 'Developer'}!
            </h1>
            <p className="text-blue-300">{successWish}</p>
          </div>

          {/* Add Developer Guide Modal */}
          {showDeveloperGuide && (
            <div className={`fixed inset-0 bg-black bg-opacity-75 z-[90] overflow-y-auto ${
              isSidebarCollapsed ? 'ml-16' : 'ml-64'
            }`}>
              <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-gray-900 rounded-xl shadow-2xl p-6 w-full max-w-6xl relative">
                  <button
                    onClick={() => {
                      setShowDeveloperGuide(false);
                      setActiveLink('activities');
                    }}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <DeveloperGuide />
                </div>
              </div>
            </div>
          )}

          {/* Show Teams content if selected */}
          {showTeams && (
            <div className={`fixed inset-0 bg-black bg-opacity-75 z-[90] overflow-y-auto ${
              isSidebarCollapsed ? 'ml-16' : 'ml-64'
            }`}>
              <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-gray-900 rounded-xl shadow-2xl p-6 w-full max-w-6xl relative">
                  <button
                    onClick={handleCloseTeams}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <Teams />
                </div>
              </div>
            </div>
          )}

          {/* Show Story of Hope content if selected */}
          {showStory && (
            <div className={`fixed inset-0 bg-black bg-opacity-75 z-[90] overflow-y-auto ${
              isSidebarCollapsed ? 'ml-16' : 'ml-64'
            }`}>
              <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-gray-900 rounded-xl shadow-2xl p-6 w-full max-w-6xl relative">
                  <button
                    onClick={handleCloseStory}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <StoryOfHope />
                </div>
              </div>
            </div>
          )}

          {/* Password Update Modal */}
          {showPasswordModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-gray-900 rounded-xl shadow-2xl p-8 w-full max-w-xs text-left border border-green-700/40 relative">
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-white"
                  onClick={() => { setShowPasswordModal(false); setProfileMessage(''); }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h2 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faLock} className="text-green-400" />
                  Update Password
                </h2>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-1">Current Password</label>
                    <input
                      type="password"
                      value={profilePassword}
                      onChange={e => setProfilePassword(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 text-white rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">New Password</label>
                    <input
                      type="password"
                      value={profileNewPassword}
                      onChange={e => setProfileNewPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 text-white rounded"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold transition-all"
                  >
                    {profileLoading ? 'Updating...' : 'Update Password'}
                  </button>
                  {profileMessage && (
                    <div className={`mt-2 text-sm ${profileMessage.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                      {profileMessage}
                    </div>
                  )}
                  <div className="mt-4 text-xs text-gray-400">
                    <span className="font-semibold">Note:</span> Name, email, phone, and payment details can only be updated by admin.
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Communication Modal */}
          {showComms && (
            <div className={`fixed inset-0 bg-black bg-opacity-75 z-[90] overflow-y-auto ${
              isSidebarCollapsed ? 'ml-16' : 'ml-64'
            }`}>
              <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-gray-900 rounded-xl shadow-2xl p-6 w-full max-w-6xl relative">
                  <button
                    onClick={handleCloseComms}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-orange-400 mb-2">Communication Center</h2>
                    <p className="text-gray-400">Manage all your project communications in one place</p>
                  </div>

                  {/* Messages from Admin - New Section */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-blue-400 mb-4">Chat with Admin</h3>
                    <div 
                      ref={chatRef}
                      className="bg-gray-800 rounded-lg p-4 max-h-[400px] overflow-y-auto space-y-4 mb-4"
                    >
                      {messageLoading ? (
                        <p className="text-gray-400">Loading messages...</p>
                      ) : adminMessages.length === 0 ? (
                        <p className="text-purple-500">No messages yet, they'll appear here...</p>
                      ) : (
                        adminMessages.map((msg, idx) => (
                          <div key={idx} className={`flex ${msg.sender === 'admin' ? 'justify-start' : 'justify-end'}`}>
                            <div className={`max-w-[80%] rounded-lg px-4 py-2 relative ${
                              msg.sender === 'admin' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-700 text-gray-200'
                            }`}>
                              <p className="text-sm">{msg.message}</p>
                              <div className="flex items-center justify-between text-xs opacity-75">
                                <span>{new Date(msg.createdAt).toLocaleString()}</span>
                                {msg.edited && <span className="italic">(edited)</span>}
                              </div>
                              <div className="flex gap-2 mt-1 items-center">
                                {msg.sender === 'admin' && !msg.read && (
                                  <button 
                                    onClick={() => markAsRead(msg._id)}
                                    className="text-xs flex items-center gap-1 text-red-400 hover:text-red-300"
                                    title="Mark as read"
                                  >
                                    <FaEye /> 
                                    <span>Read</span>
                                  </button>
                                )}
                                {msg.sender === 'admin' && msg.read && (
                                  <span className="text-xs flex items-center gap-1 text-green-400">
                                    <FaEye />
                                    <span>Read</span>
                                  </span>
                                )}
                                {msg.sender !== 'admin' && (
                                  <button 
                                    onClick={() => handleEditMessage(msg._id, msg.message)}
                                    className="text-xs text-blue-300 hover:text-blue-200"
                                  >
                                    Edit
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <form onSubmit={sendMessage} className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Contact the admin by typing a message here..."
                        className="flex-1 bg-gray-800 text-white rounded px-4 py-2"
                      />
                      <button
                        type="submit"
                        disabled={sendingMessage || !newMessage.trim()}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                      >
                        {sendingMessage ? (
                          <>
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            Send
                          </>
                        )}
                      </button>
                    </form>
                  </div>

         
                </div>
              </div>
            </div>
          )}

          {/* Activities Section - Updated Design */}
          {loading ? (
            <div className="flex items-center justify-center gap-2 text-blue-300 animate-pulse">
              <FontAwesomeIcon icon={faSpinner} spin className="text-2xl" />
              Loading activities...
            </div>
          ) : activities.length === 0 ? (
            <div className="text-gray-400">No activities posted yet.</div>
          ) : (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-blue-400 mb-2">Current Activities</h2>
                <p className="text-gray-400">Track and manage ongoing development tasks</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activities.map(activity => (
                  <div 
                    key={activity._id} 
                    className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-xl border border-blue-900/30 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl group flex flex-col"
                  >
                    {/* Header Section - Add text truncate */}
                    <div className="p-5 border-b border-blue-900/30">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-xl text-blue-300 flex items-center gap-2 truncate">
                          <FontAwesomeIcon icon={faTasks} className="text-yellow-400 flex-shrink-0" />
                          <span className="truncate">{activity.title}</span>
                        </h3>
                        {activity.link && (
                          <a
                            href={activity.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 transition-colors p-2 flex-shrink-0"
                            title="Open Link"
                          >
                            <FontAwesomeIcon icon={faExternalLinkAlt} />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Content Section - Add text overflow handling */}
                    <div className="p-5 space-y-4 flex-1 flex flex-col">
                      {/* Description with scrolling */}
                      <div className="bg-black/30 rounded-lg p-4 flex-1 overflow-auto max-h-[200px] scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-transparent">
                        <p className="text-gray-300 whitespace-pre-wrap break-words">{activity.description}</p>
                      </div>

                      {/* Status Badges - Add flex wrap and spacing */}
                      <div className="flex flex-wrap gap-2 mt-auto pt-4">
                        {activity.type && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-500/30 truncate max-w-[150px]">
                            {activity.type}
                          </span>
                        )}
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          activity.priority === 'High' ? 'bg-red-900/50 text-red-300 border border-red-500/30' :
                          activity.priority === 'Medium' ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-500/30' :
                          'bg-green-900/50 text-green-300 border border-green-500/30'
                        }`}>
                          {activity.priority || 'Low'} Priority
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          activity.status === 'Completed' ? 'bg-green-900/50 text-green-300 border border-green-500/30' :
                          activity.status === 'In Progress' ? 'bg-blue-900/50 text-blue-300 border border-blue-500/30' :
                          'bg-gray-900/50 text-gray-300 border border-gray-500/30'
                        }`}>
                          {activity.status || 'Open'}
                        </span>
                      </div>

                      {/* Deadline Section - Add text wrapping */}
                      {activity.deadline && (
                        <div className="flex items-center gap-2 text-sm flex-wrap">
                          <span className="text-gray-400 whitespace-nowrap">Deadline:</span>
                          <span className={`font-medium whitespace-nowrap ${
                            getDaysRemaining(activity.deadline) <= 3 ? 'text-red-400' :
                            getDaysRemaining(activity.deadline) <= 7 ? 'text-yellow-400' :
                            'text-green-400'
                          }`}>
                            {new Date(activity.deadline).toLocaleDateString()} 
                            <span className="whitespace-nowrap">({getDaysRemaining(activity.deadline)} days left)</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Footer Section - Add responsive layout */}
                    <div className="p-5 border-t border-blue-900/30 bg-black/20">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <FontAwesomeIcon icon={faUsers} className="text-blue-400" />
                          <span className="text-sm whitespace-nowrap">
                            <span className="text-gray-400">Working: </span>
                            <span className="text-blue-300 font-medium">{activity.developersWorking}</span>
                          </span>
                        </div>
                        <div className="flex-shrink-0">
                          {!workingOn[activity._id] ? (
                            <button
                              onClick={() => handleWorkingOnIt(activity._id)}
                              className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-2"
                            >
                              <FontAwesomeIcon icon={faCheckCircle} />
                              Work on this
                            </button>
                          ) : (
                            <button
                              onClick={() => handleNotWorkingOnIt(activity._id)}
                              className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center gap-2"
                            >
                              <FontAwesomeIcon icon={faTimesCircle} />
                              Stop working
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function timeAgo(date) {
  const now = Date.now();
  const diff = Math.floor((now - new Date(date).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return new Date(date).toLocaleDateString();
}

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingFor, setSendingFor] = useState(null);
  const [inputs, setInputs] = useState({});
  const [usernameInputs, setUsernameInputs] = useState({});
  const [replyOpen, setReplyOpen] = useState({});
  const [likes, setLikes] = useState({});
  const [pins, setPins] = useState({});
  const [developerName, setDeveloperName] = useState('');
  const [unreadCounts, setUnreadCounts] = useState({});
  const [readTimers, setReadTimers] = useState({}); // Add this state
  const devEmail = typeof window !== 'undefined' ? (localStorage.getItem('developerEmail') || '') : '';
  const chatRefs = useRef({});

  // Store username per team in localStorage
  const getUsername = (teamId) => {
    return localStorage.getItem(`team_username_${teamId}`) || '';
  };
  const setUsername = (teamId, name) => {
    localStorage.setItem(`team_username_${teamId}`, name);
  };

  // Fetch developer name from the server
  const fetchDeveloperName = async () => {
    try {
  const response = await axios.get(`/api/developers/name/${devEmail}`);
      if (response.data && response.data.success) {
        const name = response?.data?.data?.name ?? response?.data?.name ?? '';
        setDeveloperName(name);
        // Store name in local storage for quick access
        if (name) localStorage.setItem('developerName', name);
      }
    } catch (error) {
      console.error('Failed to fetch developer name:', error);
    }
  };

  // Join team: use developer name from the database
  const joinTeam = async (teamId) => {
    if (!devEmail) return;
    
    // Use developer name from database instead of asking
    if (!developerName) {
      toast.error('Unable to get your name. Please try again.');
      return;
    }

    try {
      // Store name for this team
      setUsername(teamId, developerName);
      const res = await axios.post(`${apiUrl}/api/teams/${teamId}/join`, { email: devEmail });
      setTeams(teams.map(t => t._id === teamId ? res.data.data : t));
    } catch (error) {
      toast.error('Failed to join team');
    }
  };

  // Leave team with toast confirmation
  const leaveTeam = async (teamId) => {
    if (!devEmail) return;
    const confirmed = await new Promise((resolve) => {
      toast.custom((t) => (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg">
          <p className="text-white mb-4">Are you sure you want to leave this team?</p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => { toast.dismiss(t.id); resolve(false); }}
              className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={() => { toast.dismiss(t.id); resolve(true); }}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Leave Team
            </button>
          </div>
        </div>
      ), { duration: Infinity });
    });
    if (!confirmed) return;
    try {
      await axios.post(`${apiUrl}/api/teams/${teamId}/leave`, { email: devEmail });
      localStorage.removeItem(`team_username_${teamId}`);
      setTeams(teams.map(t => t._id === teamId ? { ...t, members: t.members.filter(e => e !== devEmail.toLowerCase()) } : t));
      toast.success('You have left the team.');
    } catch {}
  };

  // Send message: use stored username
  const isAdmin = typeof window !== 'undefined' ? localStorage.getItem('isAdmin') === 'true' : false;

  const sendMessage = async (teamId) => {
    if (isAdmin) {
      // Admin can send message without joining
      const text = inputs[teamId]?.text || '';
      if (!text) return;
      
      setSendingFor(teamId);
      try {
        const res = await fetch(`${API_URL}/api/teams/${teamId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            author: 'Admin',
            text,
            email: 'admin@websitesarena.com'
          })
        });
        if (!res.ok) throw new Error('Failed to send message');
        await fetchTeams();
        setInputs(prev => ({...prev, [teamId]: {}}));
      } catch (error) {
        toast.error(error.message);
      } finally {
        setSendingFor(null);
      }
      return;
    }

    // Regular user flow
    const author = getUsername(teamId);
    const text = inputs[teamId]?.text || '';
    if (!author || !text) return;
    setSendingFor(teamId);
    try {
      const res = await axios.post(`${apiUrl}/api/teams/${teamId}/messages`, { author, text, email: devEmail });
      setTeams(teams.map(t => t._id === teamId ? res.data.data : t));
      setInputs({ ...inputs, [teamId]: { text: '' } });
    } finally {
      setSendingFor(null);
    }
  };

  // Reply: use stored username
  const replyTo = async (teamId, messageId) => {
    const author = getUsername(teamId);
    const text = inputs[teamId]?.replyText || '';
    if (!author || !text) return;
    try {
      const res = await axios.post(`${apiUrl}/api/teams/${teamId}/messages/${messageId}/replies`, { author, text, email: devEmail });
      setTeams(teams.map(t => t._id === teamId ? res.data.data : t));
      setInputs({ ...inputs, [teamId]: { ...(inputs[teamId]||{}), replyText: '' } });
    } catch {}
  };

  const editMessage = async (teamId, message) => {
    const newText = prompt('Edit message', message.text);
    if (newText == null) return;
    try {
      const res = await axios.put(`${apiUrl}/api/teams/${teamId}/messages/${message._id}`, { text: newText, author: message.author, email: devEmail });
      setTeams(teams.map(t => t._id === teamId ? res.data.data : t));
    } catch (e) {}
  };

  const deleteMessage = async (teamId, message) => {
    try {
      const res = await axios.delete(`${apiUrl}/api/teams/${teamId}/messages/${message._id}`, { data: { author: message.author, email: devEmail } });
      setTeams(teams.map(t => t._id === teamId ? res.data.data : t));
    } catch (e) {}
  };

  // Only allow one like per user per message (track in localStorage)
  const getLikeKey = (teamId, messageId) => `like_${teamId}_${messageId}_${devEmail}`;
  const handleLike = (teamId, messageId) => {
    const key = `${teamId}_${messageId}`;
    const likeKey = getLikeKey(teamId, messageId);
    if (localStorage.getItem(likeKey)) return;
    setLikes(prev => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
    localStorage.setItem(likeKey, '1');
  };

  // Pin a message (local state only)
  const handlePin = (teamId, messageId) => {
    const key = `${teamId}_${messageId}`;
    setPins(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Calculate unread messages for a team
  const getUnreadCount = (team) => {
    if (!devEmail) return 0;
    return team.messages?.reduce((count, msg) => {
      // Don't count own messages
      if (msg.email === devEmail.toLowerCase()) return count;
      // Count unread messages and replies
      const messageUnread = !msg.readBy?.includes(devEmail.toLowerCase());
      const unreadReplies = msg.replies?.filter(
        r => r.email !== devEmail.toLowerCase() && !r.readBy?.includes(devEmail.toLowerCase())
      ).length || 0;
      return count + (messageUnread ? 1 : 0) + unreadReplies;
    }, 0) || 0;
  };

  // Update markTeamMessagesAsRead to use a timer
  const markTeamMessagesAsRead = async (teamId) => {
    if (!devEmail || readTimers[teamId]) return;
    
    // Set a timer to mark messages as read after 3 seconds
    const timer = setTimeout(async () => {
      try {
        await axios.post(`${apiUrl}/api/teams/${teamId}/messages/read`, { email: devEmail });
        setUnreadCounts(prev => ({ ...prev, [teamId]: 0 }));
        // Clear the timer reference
        setReadTimers(prev => ({ ...prev, [teamId]: null }));
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    }, 3000);

    // Store the timer reference
    setReadTimers(prev => ({ ...prev, [teamId]: timer }));
  };

  // Clean up timers when component unmounts
  useEffect(() => {
    return () => {
      Object.values(readTimers).forEach(timer => {
        if (timer) clearTimeout(timer);
      });
    };
  }, [readTimers]);

  // Update the chat container scroll handler
  const handleChatScroll = (teamId) => {
    if (!devEmail) return;
    markTeamMessagesAsRead(teamId);
  };

  // Fetch teams from API
  const fetchTeams = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/teams`);
      console.log('Fetched teams:', response.data); // Debug log
      if (response.data.success) {
        setTeams(response.data.data || []);
      } else {
        throw new Error(response.data.message || 'Failed to fetch teams');
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      setError(error.response?.data?.message || error.message || 'Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTeams(); }, []);
  useEffect(() => {
    if (devEmail) {
      const storedName = localStorage.getItem('developerName');
      if (storedName) {
        setDeveloperName(storedName);
      } else {
        fetchDeveloperName();
      }
    }
  }, [devEmail]);
  useEffect(() => {
    if (teams.length && devEmail) {
      const counts = teams.reduce((acc, team) => {
        acc[team._id] = getUnreadCount(team);
        return acc;
      }, {});
      setUnreadCounts(counts);
    }
  }, [teams, devEmail]);

  // WhatsApp-like chat bubble style
  const renderMessages = (team) => {
    let lastDate = null;
    return (team.messages || []).map((m, idx) => {
      const isSameDay = lastDate && new Date(m.createdAt).toDateString() === lastDate.toDateString();
      if (!isSameDay) {
        lastDate = new Date(m.createdAt);
      }
      const key = `${team._id}_${m._id}`;
      const isLiked = localStorage.getItem(getLikeKey(team._id, m._id));
      const isPinned = pins[key];

      return (
        <div key={m._id || idx} className="mb-4">
          {!isSameDay && (
            <div className="text-center text-gray-500 text-xs mb-2">
              {new Date(m.createdAt).toLocaleDateString()}
            </div>
          )}
          <div className={`flex ${m.email === devEmail ? 'justify-end' : ''}`}>
            <div className={`rounded-lg px-4 py-2 max-w-[85%] ${
              m.email === devEmail ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'
            }`}>
              <div className="flex items-center gap-1 mb-1">
                <span className="text-sm font-medium">
                  {m.author === 'Admin' ? (
                    <span className="flex items-center">
                      Admin <FaCheckCircle className="text-green-400 ml-1" size={12} />
                    </span>
                  ) : (
                    m.author
                  )}
                </span>
                <div className="flex items-center text-xs opacity-60 ml-2">
                  <span>{timeAgo(m.createdAt)}</span>
                  {m.author !== 'Admin' && isPinned && (
                    <div className="flex items-center ml-1 text-yellow-300">
                      <span className="text-[10px] mr-1">pinned</span>
                      <FaThumbtack size={10} className="text-yellow-300" />
                    </div>
                  )}
                </div>
              </div>

              <p className="break-words">{m.text}</p>

              {/* Interaction buttons - only show for non-admin messages */}
              {m.author !== 'Admin' && (
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <button 
                    onClick={() => handleLike(team._id, m._id)} 
                    className={`flex items-center gap-1 ${isLiked ? 'text-red-400' : 'text-gray-400'} hover:text-red-400`}
                  >
                    <FaHeart size={12} />
                    <span>{(likes[key] || 0) > 0 ? likes[key] : ''}</span>
                  </button>
                  <button 
                    onClick={() => setReplyOpen(prev => ({ ...prev, [key]: !prev[key] }))}
                    className="flex items-center gap-1 text-gray-400 hover:text-blue-400"
                  >
                    <FaReply size={12} />
                    <span>{m.replies?.length || ''}</span>
                  </button>
                  <button 
                    onClick={() => handlePin(team._id, m._id)}
                    className={`${isPinned ? 'text-yellow-400' : 'text-gray-400'} hover:text-yellow-400`}
                  >
                    <FaThumbtack size={12} />
                  </button>
                </div>
              )}

              {/* Reply section - Updated for more compact design */}
              {replyOpen[key] && m.author !== 'Admin' && (
                <div className="mt-2 pt-2 border-t border-gray-600">
                  {m.replies?.map((reply, rIdx) => (
                    <div key={reply._id || rIdx} className="text-sm mb-2">
                      <span className="font-medium">{reply.author}</span>
                      <span className="text-xs opacity-60 ml-2">{timeAgo(reply.createdAt)}</span>
                      <p className="text-sm mt-1">{reply.text}</p>
                    </div>
                  ))}
                  <div className="flex gap-1 mt-2">
                    <input
                      type="text"
                      value={inputs[team._id]?.replyText || ''}
                      onChange={e => setInputs(prev => ({
                        ...prev,
                        [team._id]: { ...prev[team._id], replyText: e.target.value }
                      }))}
                      placeholder="Reply..."
                      className="flex-1 bg-gray-600 rounded px-1.5 py-0.5 text-[11px] min-w-[40px] max-w-[100px]"
                    />
                    <button
                      onClick={() => replyTo(team._id, m._id)}
                      className="bg-blue-500 text-white rounded px-1.5 py-0.5 text-[11px] hover:bg-blue-600"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    });
  };

  // Auto-scroll to latest message (bottom)
  useEffect(() => {
    teams.forEach(team => {
      const el = chatRefs.current[team._id];
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    });
  }, [teams]);

  return (
    <div className="min-h-screen bg-gray-900" style={{ backgroundColor: '#18181b' }}>
      <div className="max-w-6xl mx-auto pt-16 sm:pt-24 px-1 sm:px-4">
        <h1 className="text-2xl sm:text-4xl font-bold text-cyan-400 mb-3 sm:mb-6">Teams</h1>
        <p className="text-cyan-200 mb-4 sm:mb-8 text-xs sm:text-lg">Feel free to join squads and get all help you may need around.</p>
        {loading ? (
          <div className="text-cyan-400 text-sm">Loading...</div>
        ) : teams.length === 0 ? (
          <div className="text-cyan-400 text-sm">No teams yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6">
            {teams.map(team => {
              const isMember = devEmail && team.members?.includes(devEmail.toLowerCase());
              const username = getUsername(team._id);
              const unreadCount = unreadCounts[team._id] || 0;
              return (
                <div key={team._id} className="bg-gradient-to-br from-gray-800 via-gray-700 to-blue-900 rounded-xl sm:rounded-2xl shadow-xl p-2 sm:p-6 flex flex-col border border-cyan-800/30 hover:shadow-2xl transition-all">
                  <div className="flex items-center justify-between mb-1 sm:mb-3">
                    <div>
                      <div className="text-white center font-semibold text-xs sm:text-lg">{team.name}</div>
                      <div className="text-[10px] sm:text-xs text-cyan-300">{team.rank}</div>
                    </div>
                    {isMember && unreadCount > 0 && (
                      <div className="relative">
                        <FaBell className="text-yellow-400 animate-pulse" />
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                  {team.bio && <p className="text-cyan-200 text-[10px] sm:text-sm mb-1 sm:mb-3">{team.bio}</p>}
                  <div className="text-cyan-400 text-[10px] sm:text-xs mb-1 sm:mb-3">
                    <span className="uppercase tracking-wide">Stacks:</span> {Array.isArray(team.techStacks) ? team.techStacks.join(', ') : String(team.techStacks || '')}
                  </div>
                  {/* WhatsApp group link display */}
                  {team.whatsappGroup && (
                    <a
                      href={team.whatsappGroup}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-green-400 text-xs sm:text-sm hover:text-green-300 transition-colors mb-1 sm:mb-3"
                    >
                      <FaWhatsapp className="text-lg" />
                      <span className="underline">WhatsApp</span>
                    </a>
                  )}
                  {/* Join gating */}
                  {!isMember ? (
                    <div className="mt-auto">
                      <div className="text-cyan-400 text-[10px] sm:text-sm mb-1 sm:mb-3">
                        Join this team to chat
                      </div>
                      <button
                        onClick={() => joinTeam(team._id)}
                        disabled={!devEmail || !developerName}
                        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded font-semibold disabled:opacity-50 text-xs sm:text-sm"
                      >
                        {!devEmail ? 'Sign in to Join' : !developerName ? 'Loading...' : 'Join Team'}
                      </button>
                    </div>
                  ) : (
                    <div className="mt-auto flex flex-col flex-1">
                      <div className="flex justify-between items-center mb-1 sm:mb-2">
                        <span className="text-[10px] sm:text-xs text-cyan-400">
                          Username: <span className="font-bold text-cyan-300">{username}</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => leaveTeam(team._id)}
                            className="text-pink-400 text-[10px] sm:text-xs underline"
                          >
                            Leave Team
                          </button>
                          {team.whatsappGroup && (
                            <button
                              onClick={() => window.open(team.whatsappGroup, '_blank')}
                              className="flex items-center gap-1 text-green-400 hover:text-green-300 text-xs sm:text-xs transition-colors"
                              title="WhatsApp Group"
                            >
                              <FaWhatsapp className="text-lg" />
                              <span className="underline">Group</span>
                            </button>
                          )}
                        </div>
                      </div>
                      <div
                        ref={el => chatRefs.current[team._id] = el}
                        className="bg-gradient-to-br from-gray-900 via-blue-900 to-black rounded p-1 sm:p-2 max-h-64 sm:max-h-96 overflow-y-auto mb-2 flex-1"
                        aria-label={`Chat messages for ${team.name}`}
                        role="list"
                        onScroll={() => handleChatScroll(team._id)}
                      >
                        {renderMessages(team)}
                        {(!team.messages || team.messages.length === 0) && <div className="text-cyan-500 text-xs sm:text-sm">No messages yet.</div>}
                      </div>
                      <form
                        className="flex flex-row gap-1 w-full"
                        onSubmit={e => { e.preventDefault(); sendMessage(team._id); }}
                        aria-label="Send message"
                      >
                        <input
                          value={inputs[team._id]?.text || ''}
                          onChange={e => setInputs({ ...inputs, [team._id]: { ...(inputs[team._id]||{}), text: e.target.value } })}
                          placeholder="Type a message..."
                          className="flex-1 px-2 py-1 bg-gray-700 text-white rounded text-xs sm:text-sm border border-cyan-400"
                          aria-label="Message text"
                          style={{ minWidth: '60px', maxWidth: '120px' }}
                          onKeyDown={e => { if (e.key === 'Enter') sendMessage(team._id); }}
                        />
                        <button
                          disabled={sendingFor===team._id}
                          type="submit"
                          className="px-2 py-1 bg-cyan-600 text-white rounded hover:bg-cyan-700 disabled:opacity-50 text-xs sm:text-sm"
                          aria-label="Send message"
                          style={{ minWidth: '40px', fontSize: '11px' }}
                        >
                          {sendingFor===team._id ? '...' : 'Send'}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const StoryOfHope = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    testimony: '',
    prayerRequest: '',
    acceptedDate: new Date().toISOString().split('T')[0]
  });
  const [submitted, setSubmitted] = useState(false);

  const getYoutubeId = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : url.split('si=')[0].split('?')[0].split('/').pop();
  };

  const VideoContainer = ({ link, title }) => (
    <div className="relative w-full max-w-2xl mx-auto mb-6">
      <div className="aspect-video bg-gray-800 rounded-lg">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
          src={`https://www.youtube.com/embed/${getYoutubeId(link)}?rel=0`}
          onLoad={() => setIsLoading(false)}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title}
        />
      </div>
    </div>
  );

  const videos = [
    {
      title: "Understanding the Gospel",
      link: 'https://youtu.be/NUB4I5vO12o?si=5SIqrB0jS46gHUiS'
    },
    {
      title: "The Problem of Sin",
      link: 'https://www.youtube.com/live/shLMIx_hiRA?si=ml340yUMKlJlMfWT'
    },
    {
      title: "Jesus: The Only Way",
      link: 'https://youtu.be/OGo9Y1SeOtU?si=bBmYsh-j2mQ-a2-U'
    },
    {
      title: "How to Receive Salvation",
      link: 'https://youtu.be/sH59j8qfJAI?si=AVvTwZIGO6JL7jbB'
    },
    {
      title: "True Biblical Salvation",
      link: 'https://youtu.be/y7g7qlgdL_8?si=cx8ZiUIQw6LWmBAK' // Using same as above since no link was provided
    },
    {
      title: "Following Christ",
      link: 'https://youtu.be/DsPaeE9d7Ek?si=9Mkg5yoC_A8gdf-h'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dummy submission - replace with actual backend call
    console.log('Prayer request submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
      setFormData({
        name: '',
        country: '',
        testimony: '',
        prayerRequest: '',
        acceptedDate: new Date().toISOString().split('T')[0]
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-2 py-10">
      <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-blue-400 mb-4 text-center">Salvation In Jesus Christ</h1>
        
        {/* Introduction Video */}
        <VideoContainer {...videos[0]} />

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-green-300 mb-2">Our Need for Saving</h2>
          <p className="text-gray-200 mb-2">
            The Bible teaches that all people have sinned and are separated from God. Sin is anything we do, say, or think that goes against God's perfect standard.
          </p>
          <blockquote className="border-l-4 border-blue-500 pl-4 text-blue-200 italic mb-2">
            "For all have sinned and fall short of the glory of God." (Romans 3:23)
          </blockquote>
          <p className="text-gray-200">
            The result of sin is spiritual death—eternal separation from God.
          </p>
          <blockquote className="border-l-4 border-blue-500 pl-4 text-blue-200 italic">
            "For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord." (Romans 6:23)
          </blockquote>
        </section>

        {/* Sin Explanation Video */}
        <VideoContainer {...videos[1]} />

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-green-300 mb-2">Jesus Christ</h2>
                    <blockquote className="border-l-4 border-blue-500 pl-4 text-blue-200 italic mb-2">
            "But God demonstrates his own love for us in this: While we were still sinners, Christ died for us." (Romans 5:8)
          </blockquote>
          <blockquote className="border-l-4 border-blue-500 pl-4 text-blue-200 italic">
            "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life." (John 3:16)
          </blockquote>
          <br />
          <p className="text-gray-200 mb-2">
            God loves us so much that He provided a way to restore our relationship with Him. He sent His Son, Jesus Christ, to live a perfect life, die on the cross for our sins <span style={{ color: 'gray' }}>
  (the death that belonged to us because of our wrong doings)
</span>
, and rise again<span style={{ color: 'gray' }}>
  (Conqured death and sin on our behalf so that when we believe in Him for saving, we can have eternal life)
</span>. <br />
          </p>

        </section>

        {/* Jesus as Savior Video */}
        <VideoContainer {...videos[2]} />

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-green-300 mb-2">Receive the Gift</h2>
          <p className="text-gray-200 mb-2">
            Salvation is a free gift. We cannot earn it by good works or religious rituals. We receive it by faith—trusting in Jesus Christ alone for forgiveness and new life.
          </p>
          <ul className="list-disc pl-6 text-gray-300 mb-2 space-y-1">
            <li>
              <span className="font-semibold text-yellow-300">Repent:</span> Turn away from sin and turn to God.
            </li>
            <li>
              <span className="font-semibold text-yellow-300">Believe:</span> Trust that Jesus died and rose again for you.
            </li>
            <li>
              <span className="font-semibold text-yellow-300">Confess:</span> Declare Jesus as Lord of your life.
            </li>
          </ul>
          <blockquote className="border-l-4 border-blue-500 pl-4 text-blue-200 italic mb-2">
            "If you declare with your mouth, 'Jesus is Lord,' and believe in your heart that God raised him from the dead, you will be saved." (Romans 10:9)
          </blockquote>
          <blockquote className="border-l-4 border-blue-500 pl-4 text-blue-200 italic">
            "For everyone who calls on the name of the Lord will be saved." (Romans 10:13)
          </blockquote>
        </section>

        {/* Salvation Message Video */}
        <VideoContainer {...videos[3]} />
        {/* True Salvation Video */}
        <VideoContainer {...videos[4]} />
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-green-300 mb-2">4. A Simple Prayer of Salvation</h2>
          <p className="text-gray-200 mb-2">
            If you want to receive Jesus as your Savior, you can pray a simple prayer like this:
          </p>
          <div className="bg-blue-900/60 rounded-lg p-4 mb-2 text-blue-100">
"Lord Jesus, I confess that I am a sinner in need of Your forgiveness. I believe that You died on the cross for my sins and rose again to give me new life. I turn away from my sin and invite You into my heart and life. I trust You as my Lord and Savior. Help me to grow, to become the person You created me to be. Teach me to love You, to love others, and to love myself. Thank You for saving me. Amen."</div>
          <p className="text-gray-400 text-sm">
            If you prayed this prayer, welcome to God's family! Find a Bible-believing church, read God's Word, and grow in your new faith.
          </p>
        </section>



        <section>
          <h2 className="text-xl font-semibold text-green-300 mb-2">5. Assurance and Next Steps</h2>
          <p className="text-gray-200 mb-2">
            God promises eternal life to all who trust in Jesus. You can have assurance of your salvation because it is based on God's promise, not your feelings.
          </p>
          <blockquote className="border-l-4 border-blue-500 pl-4 text-blue-200 italic mb-2">
            "I write these things to you who believe in the name of the Son of God so that you may know that you have eternal life." (1 John 5:13)
          </blockquote>
          <ul className="list-disc pl-6 text-gray-300 space-y-1">
            <li>Read the Bible daily to know God more.</li>
            <li>Pray and talk to God regularly.</li>
            <li>Connect with other believers for encouragement and growth.</li>
            <li>Share your story of hope with others!</li>
          </ul>
        </section>

        {/* Discipleship Video */}
        <VideoContainer {...videos[5]} />

        <p className="text-gray-400 text-center mt-8">
          <span className="italic">"Therefore, if anyone is in Christ, he is a new creation; the old has gone, the new is here!" (2 Corinthians 5:17)</span>
        </p>

        {/* New Prayer Request Section */}
        <div className="mt-12 border-t border-gray-700 pt-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-center text-blue-400 mb-6">
              Click if you have received Jesus Christ as your Lord and Savior Today!
            </h2>
            
            {!showForm ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="mx-auto flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg"
              >
                <FaPray className="text-xl" />
                <span>I have accepted Christ Today</span>
                <FaHeart className="text-red-400 animate-pulse" />
              </motion.button>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto space-y-4"
                onSubmit={handleSubmit}
              >
                <div className="space-y-2">
                  <label className="text-gray-300 block">Your Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-gray-300 block">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-300 block">Brief Testimony (Optional)</label>
                  <textarea
                    value={formData.testimony}
                    onChange={(e) => setFormData({ ...formData, testimony: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    rows="3"
                    placeholder="Say Hi to your new family in Christ"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-300 block">Prayer Request (Optional)</label>
                  <textarea
                    value={formData.prayerRequest}
                    onChange={(e) => setFormData({ ...formData, prayerRequest: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    rows="2"
                    placeholder="We would like to include you in our prayers"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </motion.form>
            )}

            {submitted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 bg-green-600/20 border border-green-500 rounded-lg text-green-400 text-center"
              >
                Thank you for sharing! We're rejoicing with you and will be praying for you! 🎉
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const DeveloperGuide = () => {
  const [sections] = useState([
    {
      title: 'Getting Started',
      icon: faCodeBranch,
      content: [
        { 
          subtitle: 'Initial Setup',
          steps: [
            'Request access to the development repository',
            'Install required development tools',
            'Set up your local development environment',
            'Review coding standards and guidelines'
          ]
        },
        {
          subtitle: 'First Steps',
          steps: [
            'Create your developer profile',
            'Join the developer communication channels',
            'Review current project documentation',
            'Set up your development environment'
          ]
        }
      ]
    },
    {
      title: 'Development Workflow',
      icon: faTasks,
      content: [
        {
          subtitle: 'Coding Standards',
          steps: [
            'Follow the established coding style guide',
            'Write clean, maintainable code',
            'Include appropriate comments and documentation',
            'Ensure code meets accessibility standards'
          ]
        },
        {
          subtitle: 'Version Control',
          steps: [
            'Use descriptive commit messages',
            'Create feature branches for new work',
            'Keep commits focused and atomic',
            'Regularly sync with the main branch'
          ]
        }
      ]
    },
    {
      title: 'Best Practices',
      icon: faCheckCircle,
      content: [
        {
          subtitle: 'Code Quality',
          steps: [
            'Write unit tests for new features',
            'Perform code reviews thoroughly',
            'Optimize performance where possible',
            'Follow security best practices'
          ]
        },
        {
          subtitle: 'Collaboration',
          steps: [
            'Communicate regularly with team members',
            'Document significant decisions',
            'Share knowledge and learnings',
            'Be responsive to feedback'
          ]
        }
      ]
    }
  ]);

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-purple-400 mb-2">Developer Guide</h2>
        <p className="text-gray-400">Essential information for contributing to our projects</p>
      </div>

      <div className="grid gap-8">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-gray-800/30 rounded-xl p-6 border border-purple-500/30"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={section.icon} className="text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-purple-300">{section.title}</h3>
            </div>

            <div className="grid gap-6">
              {section.content.map((subsection, subIndex) => (
                <div key={subIndex}>
                  <h4 className="text-lg font-medium text-blue-400 mb-3">{subsection.subtitle}</h4>
                  <ul className="space-y-2">
                    {subsection.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start gap-2 text-gray-300">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-400 mt-1" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// This dashboard displays a list of "activities" fetched from the backend API.
// Each activity shows its title, description, optional project link, and the number of developers working on it.
// The developer can click "Working on it" to increment the count, or "Not working on it" to decrement it.
// The developer's own working status is tracked in localStorage (per browser).
// The UI uses FontAwesome icons and Tailwind CSS for a modern, card-based layout.
// The dashboard is responsive and only focused on activities (no other widgets).








