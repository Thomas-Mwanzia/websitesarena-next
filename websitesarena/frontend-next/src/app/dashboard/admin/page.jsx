'use client';
export const dynamic = 'force-dynamic';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../utils/axios';
import toast from 'react-hot-toast';
import Head from "next/head";
import { useAuth } from '@/context/page';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { FaCheckCircle, FaPaperPlane, FaEye } from 'react-icons/fa';
// use the shared axios instance `api` for all requests (configured with interceptors)

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// Log warning if API URL is not set in production
if (process.env.NODE_ENV === 'production' && !API_URL) {
  console.warn('Warning: NEXT_PUBLIC_API_BASE_URL is not set in production environment');
}

const getStatusColor = (status) => {
  if (!status) return '';
  const statusLower = status.toLowerCase();
  
  switch (statusLower) {
    case 'completed':
    case 'approved':
    case 'responded':
    case 'sent':
      return 'bg-green-500/20 text-green-400';
    case 'pending':
    case 'in progress':
    case 'unread':
      return 'bg-yellow-500/20 text-yellow-400';
    case 'rejected':
    case 'failed':
      return 'bg-red-500/20 text-red-400';
    default:
      return 'bg-gray-500/20 text-gray-400';
  }
};

const Table = ({ columns, data, actions, onRowClick, cellRenderers = {} }) => (
  <div className="overflow-x-auto w-full">
    <table className="min-w-full divide-y divide-gray-700 text-xs sm:text-sm md:text-base">
      <thead className="bg-gray-800">
        <tr>
          {columns.map((col) => (
            <th key={col} className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">{col}</th>
          ))}
          {actions && <th className="px-2 sm:px-4 py-2"></th>}
        </tr>
      </thead>
      <tbody className="bg-gray-900 divide-y divide-gray-800">
        {data.length === 0 && (
          <tr><td colSpan={columns.length + 1} className="text-center text-gray-500 py-6">No data found.</td></tr>
        )}
        {data.map((row, idx) => (
          <tr key={row._id || idx} className="hover:bg-gray-800 transition-colors cursor-pointer" onClick={e => { if (onRowClick && !(e.target.closest('button') || e.target.tagName === 'BUTTON')) onRowClick(row); }}>
            {columns.map((col) => (
              <td key={col} className="px-2 sm:px-4 py-2 text-gray-200 max-w-[180px] truncate whitespace-nowrap">
                {cellRenderers[col] ? (
                  cellRenderers[col](row[col], row, idx)
                ) : col === 'isApproved' ? 
                  <span className={`px-2 py-1 rounded text-xs font-medium ${row[col] ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {row[col] ? 'True' : 'False'}
                  </span> 
                : col === 'status' ?
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(row[col] || '')}`}>
                    {row[col] || 'N/A'}
                  </span>
                : (col === 'createdAt' || col === 'sentAt') && row[col] ?
                  new Date(row[col]).toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })
                : col === 'imageUrl' && row[col] ?
                  <img src={row[col]} alt="Project" className="w-12 h-8 object-cover rounded" />
                : Array.isArray(row[col]) ? row[col].join(', ') : (row[col] || 'N/A')}
              </td>
            ))}
            {actions && <td className="px-2 sm:px-4 py-2 space-x-2 whitespace-nowrap" onClick={e => e.stopPropagation()}>{actions(row)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { logout } = useAuth();
  
  // Check admin auth on mount and redirect if no token
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage?.getItem('admin_token') : null;
    if (!token) {
      router.replace('/signin');
    }
  }, [router]);
  // Admin auth check effect already implemented above
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailLogsLoading, setEmailLogsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    category: '',
    technologies: '',
    liveUrl: '',
    githubUrl: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedItems, setSelectedItems] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [emailStats, setEmailStats] = useState(null);
  const [emailLogs, setEmailLogs] = useState([]);
  const [editProjectModal, setEditProjectModal] = useState(false);
  const [viewProjectModal, setViewProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [genericModal, setGenericModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [analyticsTab, setAnalyticsTab] = useState('days');
  const [serverLogs, setServerLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [developers, setDevelopers] = useState([]);
  const [devLoading, setDevLoading] = useState(false);
  // Clients state
  const [clients, setClients] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [editClientModal, setEditClientModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientForm, setClientForm] = useState({ name: '', email: '', phone: '', company: '', password: '' });
  const [showDevModal, setShowDevModal] = useState(false);
  const [editDevModal, setEditDevModal] = useState(false);
  const [selectedDev, setSelectedDev] = useState(null);
  const [devForm, setDevForm] = useState({
    name: '',
    email: '',
    phone: '',
    paymentDetails: '',
    password: ''
  });
  const [showCareerModal, setShowCareerModal] = useState(false);
  const [editCareerModal, setEditCareerModal] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [careerForm, setCareerForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Email sending state
  const [emailForm, setEmailForm] = useState({
    to: '',
    subject: '',
    content: '',
    attachments: []
  });
  const [sendingEmail, setSendingEmail] = useState(false);

  // State for analytics and health data
  const [reachData, setReachData] = useState({ days: [], weeks: [], months: [], years: [] });
  const [realtime, setRealtime] = useState(0);
  const [compareData, setCompareData] = useState([]);
  const [demographics, setDemographics] = useState([]);
  const [devices, setDevices] = useState([]);
  const [browsers, setBrowsers] = useState([]);
  const [sources, setSources] = useState([]);
  const [topPages, setTopPages] = useState([]);
  const [bounce, setBounce] = useState(0);
  const [session, setSession] = useState(0);
  const [conversions, setConversions] = useState([]);
  const [uptimeHistory, setUptimeHistory] = useState([]);
  const [errorRate, setErrorRate] = useState([]);
  const [security, setSecurity] = useState([]);
  const [mobile, setMobile] = useState({ score: 0, status: '', suggestion: '' });
  const [a11y, setA11y] = useState({ score: 0, status: '', suggestion: '' });
  const [lighthouse, setLighthouse] = useState([]);
  const [brokenLinks, setBrokenLinks] = useState([]);
  const [ssl, setSSL] = useState({ daysLeft: 0, status: '', suggestion: '' });
  const [dns, setDNS] = useState({ daysLeft: 0, status: '', suggestion: '' });

  // Add these states
  const [unreadCounts, setUnreadCounts] = useState({});
  const [selectedDeveloperUnread, setSelectedDeveloperUnread] = useState(0);

  // Fetch email analytics
  const fetchEmailAnalytics = async () => {
    setEmailLoading(true);
    const toastId = toast.loading('Fetching email analytics...');
    try {
  const response = await api.get('/api/email/analytics');
      setEmailStats(response.data.data);
      toast.success('Email analytics updated', { id: toastId });
    } catch (error) {
      toast.error('Failed to load email analytics', { id: toastId });
    } finally {
      setEmailLoading(false);
    }
  };

  // Fetch email logs
  const fetchEmailLogs = async () => {
    setEmailLogsLoading(true);
    try {
  const res = await api.get('/api/email/logs');
      console.log('Email logs response:', res.data); // Add logging
    
      if (res.data.success) {
        setEmailLogs(res.data.data || []);
        toast.success('Email logs refreshed');
      } else {
        throw new Error(res.data.message || 'Failed to fetch email logs');
      }
    } catch (error) {
      console.error('Failed to fetch email logs:', error);
      toast.error(error.response?.data?.message || 'Failed to load email logs');
      setEmailLogs([]);
    } finally {
      setEmailLogsLoading(false);
    }
  };

  // Fetch server logs
  const fetchServerLogs = async () => {
    setLogsLoading(true);
    try {
  const res = await api.get('/api/admin/logs');
      setServerLogs(res.data.data || []);
    } catch {
      toast.error('Failed to load server logs');
    } finally {
      setLogsLoading(false);
    }
  };

  // Refresh handlers for each tab
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [feedbacksLoading, setFeedbacksLoading] = useState(false);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [careersLoading, setCareersLoading] = useState(false);

  const fetchProjects = async () => {
    setProjectsLoading(true);
    try {
  const res = await api.get('/api/projects');
      setProjects(res.data.data || []);
    
    } catch { toast.error('Failed to refresh projects'); }
    setProjectsLoading(false);
  };
  const fetchFeedbacks = async () => {
    setFeedbacksLoading(true);
    try {
  const res = await api.get('/api/feedback?admin=true');
      setFeedbacks(res.data.data || []);
      toast.success('Feedbacks refreshed');
    } catch { toast.error('Failed to refresh feedbacks'); }
    setFeedbacksLoading(false);
  };
  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
  const res = await api.get('/api/bookings');
      setBookings(res.data.data || []);
      toast.success('Bookings refreshed');
    } catch { toast.error('Failed to refresh bookings'); }
    setBookingsLoading(false);
  };
  const fetchMessages = async () => {
    setMessagesLoading(true);
    try {
  const res = await api.get('/api/messages');
      setMessages(res.data.data || []);
      toast.success('Messages refreshed');
    } catch { toast.error('Failed to refresh messages'); }
    setMessagesLoading(false);
  };
  const fetchCareers = async () => {
    setCareersLoading(true);
    try {
  const res = await api.get('/api/careers');
      setCareers(res.data.data || []);
      toast.success('Careers refreshed');
    } catch { toast.error('Failed to refresh careers'); }
    setCareersLoading(false);
  };

  // Fetch all data
  useEffect(() => {
    setLoading(true);
    Promise.all([
  api.get('/api/projects'),
  api.get('/api/feedback?admin=true'),
  api.get('/api/bookings'),
  api.get('/api/messages'),
  api.get('/api/careers'),
  api.get('/api/email/logs'), // Change endpoint to match backend
    ])
      .then(([proj, feed, book, msg, careersRes, emailRes]) => {
        setProjects(proj.data.data || []);
        setFeedbacks(feed.data.data || []);
        setBookings(book.data.data || []);
        setMessages(msg.data.data || []);
        setCareers(careersRes.data.data || []);
        setEmailLogs(emailRes.data.data || []); 
       
      })
      .catch((error) => {
        console.error('Failed to load admin data:', error);
        toast.error('Failed to load admin data')
      })
      .finally(() => setLoading(false));
  }, []);

  // Fetch analytics and health data from backend
  useEffect(() => {
    if (activeTab === 'analytics') {
      Promise.all([
        api.get('/api/analytics/overview').catch(() => ({ data: { data: [] } })),
        api.get('/api/analytics/demographics').catch(() => ({ data: { data: [] } })),
        api.get('/api/analytics/devices').catch(() => ({ data: { data: [] } })),
        api.get('/api/analytics/browsers').catch(() => ({ data: { data: [] } })), 
        api.get('/api/analytics/sources').catch(() => ({ data: { data: [] } })),
        api.get('/api/analytics/pages').catch(() => ({ data: { data: [] } })),
        api.get('/api/analytics/engagement').catch(() => ({ data: { data: {} } }))
      ]).then(([
        overview,
        demographicsRes,
        devicesRes,
        browsersRes,
        sourcesRes,
        pagesRes,
        engagementRes
      ]) => {
        setReachData(prev => ({ ...prev, days: overview?.data?.data || [] }));
        setDemographics(demographicsRes?.data?.data || []);
        setDevices(devicesRes?.data?.data || []);
        setBrowsers(browsersRes?.data?.data || []);
        setSources(sourcesRes?.data?.data || []);
        setTopPages(pagesRes?.data?.data || []);
        setBounce(engagementRes?.data?.data?.bounce || 0);
        setSession(engagementRes?.data?.data?.session || 0);
        setConversions(engagementRes?.data?.data?.conversions || []);
        // setRealtime and setCompareData can be implemented with real data if available
      }).catch(() => {
        setReachData(prev => ({ ...prev, days: [] }));
        setDemographics([]);
        setDevices([]);
        setBrowsers([]);
        setSources([]);
        setTopPages([]);
        setBounce(0);
        setSession(0);
        setConversions([]);
      });
    }
    if (activeTab === 'health') {
      Promise.all([
        api.get('/api/health/uptime').catch(() => ({ data: { data: [] } })),
        api.get('/api/health/errors').catch(() => ({ data: { data: [] } })),
        api.get('/api/health/security').catch(() => ({ data: { data: [] } })),
        api.get('/api/health/performance').catch(() => ({ data: { data: [] } })),
        api.get('/api/health/links').catch(() => ({ data: { data: [] } })),
        api.get('/api/health/ssl').catch(() => ({ data: { data: { daysLeft: 0, status: 'error', suggestion: 'API unavailable' } } })),
        api.get('/api/health/dns').catch(() => ({ data: { data: { daysLeft: 0, status: 'error', suggestion: 'API unavailable' } } }))
      ]).then(([
        uptimeRes,
        errorRes,
        securityRes,
        performanceRes,
        linksRes,
        sslRes,
        dnsRes
      ]) => {
        setUptimeHistory(uptimeRes?.data?.data || []);
        setErrorRate(errorRes?.data?.data || []);
        setSecurity(securityRes?.data?.data || []);
        setLighthouse(performanceRes?.data?.data || []);
        setBrokenLinks(linksRes?.data?.data || []);
        setSSL(sslRes?.data?.data || { daysLeft: 0, status: '', suggestion: '' });
        setDNS(dnsRes?.data?.data || { daysLeft: 0, status: '', suggestion: '' });
        // setMobile and setA11y can be set from performanceRes if available
      }).catch(() => {
        setUptimeHistory([]);
        setErrorRate([]);
        setSecurity([]);
        setLighthouse([]);
        setBrokenLinks([]);
        setSSL({ daysLeft: 0, status: '', suggestion: '' });
        setDNS({ daysLeft: 0, status: '', suggestion: '' });
      });
    }
  }, [activeTab]);

  // Fetch unread message counts
  const fetchUnreadCounts = async () => {
    try {
  const res = await api.get('/api/chats/admin/unread');
      const counts = {};
      res.data.data.forEach(item => {
        counts[item._id] = item.count;
      });
      setUnreadCounts(counts);
    } catch (error) {
      console.error('Error fetching unread counts:', error);
    }
  };

  // Polling for unread messages
  useEffect(() => {
    fetchUnreadCounts();
    const interval = setInterval(fetchUnreadCounts, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Fetch projects for initial load
  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch email logs on tab change
  useEffect(() => {
    if (activeTab === 'emailLogs') {
      fetchEmailLogs();
    }
  }, [activeTab]);

  // Fetch server logs on tab change
  useEffect(() => {
    if (activeTab === 'serverLogs') {
      fetchServerLogs();
    }
  }, [activeTab]);

  // Fetch developers on tab change
  useEffect(() => {
    if (activeTab === 'developers') {
      fetchDevelopers();
    }
  }, [activeTab]);

  // Fetch activities on tab change
  useEffect(() => {
    if (activeTab === 'activities') {
      fetchActivities();
    }
  }, [activeTab]);

  // Actions
  const handleApproveFeedback = async (id) => {
    const feedback = feedbacks.find(f => f._id === id);
    const confirmed = await new Promise((resolve) => {
      toast.custom(
        (t) => (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg">
            <p className="text-white mb-4">{feedback.isApproved ? 'Disapprove' : 'Approve'} this feedback?</p>
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
                className={`px-3 py-1 ${feedback.isApproved ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'} text-white rounded`}
              >
                {feedback.isApproved ? 'Disapprove' : 'Approve'}
              </button>
            </div>
          </div>
        ),
        { duration: Infinity }
      );
    });

    if (!confirmed) return;

    try {
      const toastId = toast.loading(`${feedback.isApproved ? 'Disapproving' : 'Approving'} feedback...`);
      await api.post(`/api/feedback/${id}/approve`, {
        isApproved: !feedback.isApproved
      });
      setFeedbacks((prev) => prev.map(f => f._id === id ? { ...f, isApproved: !f.isApproved } : f));
      toast.dismiss(toastId);
      toast.success(feedback.isApproved ? 'Feedback disapproved' : 'Feedback approved');
    } catch (error) {
      toast.error('Failed to approve feedback');
    }
  };
  const handleDelete = async (type, id) => {
    const confirmed = await new Promise((resolve) => {
      toast.custom(
        (t) => (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg">
            <p className="text-white mb-4">Are you sure you want to delete this item?</p>
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
        ),
        { duration: Infinity }
      );
    });

    if (!confirmed) return;

    const toastId = toast.loading('Deleting...');
    try {
    // Ensure proper API endpoint based on type
    let endpoint;
    if (type === 'messages') {
      endpoint = `api/messages/${id}`;
    } else if (type === 'feedback') {
      endpoint = `/api/feedback/${id}`;
    } else if (type === 'projects') {
      endpoint = `/api/projects/${id}`;
    } else if (type === 'bookings') {
      endpoint = `/api/bookings/${id}`;
    } else if (type === 'clients') {
      endpoint = `/api/clients/${id}`;
    } else {
      endpoint = `/api/${type}/${id}`;
    }      const response = await api.delete(endpoint);
      
      if (response.data.success) {
        // Update the correct state based on type
        if (type === 'projects') setProjects((prev) => prev.filter(p => p._id !== id));
        if (type === 'feedback') setFeedbacks((prev) => prev.filter(f => f._id !== id));
        if (type === 'bookings') setBookings((prev) => prev.filter(b => b._id !== id));
        if (type === 'messages') setMessages((prev) => prev.filter(m => m._id !== id));
        if (type === 'clients') setClients((prev) => prev.filter(c => c._id !== id));
        
        toast.success('Deleted successfully', { id: toastId });
      } else {
        throw new Error(response.data.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(
        error.response?.data?.message || error.message || 'Delete failed', 
        { id: toastId }
      );
    }
  };

  // Delete email log
  const handleDeleteEmailLog = async (id) => {
    const confirmed = await new Promise((resolve) => {
      toast.custom(
        (t) => (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg">
            <p className="text-white mb-4">Are you sure you want to delete this email log?</p>
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
        ),
        { duration: Infinity }
      );
    });
    if (!confirmed) return;
    try {
      await api.delete(`/api/email/logs/${id}`);
      setEmailLogs((prev) => prev.filter((log) => log._id !== id));
      toast.success('Email log deleted');
    } catch {
      toast.error('Failed to delete email log');
    }
  };

  // Delete career application
  const handleDeleteCareer = async (id) => {
    toast.custom((t) => (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg">
        <p className="text-white mb-4">Are you sure you want to delete this application?</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await api.delete(`/api/careers/${id}`);
                setCareers(prev => prev.filter(c => c._id !== id));
                toast.success('Career application deleted successfully');
              } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete application');
              }
            }}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  // Image upload function
  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'websitesarena');
      formData.append('cloud_name', 'degawfnaz');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/degawfnaz/image/upload`,
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

  // Project submission handler
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let imageUrl;
      if (projectForm.image) {
        if (projectForm.image.size > 5 * 1024 * 1024) {
          toast.error('Image size should be less than 5MB');
          return;
        }
        if (!projectForm.image.type.startsWith('image/')) {
          toast.error('Only image files are allowed');
          return;
        }
        imageUrl = await uploadImage(projectForm.image);
      }

      const response = await api.post('/api/projects', {
        ...projectForm,
        imageUrl,
        technologies: projectForm.technologies.split(',').map(tech => tech.trim())
      });

      if (response.data.success) {
        setProjects([response.data.data, ...projects]);
        setShowProjectModal(false);
        setProjectForm({
          title: '',
          description: '',
          category: '',
          technologies: '',
          liveUrl: '',
          githubUrl: '',
          image: null
        });
        setImagePreview(null);
        toast.success('Project created successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Search and filter handlers
  const handleSearch = async () => {
    setLoading(true);
    toast.loading('Searching...');
    try {
      const response = await api.get('/api/search', {
        params: {
          type: activeTab === 'projects' ? 'projects' : activeTab === 'feedbacks' ? 'feedback' : 'bookings',
          query: searchTerm,
          status: filterStatus,
          startDate: dateRange.start,
          endDate: dateRange.end
        }
      });
      const data = response.data.data;
      if (activeTab === 'projects') setProjects(data);
      if (activeTab === 'feedbacks') setFeedbacks(data);
      if (activeTab === 'bookings') setBookings(data);
      if (activeTab === 'messages') setMessages(data);
    } catch (error) {
      toast.error('Failed to search');
    }
    setLoading(false);
  };

  const handleBulkDelete = async () => {
    if (!selectedItems.length) return;

    const confirmed = await new Promise((resolve) => {
      toast.custom(
        (t) => (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg">
            <p className="text-white mb-4">Delete {selectedItems.length} selected items?</p>
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
                Delete All
              </button>
            </div>
          </div>
        ),
        { duration: Infinity }
      );
    });

    if (!confirmed) return;

    try {
      let type = activeTab;
      if (type === 'projects' || type === 'feedbacks' || type === 'bookings' || type === 'messages') {
        type = type === 'feedbacks' ? 'feedback' : type;
        await api.post('/api/admin/bulk-delete', {
          type,
          ids: selectedItems
        });
      } else if (type === 'activities') {
        await Promise.all(selectedItems.map(id => api.delete(`/api/activities/${id}`)));
      } else if (type === 'teams') {
        await Promise.all(selectedItems.map(id => api.delete(`/api/teams/${id}`)));
      }
      toast.success('Items deleted successfully');
      // Refresh data
      if (activeTab === 'projects') setProjects(projects.filter(p => !selectedItems.includes(p._id)));
      else if (activeTab === 'feedbacks') setFeedbacks(feedbacks.filter(f => !selectedItems.includes(f._id)));
      else if (activeTab === 'bookings') setBookings(bookings.filter(b => !selectedItems.includes(b._id)));
      else if (activeTab === 'messages') setMessages(messages.filter(m => !selectedItems.includes(m._id)));
      else if (activeTab === 'activities') setActivities(activities.filter(a => !selectedItems.includes(a._id)));
      else if (activeTab === 'teams') setTeams(teams.filter(t => !selectedItems.includes(t._id)));
      setSelectedItems([]);
    } catch (error) {
      toast.error('Failed to delete items');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      toast.loading('Updating status...');
      const response = await api.patch(`/api/bookings/${id}/status`, { status });
      setBookings(prev => prev.map(b => b._id === id ? response.data.data : b));
      toast.dismiss();
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const toastId = toast.loading('Updating message status...');
      const response = await api.patch(`/api/messages/${id}/status`, {
        status: 'read'
      });
      setMessages(prev => prev.map(m => m._id === id ? response.data.data : m));
      toast.success('Message marked as read', { id: toastId });
    } catch (error) {
      toast.error('Failed to update message status');
    }
  };

  const handleMessageResponded = async (id) => {
    try {
      const toastId = toast.loading('Marking message as responded...');
      const response = await api.patch(`/api/messages/${id}/status`, {
        status: 'responded'
      });
      setMessages(prev => prev.map(m => m._id === id ? response.data.data : m));
      toast.success('Message marked as responded', { id: toastId });
    } catch (error) {
      toast.error('Failed to update message status');
    }
  };

  const handleMarkAttended = async (id, attended) => {
    try {
      toast.loading('Updating attended status...');
      const response = await api.patch(`/api/bookings/${id}/attended`, { attended: !attended });
      setBookings(prev => prev.map(b => b._id === id ? response.data.data : b));
      toast.dismiss();
      toast.success(`Marked as ${!attended ? 'attended' : 'not attended'}`);
    } catch (error) {
      toast.error('Failed to update attended status');
    }
  };

  // Fetch developers
  const fetchDevelopers = async () => {
    setDevLoading(true);
    try {
      const res = await api.get('/api/developers');
      setDevelopers(res.data.data || []);
    } catch {
      toast.error('Failed to load developers');
    }
    setDevLoading(false);
  };

  // Fetch clients
  const fetchClients = async () => {
    setClientsLoading(true);
    try {
      const res = await api.get('/api/clients');
      setClients(res.data.data || []);
      toast.success('Clients refreshed');
    } catch (err) {
      console.error('Failed to load clients:', err);
      toast.error('Failed to load clients');
      setClients([]);
    }
    setClientsLoading(false);
  };

  // Add developer
  const handleDevSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/developers', devForm);
      setDevelopers([res.data.data, ...developers]);
      setShowDevModal(false);
      setDevForm({ name: '', email: '', phone: '', paymentDetails: '', password: '' });
      toast.success('Developer added');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add developer');
    }
  };

  // Edit developer
  const handleDevEdit = async (e) => {
    e.preventDefault();
    try {
      // Only send password if filled
      const payload = { ...selectedDev };
      if (!payload.password || payload.password.trim() === '') {
        delete payload.password;
      }
      const res = await api.put(`/api/developers/${selectedDev._id}`, payload);
      setDevelopers(developers.map(d => d._id === selectedDev._id ? res.data.data : d));
      setEditDevModal(false);
      setSelectedDev(null);
      toast.success('Developer updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update developer');
    }
  };

  // Delete developer
  const handleDevDelete = async (id) => {
    toast.custom((t) => (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg">
        <p className="text-white mb-4">Delete this developer?</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => { toast.dismiss(t.id); }}
            className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await api.delete(`/api/developers/${id}`);
                setDevelopers(developers.filter(d => d._id !== id));
                toast.success('Developer deleted');
              } catch {
                toast.error('Failed to delete developer');
              }
            }}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  // Activities state
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activityForm, setActivityForm] = useState({ title: '', description: '', type: '', status: '', priority: '', deadline: '' });
  const [editActivityModal, setEditActivityModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Developers-on-activity modal state
  const [showDevelopersModal, setShowDevelopersModal] = useState(false);
  const [activityDevelopers, setActivityDevelopers] = useState([]);
  const [activityDevelopersLoading, setActivityDevelopersLoading] = useState(false);
  const [currentActivityForDevelopers, setCurrentActivityForDevelopers] = useState(null);

  // Teams state
  const [teams, setTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [editTeamModal, setEditTeamModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamForm, setTeamForm] = useState({
    name: '',
    rank: '',
    techStacks: '',
    bio: '',
    whatsappGroup: '',
    members: []
  });

  // Fetch activities
  const fetchActivities = async () => {
    setActivitiesLoading(true);
    try {
      const res = await api.get('/api/activities');
      setActivities(res.data.data || []);
    
    } catch {
      toast.error('Failed to refresh activities');
    }
    setActivitiesLoading(false);
  };

  // Try to fetch developers assigned to an activity (backend endpoint optional)
  const fetchActivityDevelopers = async (activityId) => {
    setActivityDevelopersLoading(true);
    try {
      const res = await api.get(`/api/activities/${activityId}/developers`);
      setActivityDevelopers(res.data.data || []);
    } catch (err) {
      // If backend endpoint not available, leave empty and show informative message in modal
      setActivityDevelopers([]);
    }
    setActivityDevelopersLoading(false);
  };

  const openDevelopersModal = async (activity) => {
    setCurrentActivityForDevelopers(activity);
    setShowDevelopersModal(true);
    await fetchActivityDevelopers(activity._id);
  };

  const closeDevelopersModal = () => {
    setShowDevelopersModal(false);
    setActivityDevelopers([]);
    setCurrentActivityForDevelopers(null);
  };

  // Teams handlers
  const fetchTeams = async () => {
    setTeamsLoading(true);
    try {
      const res = await api.get('/api/teams');
      setTeams(res.data.data || []);
    } catch {
      toast.error('Failed to load teams');
    }
    setTeamsLoading(false);
  };

  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...teamForm,
        techStacks: teamForm.techStacks.split(',').map(t => t.trim()).filter(Boolean)
      };
      const res = await api.post('/api/teams', payload);
      setTeams([res.data.data, ...teams]);
      setShowTeamModal(false);
      setTeamForm({ name: '', rank: '', techStacks: '', bio: '', whatsappGroup: '' });
      toast.success('Team added');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add team');
    }
  };

  const handleTeamEdit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...selectedTeam,
        techStacks: Array.isArray(selectedTeam.techStacks) ? selectedTeam.techStacks : String(selectedTeam.techStacks || '').split(',').map(t=>t.trim()).filter(Boolean)
      };
      const res = await api.put(`/api/teams/${selectedTeam._id}`, payload);
      setTeams(teams.map(t => t._id === selectedTeam._id ? res.data.data : t));
      setEditTeamModal(false);
      setSelectedTeam(null);
      toast.success('Team updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update team');
    }
  };

  const handleTeamDelete = async (id) => {
    const confirmed = await new Promise((resolve) => {
      toast.custom(
        (t) => (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg">
            <p className="text-white mb-4">Delete this team?</p>
            <div className="flex justify-end space-x-2">
              <button onClick={() => { toast.dismiss(t.id); resolve(false); }} className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600">Cancel</button>
              <button onClick={() => { toast.dismiss(t.id); resolve(true); }} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
            </div>
          </div>
        ),
        { duration: Infinity }
      );
    });
    if (!confirmed) return;
    try {
      await api.delete(`/api/teams/${id}`);
      setTeams(teams.filter(tm => tm._id !== id));
      toast.success('Team deleted');
    } catch {
      toast.error('Failed to delete team');
    }
  };

  // Activities handlers
  const handleActivityDelete = async (id) => {
    const confirmed = await new Promise((resolve) => {
      toast.custom(
        (t) => (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg">
            <p className="text-white mb-4">Delete this activity?</p>
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
                Delete
              </button>
            </div>
          </div>
        ),
        { duration: Infinity }
      );
    });
    if (!confirmed) return;
    try {
      await api.delete(`/api/activities/${id}`);
      setActivities(activities.filter(a => a._id !== id));
      toast.success('Activity deleted');
    } catch {
      toast.error('Failed to delete activity');
    }
  };

  useEffect(() => {
    if (activeTab === 'developers') fetchDevelopers();
    if (activeTab === 'activities') fetchActivities();
    if (activeTab === 'teams') fetchTeams();
    if (activeTab === 'clients') fetchClients();
  }, [activeTab]);

  // Table columns
  const projectCols = ['title', 'description', 'category', 'technologies', 'liveUrl', 'githubUrl', 'imageUrl', 'createdAt'];
  const feedbackCols = ['name', 'email', 'website', 'rating', 'isApproved', 'createdAt'];
  const bookingCols = ['name', 'email', 'service', 'description', 'status', 'createdAt'];
  const messageCols = ['name', 'email', 'message', 'status', 'createdAt'];
  const emailLogCols = ['to', 'subject', 'type', 'status', 'sentAt'];
  const careerCols = ['name', 'email', 'phone', 'message', 'cvUrl', 'createdAt'];
  const developerCols = ['name', 'email', 'phone', 'paymentDetails']; // No password column
  const activityCols = ['title', 'description', 'type', 'status', 'priority', 'deadline', 'developersWorking', 'createdAt'];
  const teamCols = ['name', 'rank', 'techStacks', 'bio', 'whatsappGroup', 'createdAt'];
  const clientCols = ['name', 'email', 'company', 'phone', 'createdAt'];

  const priorityOptions = ['High', 'Medium', 'Low'];
const statusOptions = ['Open', 'In Progress', 'Completed'];
const typeOptions = ['Feature', 'Bug', 'Task'];

  // Add this function before the return statement, with other handlers
  const handleSendTeamMessage = async (teamId, text) => {
    if (!text?.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      const res = await api.post(`/api/teams/${teamId}/messages`, {
        author: 'Admin', // Always use "Admin" as author
        text: text.trim(),
        email: 'admin@websitesarena.com',
        isAdmin: true  // Add admin flag
      });

      setTeams(teams.map(t => t._id === teamId ? res.data.data : t));
      setSelectedTeam(prev => ({
        ...res.data.data,
        _newText: ''
      }));
      toast.success('Message sent');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    }
  };

  // Add this handler function near other handlers
  const handleCareerEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/api/careers/${selectedCareer._id}`, selectedCareer);
      if (res.data.success) {
        setCareers(careers.map(c => c._id === selectedCareer._id ? res.data.data : c));
        setEditCareerModal(false);
        setSelectedCareer(null);
        toast.success('Career application updated successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update career application');
    }
  };

  // Chat state
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatRef = useRef(null);

  // Fetch chat messages
  const fetchChatMessages = async (developerEmail) => {
    try {
      const res = await api.get(`/api/chats/${developerEmail}`);
      setChatMessages(res.data.data || []);
      
      // Mark messages as read
      await api.patch(`/api/chats/read/${developerEmail}`);
      setUnreadCounts(prev => ({
        ...prev,
        [developerEmail]: 0
      }));
      
      // Auto scroll
      setTimeout(() => {
        if (chatRef.current) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.error('Error fetching chat:', error);
    }
  };

  // Send message
  const sendChatMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedDeveloper) return;

    try {
      const res = await api.post('/api/chats/send', {
        sender: 'admin',
        receiver: selectedDeveloper.email,
        message: newMessage.trim()
      });
      setChatMessages([...chatMessages, res.data.data]);
      setNewMessage('');
      // Update unread counts
      setUnreadCounts(prev => ({
        ...prev,
        [selectedDeveloper.email]: 0
      }));
      // Auto scroll
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Message edit and delete handlers
  const handleEditMessage = async (messageId, currentText) => {
    const newText = prompt('Edit message:', currentText);
    if (!newText || newText === currentText) return;

    try {
      const res = await api.patch(`/api/chats/${messageId}`, {
        message: newText
      });
      setChatMessages(messages => 
        messages.map(msg => msg._id === messageId ? res.data.data : msg)
      );
    } catch (error) {
      console.error('Error editing message:', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!confirm('Delete this message?')) return;

    try {
  await api.delete(`/api/chats/${messageId}`);
      setChatMessages(messages => messages.filter(msg => msg._id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  // Generic modal for all tables except projects
  const renderGenericModal = () => (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-xs sm:max-w-xl p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Details</h3>
          <button onClick={() => setGenericModal(false)} className="text-gray-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-2 text-gray-200 max-h-[60vh] overflow-y-auto">
          {Object.entries(selectedRow).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong>
              {key === 'cvUrl' && value ? (
                <a
                  href={value.startsWith('/uploads') ? `${API_URL}${value}` : value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline ml-2"
                >
                  View CV
                </a>
              ) : key === 'deadline' ? (
                (() => {
                  if (!value) return <span className="ml-2 text-gray-400">No deadline</span>;
                  try {
                    const now = new Date();
                    const end = new Date(value);
                    const diffDays = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
                    if (diffDays < 0) return <span className="ml-2 text-red-400">Overdue by {Math.abs(diffDays)} d</span>;
                    return <span className="ml-2 text-green-300">{diffDays} d left</span>;
                  } catch {
                    return <span className="ml-2">{String(value)}</span>;
                  }
                })()
              ) : key === 'developersWorking' ? (
                <button onClick={() => openDevelopersModal(selectedRow)} className="ml-2 px-2 py-1 bg-indigo-600 text-white rounded text-sm">{typeof value === 'number' ? value : 0}</button>
              ) : Array.isArray(value) ? value.join(', ') :
                (typeof value === 'object' && value !== null && value.url) ? <a href={value.url} className="text-blue-400 underline">{value.url}</a> :
                (typeof value === 'string' && value.startsWith('http') && (value.endsWith('.jpg') || value.endsWith('.png') || value.endsWith('.jpeg') || value.endsWith('.webp'))) ? <img src={value} alt={key} className="w-32 h-20 object-cover rounded mt-2" /> :
                (key === 'createdAt' || key === 'sentAt') ? new Date(value).toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' }) :
                String(value)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Update markAsRead function to include admin flag
  const markAsRead = async (messageId) => {
    try {
      const res = await api.patch(`/api/chats/${messageId}/read?isAdmin=true`);
      setChatMessages(messages =>
        messages.map(msg =>
          msg._id === messageId ? { ...msg, adminRead: true, adminReadAt: new Date() } : msg
        )
      );
      
      // Update unread count for current developer
      if (selectedDeveloper) {
        setUnreadCounts(prev => ({
          ...prev,
          [selectedDeveloper.email]: Math.max(0, (prev[selectedDeveloper.email] || 0) - 1)
        }));
      }
      
      toast.success('Message marked as read');
    } catch (error) {
      toast.error('Failed to mark message as read');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-20 sm:pt-24 lg:pt-32 px-2 sm:px-4 md:px-8">
      <div className="max-w-7xl mx-auto w-full">
<Head>
  <title>Dashboard - Quick Feet Admin</title>
  <meta name="description" content="Admin dashboard for Quick Feet website" />
</Head>

        <div className="flex items-start justify-between">
          <h1
            style={{ fontFamily: "Cinzel, serif" }}
            className="text-6xl text-gray-100 drop-shadow-sm bg-black/10 px-8 py-6 rounded-xl"
          >
            Quick Feet 🐾
          </h1>
          <div className="ml-4 mt-6">
            <button
              onClick={() => { 
                // Clear all tokens and force redirect to signin
                logout(); 
                localStorage.removeItem('admin_token');  // Extra safety: ensure admin token is cleared
                localStorage.removeItem('adminEmail');
                localStorage.removeItem('adminName');
                router.replace('/signin');
                window.location.replace('/signin');
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
        
        <nav className="mb-8">
          <ul className="flex overflow-x-auto whitespace-nowrap space-x-2 sm:space-x-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            <li><button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-md ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>Overview</button></li>
            <li><button onClick={() => setActiveTab('analytics')} className={`px-4 py-2 rounded-md ${activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>Reach Analytics</button></li>
            <li><button onClick={() => setActiveTab('health')} className={`px-4 py-2 rounded-md ${activeTab === 'health' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>Website Health</button></li>
            <li><button onClick={() => setActiveTab('projects')} className={`px-4 py-2 rounded-md ${activeTab === 'projects' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>Projects</button></li>
            <li><button onClick={() => setActiveTab('feedbacks')} className={`px-4 py-2 rounded-md ${activeTab === 'feedbacks' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>Feedbacks</button></li>
            <li><button onClick={() => setActiveTab('bookings')} className={`px-4 py-2 rounded-md ${activeTab === 'bookings' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>Bookings</button></li>
            <li><button onClick={() => setActiveTab('messages')} className={`px-4 py-2 rounded-md ${activeTab === 'messages' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>Messages</button></li>
            <li><button onClick={() => setActiveTab('clients')} className={`px-4 py-2 rounded-md ${activeTab === 'clients' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>Clients</button></li>
            <li><button onClick={() => setActiveTab('email')} className={`px-4 py-2 rounded-md ${activeTab === 'email' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>Send Email</button></li>
            <li><button onClick={() => setActiveTab('emailLogs')} className={`px-4 py-2 rounded-md ${activeTab === 'emailLogs' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>Email Logs</button></li>
            <li><button onClick={() => { setActiveTab('serverLogs'); fetchServerLogs(); }} className={`px-4 py-2 rounded-md ${activeTab === 'serverLogs' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>Server Logs</button></li>
            <li><button onClick={() => setActiveTab('careers')} className={`px-4 py-2 rounded-md ${activeTab === 'careers' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>Careers</button></li>
            <li>
              <button 
                onClick={() => setActiveTab('developers')} 
                className={`px-4 py-2 rounded-md relative ${
                  activeTab === 'developers' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Developers
                {Object.values(unreadCounts).reduce((sum, count) => sum + count, 0) > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {Object.values(unreadCounts).reduce((sum, count) => sum + count, 0)}
                  </span>
                )}
              </button>
            </li>
            <li><button onClick={() => setActiveTab('activities')} className={`px-4 py-2 rounded-md ${activeTab === 'activities' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>Activities</button></li>
            <li><button onClick={() => setActiveTab('teams')} className={`px-4 py-2 rounded-md ${activeTab === 'teams' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>Teams</button></li>
            
          </ul>
        </nav>

        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
                  <div className="bg-gray-800 rounded-lg p-6 text-center">
                    <h2 className="text-2xl font-bold text-blue-400">{projects.length}</h2>
                    <p className="text-gray-300">Projects</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-6 text-center">
                    <h2 className="text-2xl font-bold text-blue-400">{feedbacks.length}</h2>
                    <p className="text-gray-300">Feedbacks</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-6 text-center">
                    <h2 className="text-2xl font-bold text-blue-400">{bookings.length}</h2>
                    <p className="text-gray-300">Bookings</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-6 text-center">
                    <h2 className="text-2xl font-bold text-blue-400">{messages.length}</h2>
                    <p className="text-gray-300">Messages</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-6 text-center">
                    <h2 className="text-2xl font-bold text-blue-400">{emailLogs.length}</h2>
                    <p className="text-gray-300">Email Logs</p>
                  </div>
                </div>

                {/* Email Analytics Section */}
                <div className="bg-gray-800 rounded-lg p-6 mb-8 min-h-[60vh] flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Email Analytics</h3>
                    <button 
                      onClick={fetchEmailAnalytics} 
                      disabled={emailLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                    >
                      {emailLoading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Refreshing...</span>
                        </>
                      ) : (
                        <span>Refresh</span>
                      )}
                    </button>
                  </div>

                  {emailStats ? (
                    <div className="space-y-8">
                      {/* Email Stats Overview */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-gray-700/50 rounded-lg p-4">
                          <p className="text-gray-400">Total Emails</p>
                          <p className="text-2xl font-bold text-white">{emailStats.totalEmails}</p>
                        </div>
                        <div className="bg-gray-700/50 rounded-lg p-4">
                          <p className="text-gray-400">Success Rate</p>
                          <p className="text-2xl font-bold text-green-400">{emailStats.successRate}%</p>
                        </div>
                        <div className="bg-gray-700/50 rounded-lg p-4">
                          <p className="text-gray-400">Failed Emails</p>
                          <p className="text-2xl font-bold text-red-400">{emailStats.failedEmails}</p>
                        </div>
                      </div>

                      {/* Recent Emails */}
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Recent Emails</h4>
                        <div className="bg-gray-900 rounded-lg overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-800">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300">Recipient</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300">Subject</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300">Type</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                              {emailStats.recentEmails.map((email, idx) => (
                                <tr key={idx}>
                                  <td className="px-4 py-2 text-gray-300">{email.to}</td>
                                  <td className="px-4 py-2 text-gray-300">{email.subject}</td>
                                  <td className="px-4 py-2 text-gray-300">{email.type}</td>
                                  <td className="px-4 py-2">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                      email.status === 'sent' 
                                        ? 'bg-green-500/20 text-green-400' 
                                        : 'bg-red-500/20 text-red-400'
                                    }`}>
                                      {email.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Top Recipients */}
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Top Recipients</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {emailStats.topRecipients.map((recipient, idx) => (
                            <div key={idx} className="bg-gray-700/50 rounded-lg p-4">
                              <p className="text-gray-300 font-medium">{recipient._id}</p>
                              <div className="flex justify-between mt-2">
                                <span className="text-gray-400">Total: {recipient.count}</span>
                                <span className="text-green-400">Success: {recipient.successCount}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400">
                      Click refresh to load email analytics
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'email' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">Send Email</h2>
                </div>
                <div className="bg-gray-800 rounded-lg p-6">
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      setSendingEmail(true);
                      const formData = new FormData();
                      formData.append('to', emailForm.to);
                      formData.append('subject', emailForm.subject);
                      formData.append('content', emailForm.content);
                      emailForm.attachments.forEach(file => {
                        formData.append('attachments', file);
                      });
                      
                      const response = await api.post('/api/email/send', formData, {
                        headers: {
                          'Content-Type': 'multipart/form-data',
                        },
                      });
                      toast.success('Email sent successfully');
                      setEmailForm({
                        to: '',
                        subject: '',
                        content: '',
                        attachments: []
                      });
                    } catch (error) {
                      toast.error(error.response?.data?.message || 'Failed to send email');
                    } finally {
                      setSendingEmail(false);
                    }
                  }} className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-bold mb-2">To</label>
                      <input
                        type="email"
                        value={emailForm.to}
                        onChange={e => setEmailForm(prev => ({ ...prev, to: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        required
                        placeholder="recipient@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-bold mb-2">Subject</label>
                      <input
                        type="text"
                        value={emailForm.subject}
                        onChange={e => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        required
                        placeholder="Email subject"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-bold mb-2">Content</label>
                      <textarea
                        value={emailForm.content}
                        onChange={e => setEmailForm(prev => ({ ...prev, content: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[200px]"
                        required
                        placeholder="Write your email content here..."
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-bold mb-2">Attachments</label>
                      <input
                        type="file"
                        multiple
                        onChange={e => {
                          const files = Array.from(e.target.files);
                          setEmailForm(prev => ({ ...prev, attachments: files }));
                        }}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                      {emailForm.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {emailForm.attachments.map((file, index) => (
                            <div key={index} className="flex items-center justify-between text-sm text-gray-300">
                              <span>{file.name}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setEmailForm(prev => ({
                                    ...prev,
                                    attachments: prev.attachments.filter((_, i) => i !== index)
                                  }));
                                }}
                                className="text-red-400 hover:text-red-300"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={sendingEmail}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                      >
                        {sendingEmail ? (
                          <>
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>Sending...</span>
                          </>
                        ) : (
                          <span>Send Email</span>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="bg-gray-800 rounded-lg p-6 mb-8 min-h-[60vh] flex flex-col gap-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                  <h3 className="text-xl font-bold text-white">Reach Analytics</h3>
                  <div className="flex gap-2 flex-wrap items-center">
                    {['days', 'weeks', 'months', 'years'].map(tab => (
                      <button key={tab} onClick={() => setAnalyticsTab(tab)} className={`px-3 py-1 rounded ${analyticsTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
                    ))}
                    <input type="date" value={dateRange.start} onChange={e => setDateRange({ ...dateRange, start: e.target.value })} className="bg-gray-700 text-white rounded px-2 py-1" />
                    <span className="text-gray-400">to</span>
                    <input type="date" value={dateRange.end} onChange={e => setDateRange({ ...dateRange, end: e.target.value })} className="bg-gray-700 text-white rounded px-2 py-1" />
                    <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Export CSV</button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={reachData[analyticsTab]} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="reach" stroke="#3B82F6" strokeWidth={3} dot={{ r: 5, fill: '#3B82F6' }} />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col gap-4">
                    <div className="bg-gray-900 rounded-lg p-4">
                      <h4 className="text-white font-bold mb-2">Real-Time Visitors</h4>
                      <p className="text-3xl text-blue-400 font-bold">{realtime}</p>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <h4 className="text-white font-bold mb-2">Compare Periods</h4>
                      <BarChart width={200} height={120} data={compareData}>
                        <XAxis dataKey="period" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip />
                        <Bar dataKey="reach" fill="#10B981" />
                      </BarChart>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h4 className="text-white font-bold mb-2">User Demographics</h4>
                    <PieChart width={200} height={200}>
                      <Pie data={demographics} dataKey="users" nameKey="country" cx="50%" cy="50%" outerRadius={60} fill="#3B82F6" label />
                    </PieChart>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h4 className="text-white font-bold mb-2">Devices</h4>
                    <PieChart width={200} height={200}>
                      <Pie data={devices} dataKey="users" nameKey="type" cx="50%" cy="50%" outerRadius={60} fill="#10B981" label />
                    </PieChart>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h4 className="text-white font-bold mb-2">Browsers</h4>
                    <PieChart width={200} height={200}>
                      <Pie data={browsers} dataKey="users" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="#F59E42" label />
                    </PieChart>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h4 className="text-white font-bold mb-2">Traffic Sources</h4>
                    <PieChart width={200} height={200}>
                      <Pie data={sources} dataKey="value" nameKey="source" cx="50%" cy="50%" outerRadius={60} fill="#EF4444" label />
                    </PieChart>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h4 className="text-white font-bold mb-2">Top Pages</h4>
                    <ul className="text-gray-200">
                      {topPages.map(page => (
                        <li key={page.page}>{page.page}: <span className="font-bold text-blue-400">{page.views}</span></li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h4 className="text-white font-bold mb-2">Bounce Rate</h4>
                    <p className="text-2xl text-yellow-400 font-bold">{bounce}%</p>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h4 className="text-white font-bold mb-2">Session Duration</h4>
                    <p className="text-2xl text-green-400 font-bold">{session} min</p>
                  </div>
                </div>
                <div className="bg-gray-900 rounded-lg p-4">
                  <h4 className="text-white font-bold mb-2">Conversions</h4>
                  <ul className="text-gray-200">
                    {conversions.map(conv => (
                      <li key={conv.type}>{conv.type}: <span className="font-bold text-green-400">{conv.count}</span></li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'health' && (
              <div className="bg-gray-800 rounded-lg p-6 mb-8 min-h-[40vh] flex flex-col gap-8">
                <h3 className="text-xl font-bold text-white mb-6">Website Health</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h4 className="text-white font-bold mb-2">Uptime History</h4>
                    <ResponsiveContainer width="100%" height={120}>
                      <LineChart data={uptimeHistory}>
                        <XAxis dataKey="day" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip />
                        <Line type="monotone" dataKey="uptime" stroke="#10B981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h4 className="text-white font-bold mb-2">Error Rate (Monthly)</h4>
                    <ResponsiveContainer width="100%" height={120}>
                      <BarChart data={errorRate}>
                        <XAxis dataKey="month" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip />
                        <Bar dataKey="errors" fill="#EF4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h4 className="text-white font-bold mb-2">Security</h4>
                    <ul className="text-gray-200">
                      {security.map(sec => (
                        <li key={sec.name}>{sec.name}: <span className={`font-bold ${sec.status === 'good' ? 'text-green-400' : 'text-red-400'}`}>{sec.value}</span> <span className="text-xs">({sec.suggestion})</span></li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h4 className="text-white font-bold mb-2">Mobile Friendliness</h4>
                    <p className={`text-2xl font-bold ${mobile.status === 'good' ? 'text-green-400' : 'text-yellow-400'}`}>{mobile.score}</p>
                    <p className="text-gray-300">{mobile.suggestion}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h4 className="text-white font-bold mb-2">Accessibility Score</h4>
                    <p className={`text-2xl font-bold ${a11y.status === 'good' ? 'text-green-400' : 'text-yellow-400'}`}>{a11y.score}</p>
                    <p className="text-gray-300">{a11y.suggestion}</p>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h4 className="text-white font-bold mb-2">Lighthouse Audits</h4>
                    <ul className="text-gray-200">
                      {lighthouse.map(lh => (
                        <li key={lh.name}>{lh.name}: <span className="font-bold text-blue-400">{lh.score}</span></li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h4 className="text-white font-bold mb-2">Broken Links</h4>
                    <ul className="text-gray-200">
                      {brokenLinks.map(link => (
                        <li key={link.url}>{link.url} <span className="text-xs">({link.type})</span></li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h4 className="text-white font-bold mb-2">SSL & DNS Expiry</h4>
                    <p className="text-green-400">SSL: {ssl.daysLeft} days left</p>
                    <p className="text-green-400">DNS: {dns.daysLeft} days left</p>
                  </div>
                </div>
                <div className="bg-gray-900 rounded-lg p-4">
                  <h4 className="text-white font-bold mb-2">Actionable Fixes</h4>
                  <ul className="text-blue-400">
                    <li><a href="https://web.dev/measure/" target="_blank" rel="noopener noreferrer">Run Google Lighthouse Audit</a></li>
                    <li><a href="https://developers.google.com/speed/pagespeed/insights/" target="_blank" rel="noopener noreferrer">Check PageSpeed Insights</a></li>
                    <li><a href="https://www.ssllabs.com/ssltest/" target="_blank" rel="noopener noreferrer">Test SSL</a></li>
                    <li><a href="https://wave.webaim.org/" target="_blank" rel="noopener noreferrer">Accessibility Check</a></li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div>
                               <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">Projects Management</h2>
                  <div className="flex gap-2">
                    <button onClick={fetchProjects} disabled={projectsLoading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">{projectsLoading ? 'Refreshing...' : 'Refresh'}</button>
                    <button onClick={() => setShowProjectModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Project</button>
                    {selectedItems.length > 0 && (
                      <button onClick={handleBulkDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                        Delete Selected ({selectedItems.length})
                      </button>
                    )}
                  </div>
                </div>
                <Table columns={projectCols} data={projects} actions={(row) => (
                  <>
                    <button onClick={() => { setSelectedProject(row); setViewProjectModal(true); }} className="text-blue-400 hover:underline mr-2">View</button>
                    <button onClick={() => { setSelectedProject(row); setEditProjectModal(true); }} className="text-yellow-400 hover:underline mr-2">Edit</button>
                    <button onClick={() => handleDelete('projects', row._id)} className="text-red-400 hover:underline ml-2">Delete</button>
                  </>
                )} onRowClick={row => { setSelectedProject(row); setViewProjectModal(true); }} />
                {/* View Project Modal */}
                {viewProjectModal && selectedProject && (
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
                    <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-xs sm:max-w-xl p-4 sm:p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white">Project Details</h3>
                        <button onClick={() => setViewProjectModal(false)} className="text-gray-400 hover:text-white">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="space-y-2 text-gray-200">
                        <div><strong>Title:</strong> {selectedProject.title}</div>
                        <div><strong>Description:</strong> {selectedProject.description}</div>
                        <div><strong>Category:</strong> {selectedProject.category}</div>
                        <div><strong>Technologies:</strong> {Array.isArray(selectedProject.technologies) ? selectedProject.technologies.join(', ') : selectedProject.technologies}</div>
                        <div><strong>Live URL:</strong> <a href={selectedProject.liveUrl} className="text-blue-400 underline" target="_blank" rel="noopener noreferrer">{selectedProject.liveUrl}</a></div>
                        <div><strong>GitHub URL:</strong> <a href={selectedProject.githubUrl} className="text-blue-400 underline" target="_blank" rel="noopener noreferrer">{selectedProject.githubUrl}</a></div>
                        <div><strong>Image:</strong> {selectedProject.imageUrl && <img src={selectedProject.imageUrl} alt="Project" className="w-32 h-20 object-cover rounded mt-2" />}</div>
                        <div><strong>Created At:</strong> {new Date(selectedProject.createdAt).toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}</div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Edit Project Modal */}
                {editProjectModal && selectedProject && (
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
                    <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-xs sm:max-w-lg p-4 sm:p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white">Edit Project</h3>
                        <button onClick={() => setEditProjectModal(false)} className="text-gray-400 hover:text-white">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                          const updated = await api.put(`/api/projects/${selectedProject._id}`, selectedProject);
                          setProjects((prev) => prev.map(p => p._id === selectedProject._id ? updated.data.data : p));
                          setEditProjectModal(false);
                          toast.success('Project updated successfully');
                        } catch (err) {
                          toast.error('Failed to update project');
                        }
                      }} className="space-y-3">
                        <input type="text" value={selectedProject.title} onChange={e => setSelectedProject({ ...selectedProject, title: e.target.value })} className="w-full px-3 py-2 bg-gray-700/50 text-white rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
                        <textarea value={selectedProject.description} onChange={e => setSelectedProject({ ...selectedProject, description: e.target.value })} className="w-full px-4 py-2 bg-gray-700 text-white rounded" required />
                        <input type="text" value={selectedProject.category} onChange={e => setSelectedProject({ ...selectedProject, category: e.target.value })} className="w-full px-3 py-2 bg-gray-700 text-white rounded" required />
                        <input type="text" value={Array.isArray(selectedProject.technologies) ? selectedProject.technologies.join(', ') : selectedProject.technologies} onChange={e => setSelectedProject({ ...selectedProject, technologies: e.target.value.split(',').map(t => t.trim()) })} className="w-full px-3 py-2 bg-gray-700 text-white rounded" required />
                        <input type="url" value={selectedProject.liveUrl || ''} onChange={e => setSelectedProject({ ...selectedProject, liveUrl: e.target.value })} className="w-full px-3 py-2 bg-gray-700 text-white rounded" placeholder="Live URL" />
                        <input type="url" value={selectedProject.githubUrl || ''} onChange={e => setSelectedProject({ ...selectedProject, githubUrl: e.target.value })} className="w-full px-3 py-2 bg-gray-700 text-white rounded" placeholder="GitHub URL" />
                        <input type="text" value={selectedProject.imageUrl || ''} onChange={e => setSelectedProject({ ...selectedProject, imageUrl: e.target.value })} className="w-full px-3 py-2 bg-gray-700 text-white rounded" placeholder="Image URL" />
                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => setEditProjectModal(false)} className="px-4 py-2 bg-gray-700 text-white rounded">Cancel</button>
                          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                        </div>
                      </form>
                </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'feedbacks' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">Feedbacks Management</h2>
                  <button onClick={fetchFeedbacks} disabled={feedbacksLoading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">{feedbacksLoading ? 'Refreshing...' : 'Refresh'}</button>
                                   {selectedItems.length > 0 && (
                    <button onClick={handleBulkDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                      Delete Selected ({selectedItems.length})
                    </button>
                  )}
                </div>
                <Table columns={feedbackCols} data={feedbacks} actions={(row) => (
                  <>
                    <button 
                      onClick={() => handleApproveFeedback(row._id)} 
                      className={`${row.isApproved ? 'text-yellow-400' : 'text-green-400'} hover:underline`}
                    >
                      {row.isApproved ? 'Disapprove' : 'Approve'}
                    </button>
                    <button onClick={() => handleDelete('feedback', row._id)} className="text-red-400 hover:underline ml-2">Delete</button>
                  </>
                )} onRowClick={row => { setSelectedRow(row); setGenericModal(true); }} />
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">Bookings Management</h2>
                  <button onClick={fetchBookings} disabled={bookingsLoading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">{bookingsLoading ? 'Refreshing...' : 'Refresh'}</button>
                  {selectedItems.length > 0 && (
                    <button onClick={handleBulkDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mb-4">
                      Delete Selected ({selectedItems.length})
                    </button>
                  )}
                </div>
                               <Table columns={bookingCols} data={bookings} actions={(row) => (
                  <>
                    <span className={`px-2 py-1 rounded text-xs font-medium mr-2 ${row.attended ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {row.attended ? 'Attended' : 'Not Attended'}
                    </span>
                    <button
                      onClick={() => handleMarkAttended(row._id, row.attended)}
                      className={`mr-2 ${row.attended ? 'text-yellow-400 hover:underline' : 'text-green-400 hover:underline'}`}
                    >
                      {row.attended ? 'Mark Not Attended' : 'Mark Attended'}
                    </button>
                    <button onClick={() => handleDelete('bookings', row._id)} className="text-red-400 hover:underline">Delete</button>
                  </>
                )} onRowClick={row => { setSelectedRow(row); setGenericModal(true); }} />
              </div>
            )}

            {activeTab === 'messages' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">Messages Management</h2>
                  <button onClick={fetchMessages} disabled={messagesLoading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                    {messagesLoading ? 'Refreshing...' : 'Refresh'}
                  </button>
                </div>
                <Table columns={messageCols} data={messages} actions={(row) => (
                  <>
                    {row.status === 'unread' && (
                      <button
                        onClick={() => handleMarkAsRead(row._id)}
                        className="text-blue-400 hover:underline mr-2"
                      >
                        Mark Read
                      </button>
                    )}
                    {row.status === 'read' && (
                      <button
                        onClick={() => handleMessageResponded(row._id)}
                        className="text-green-400 hover:underline mr-2"
                      >
                        Mark Responded
                      </button>
                    )}
                    <span className={`px-2 py-1 rounded text-xs font-medium mr-2 ${
                      row.status === 'unread' 
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : row.status === 'read'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                    </span>
                    <button 
                      onClick={() => handleDelete('messages', row._id)} 
                      className="text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </>
                )} onRowClick={row => { setSelectedRow(row); setGenericModal(true); }} />
              </div>
            )}

              {activeTab === 'clients' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-white">Clients Management</h2>
                        <div className="flex gap-2">
                          <button onClick={fetchClients} disabled={clientsLoading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">{clientsLoading ? 'Refreshing...' : 'Refresh'}</button>
                          <button onClick={() => { setShowClientModal(true); setClientForm({ name: '', email: '', phone: '', company: '', password: '' }); }} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Client</button>
                        </div>
                  </div>
                  <Table
                    columns={clientCols}
                    data={clients}
                    actions={(row) => (
                      <>
                            <button onClick={() => { setSelectedRow(row); setGenericModal(true); }} className="text-blue-400 hover:underline mr-2">View</button>
                            <button onClick={() => { setSelectedClient(row); setEditClientModal(true); }} className="text-yellow-400 hover:underline mr-2">Edit</button>
                            <button onClick={() => handleDelete('clients', row._id)} className="text-red-400 hover:underline">Delete</button>
                      </>
                    )}
                    onRowClick={row => { setSelectedRow(row); setGenericModal(true); }}
                  />
                      {/* Add Client Modal */}
                      {showClientModal && (
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
                          <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-xs sm:max-w-lg p-4 sm:p-6">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-lg font-bold text-white">Add Client</h3>
                              <button onClick={() => setShowClientModal(false)} className="text-gray-400 hover:text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                            <form onSubmit={async (e) => {
                              e.preventDefault();
                              try {
                                const res = await api.post('/api/clients/signup', clientForm);
                                if (res.data.success) {
                                  setClients([res.data.data, ...clients]);
                                  setShowClientModal(false);
                                  toast.success('Client added');
                                }
                              } catch (err) {
                                toast.error(err.response?.data?.message || 'Failed to add client');
                              }
                            }} className="space-y-3">
                              <input type="text" value={clientForm.name} onChange={e => setClientForm({ ...clientForm, name: e.target.value })} placeholder="Full name" className="w-full px-3 py-2 bg-gray-700 text-white rounded" required />
                              <input type="email" value={clientForm.email} onChange={e => setClientForm({ ...clientForm, email: e.target.value })} placeholder="Email" className="w-full px-3 py-2 bg-gray-700 text-white rounded" required />
                              <input type="text" value={clientForm.phone} onChange={e => setClientForm({ ...clientForm, phone: e.target.value })} placeholder="Phone" className="w-full px-3 py-2 bg-gray-700 text-white rounded" />
                              <input type="text" value={clientForm.company} onChange={e => setClientForm({ ...clientForm, company: e.target.value })} placeholder="Company" className="w-full px-3 py-2 bg-gray-700 text-white rounded" />
                              <input type="password" value={clientForm.password} onChange={e => setClientForm({ ...clientForm, password: e.target.value })} placeholder="Password" className="w-full px-3 py-2 bg-gray-700 text-white rounded" required />
                              <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowClientModal(false)} className="px-4 py-2 bg-gray-700 text-white rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
                              </div>
                            </form>
                          </div>
                        </div>
                      )}
                      {/* Edit Client Modal */}
                      {editClientModal && selectedClient && (
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
                          <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-xs sm:max-w-lg p-4 sm:p-6">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-lg font-bold text-white">Edit Client</h3>
                              <button onClick={() => { setEditClientModal(false); setSelectedClient(null); }} className="text-gray-400 hover:text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                            <form onSubmit={async (e) => {
                              e.preventDefault();
                              try {
                                const payload = {
                                  name: selectedClient.name,
                                  email: selectedClient.email,
                                  phone: selectedClient.phone,
                                  company: selectedClient.company,
                                  password: selectedClient.password || undefined
                                };
                                const res = await api.put(`/api/clients/${selectedClient._id}`, payload);
                                if (res.data.success) {
                                  setClients(clients.map(c => c._id === selectedClient._id ? res.data.data : c));
                                  setEditClientModal(false);
                                  setSelectedClient(null);
                                  toast.success('Client updated');
                                }
                              } catch (err) {
                                toast.error(err.response?.data?.message || 'Failed to update client');
                              }
                            }} className="space-y-3">
                              <input type="text" value={selectedClient.name || ''} onChange={e => setSelectedClient({ ...selectedClient, name: e.target.value })} placeholder="Full name" className="w-full px-3 py-2 bg-gray-700 text-white rounded" required />
                              <input type="email" value={selectedClient.email || ''} onChange={e => setSelectedClient({ ...selectedClient, email: e.target.value })} placeholder="Email" className="w-full px-3 py-2 bg-gray-700 text-white rounded" required />
                              <input type="text" value={selectedClient.phone || ''} onChange={e => setSelectedClient({ ...selectedClient, phone: e.target.value })} placeholder="Phone" className="w-full px-3 py-2 bg-gray-700 text-white rounded" />
                              <input type="text" value={selectedClient.company || ''} onChange={e => setSelectedClient({ ...selectedClient, company: e.target.value })} placeholder="Company" className="w-full px-3 py-2 bg-gray-700 text-white rounded" />
                              <input type="password" value={selectedClient.password || ''} onChange={e => setSelectedClient({ ...selectedClient, password: e.target.value })} placeholder="New password (leave blank to keep)" className="w-full px-3 py-2 bg-gray-700 text-white rounded" />
                              <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => { setEditClientModal(false); setSelectedClient(null); }} className="px-4 py-2 bg-gray-700 text-white rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                              </div>
                            </form>
                          </div>
                        </div>
                      )}
                </div>
              )}

            {activeTab === 'emailLogs' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">Email Logs</h2>
                  <button 
                    onClick={fetchEmailLogs} 
                    disabled={emailLogsLoading} 
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {emailLogsLoading && (
                      <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    )}
                    {emailLogsLoading ? 'Refreshing...' : 'Refresh'}
                  </button>
                </div>
                
                {emailLogsLoading ? (
                  <div className="text-center text-gray-400 py-8">Loading email logs...</div>
                ) : emailLogs.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">No email logs found</div>
                ) : (
                  <Table 
                    columns={emailLogCols} 
                    data={emailLogs} 
                    actions={(row) => (
                      <button 
                        onClick={() => handleDeleteEmailLog(row._id)} 
                        className="text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    )} 
                    onRowClick={row => { 
                      setSelectedRow(row); 
                      setGenericModal(true); 
                    }} 
                  />
                )}
              </div>
            )}

            {activeTab === 'serverLogs' && (
              <div className="bg-gray-800 rounded-lg p-6 mb-8 min-h-[40vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">Server Logs (last 200 lines)</h2>
                  <button onClick={fetchServerLogs} disabled={logsLoading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">{logsLoading ? 'Refreshing...' : 'Refresh'}</button>
                </div>
                <pre className="bg-gray-900 text-green-400 rounded p-4 overflow-x-auto max-h-[60vh] text-xs whitespace-pre-wrap">
      {serverLogs.length ? serverLogs.join('\n') : 'No logs found.'}
    </pre>
              </div>
            )}

            {activeTab === 'careers' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">Career Applications</h2>
                  <div className="flex gap-2">
                    <button onClick={fetchCareers} disabled={careersLoading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                      {careersLoading ? 'Refreshing...' : 'Refresh'}
                    </button>
                    <button onClick={() => setShowCareerModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      Add Application
                    </button>
                  </div>
                </div>
                <Table 
                  columns={careerCols} 
                  data={careers} 
                  actions={(row) => (
                    <>
                      <button 
                        onClick={() => { 
                          setSelectedCareer(row);
                          setEditCareerModal(true);
                        }} 
                        className="text-yellow-400 hover:underline mr-2"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteCareer(row._id)} 
                        className="text-red-400 hover:underline mr-2"
                      >
                        Delete
                      </button>
                      <button 
                        onClick={() => { setSelectedRow(row); setGenericModal(true); }} 
                        className="text-blue-400 hover:underline"
                      >
                        View
                      </button>
                    </>
                  )} 
                  onRowClick={row => { setSelectedRow(row); setGenericModal(true); }} 
                />

                {/* Add Career Modal */}
                {showCareerModal && (
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
                    <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-xs sm:max-w-lg p-4 sm:p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white">Add Career Application</h3>
                        <button onClick={() => setShowCareerModal(false)} className="text-gray-400 hover:text-white">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                          const res = await api.post('/api/careers', careerForm);
                          setCareers([res.data.data, ...careers]);
                          setShowCareerModal(false);
                          setCareerForm({ name: '', email: '', phone: '', message: '' });
                          toast.success('Career application added');
                        } catch (err) {
                          toast.error(err.response?.data?.message || 'Failed to add application');
                        }
                      }} className="space-y-3">
                        <input type="text" value={careerForm.name} onChange={e => setCareerForm({ ...careerForm, name: e.target.value })} className="w-full px-3 py-2 bg-gray-700 text-white rounded" placeholder="Name" required />
                        <input type="email" value={careerForm.email} onChange={e => setCareerForm({ ...careerForm, email: e.target.value })} className="w-full px-3 py-2 bg-gray-700 text-white rounded" placeholder="Email" required />
                        <input type="tel" value={careerForm.phone} onChange={e => setCareerForm({ ...careerForm, phone: e.target.value })} className="w-full px-3 py-2 bg-gray-700 text-white rounded" placeholder="Phone" />
                        <textarea value={careerForm.message} onChange={e => setCareerForm({ ...careerForm, message: e.target.value })} className="w-full px-3 py-2 bg-gray-700 text-white rounded" placeholder="Message" required />
                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => setShowCareerModal(false)} className="px-4 py-2 bg-gray-700 text-white rounded">Cancel</button>
                          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Edit Career Modal */}
                {editCareerModal && selectedCareer && (
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
                    <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-xs sm:max-w-lg p-4 sm:p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white">Edit Career Application</h3>
                        <button onClick={() => setEditCareerModal(false)} className="text-gray-400 hover:text-white">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <form onSubmit={handleCareerEdit} className="space-y-3">
                        <input type="text" value={selectedCareer.name} onChange={e => setSelectedCareer({ ...selectedCareer, name: e.target.value })} className="w-full px-3 py-2 bg-gray-700 text-white rounded" required />
                        <input type="email" value={selectedCareer.email} onChange={e => setSelectedCareer({ ...selectedCareer, email: e.target.value })} className="w-full px-3 py-2 bg-gray-700 text-white rounded" required />
                        <input type="tel" value={selectedCareer.phone} onChange={e => setSelectedCareer({ ...selectedCareer, phone: e.target.value })} className="w-full px-3 py-2 bg-gray-700 text-white rounded" />
                        <textarea value={selectedCareer.message} onChange={e => setSelectedCareer({ ...selectedCareer, message: e.target.value })} className="w-full px-3 py-2 bg-gray-700 text-white rounded" required />
                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => setEditCareerModal(false)} className="px-4 py-2 bg-gray-700 text-white rounded">Cancel</button>
                          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'developers' && (
              <div className="bg-gray-800 rounded-lg p-4 sm:p-6 mb-8 min-h-[40vh] flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Developers Management</h2>
                  <div className="flex gap-2">
                    <button onClick={fetchDevelopers} disabled={devLoading} className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">{devLoading ? 'Refreshing...' : 'Refresh'}</button>
                    <button onClick={() => setShowDevModal(true)} className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-blue-700">Add Developer</button>
                  </div>
                </div>
                {devLoading ? (
                  <div className="text-center text-gray-400">Loading...</div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-700 text-xs sm:text-sm md:text-base">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300">Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300">Email</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300">Phone</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300">Payment Details</th>
                        <th className="px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-900 divide-y divide-gray-800">
                      {developers.length === 0 && (
                        <tr><td colSpan={5} className="text-center text-gray-500 py-6">No developers found.</td></tr>
                      )}
                      {developers.map(dev => (
                        <tr key={dev._id}>
                          <td className="px-4 py-2 text-gray-200">{dev.name}</td>
                          <td className="px-4 py-2 text-gray-200">{dev.email}</td>
                          <td className="px-4 py-2 text-gray-200">{dev.phone}</td>
                          <td className="px-4 py-2 text-gray-200">{dev.paymentDetails}</td>
                          <td className="px-4 py-2 space-x-2">
                            <button onClick={() => { setSelectedDev(dev); setEditDevModal(true); }} className="text-yellow-400 hover:underline">Edit</button>
                            <button onClick={() => handleDevDelete(dev._id)} className="text-red-400 hover:underline">Delete</button>
                            <button 
                              onClick={() => { 
                                setSelectedDeveloper(dev); 
                                setShowChatModal(true);
                                fetchChatMessages(dev.email);
                              }} 
                              className="text-blue-400 hover:underline relative"
                            >
                              Chat
                              {unreadCounts[dev.email] > 0 && (
                                <span className="absolute right-0 -top-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                  {unreadCounts[dev.email]}
                                </span>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {/* Add Developer Modal */}
                {showDevModal && (
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
                    <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-xs sm:max-w-lg p-4 sm:p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white">Add Developer</h3>
                        <button onClick={() => setShowDevModal(false)} className="text-gray-400 hover:text-white">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <form onSubmit={handleDevSubmit} className="space-y-3">
                        <input type="text" value={devForm.name} onChange={e => setDevForm({ ...devForm, name: e.target.value })} className="w-full px-3 py-2 bg-gray-700 text-white rounded" placeholder="Name" required />
                        <input type="email" value={devForm.email} onChange={e => setDevForm({ ...devForm, email: e.target.value })} className="w-full px-3 py-2 bg-gray-700 text-white rounded" placeholder="Email" required />
                        <input type="text" value={devForm.phone} onChange={e => setDevForm({ ...devForm, phone: e.target.value })} className="w-full px-3 py-2 bg-gray-700 text-white rounded" placeholder="Phone" />
                        <input type="text" value={devForm.paymentDetails} onChange={e => setDevForm({ ...devForm, paymentDetails: e.target.value })} className="w-full px-3 py-2 bg-gray-700 text-white rounded" placeholder="Payment Details" />
                        <input type="password" value={devForm.password} onChange={e => setDevForm({ ...devForm, password: e.target.value })} className="w-full px-3 py-2 bg-gray-700 text-white rounded" placeholder="Password" required />
                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => setShowDevModal(false)} className="px-4 py-2 bg-gray-700 text-white rounded">Cancel</button>
                          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
                {/* Edit Developer Modal */}
                {editDevModal && selectedDev && (
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
                    <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-xs sm:max-w-lg p-4 sm:p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white">Edit Developer</h3>
                        <button onClick={() => setEditDevModal(false)} className="text-gray-400 hover:text-white">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <form onSubmit={handleDevEdit} className="space-y-3">
                        <input type="text" value={selectedDev.name} onChange={e => setSelectedDev({ ...selectedDev, name: e.target.value })} className="w-full px-3 py-2 bg-gray-700 text-white rounded" required />
                        <input type="email" value={selectedDev.email} onChange={e => setSelectedDev({ ...selectedDev, email: e.target.value })} className="w-full px-3 py-2 bg-gray-700 text-white rounded" required />
                        <input type="text" value={selectedDev.phone} onChange={e => setSelectedDev({ ...selectedDev, phone: e.target.value })} className="w-full px-3 py-2 bg-gray-700 text-white rounded" />
                        <input type="text" value={selectedDev.paymentDetails} onChange={e => setSelectedDev({ ...selectedDev, paymentDetails: e.target.value })} className="w-full px-3 py-2 bg-gray-700 text-white rounded" />
                        <input type="password" value={selectedDev.password || ''} onChange={e => setSelectedDev({ ...selectedDev, password: e.target.value })} className="w-full px-3 py-2 bg-gray-700 text-white rounded" placeholder="New Password (optional)" />
                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => setEditDevModal(false)} className="px-4 py-2 bg-gray-700 text-white rounded">Cancel</button>
                          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
                {/* View Developer Modal (reuse genericModal) */}
                {genericModal && selectedDev && (
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
                    <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-xs sm:max-w-xl p-4 sm:p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white">Developer Details</h3>
                        <button onClick={() => setGenericModal(false)} className="text-gray-400 hover:text-white">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="space-y-2 text-gray-200 max-h-[60vh] overflow-y-auto">
                        {Object.entries(selectedDev).map(([key, value]) => (
                          <div key={key}>
                            <strong>{key}:</strong> {key === 'cvUrl' && value ? (
                              <a
                                href={value.startsWith('/uploads') ? `${API_URL}${value}` : value}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 underline ml-2"
                              >
                                View CV
                              </a>
                            ) : Array.isArray(value) ? value.join(', ') :
                              (typeof value === 'object' && value !== null && value.url) ? <a href={value.url} className="text-blue-400 underline">{value.url}</a> :
                              (typeof value === 'string' && value.startsWith('http') && (value.endsWith('.jpg') || value.endsWith('.png') || value.endsWith('.jpeg') || value.endsWith('.webp'))) ? <img src={value} alt={key} className="w-32 h-20 object-cover rounded mt-2" /> :
                              (key === 'createdAt' || key === 'sentAt') ? new Date(value).toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' }) :
                              String(value)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'activities' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">Activities Management</h2>
                  <div className="flex items-center gap-2">
                    <button onClick={fetchActivities} disabled={activitiesLoading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">{activitiesLoading ? 'Refreshing...' : 'Refresh'}</button>
                    <button onClick={() => setShowActivityModal(true)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add Activity</button>
                    {selectedItems.length > 0 && (
                      <button onClick={handleBulkDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mb-4">
                        Delete Selected ({selectedItems.length})
                      </button>
                    )}
                  </div>
                </div>
                <Table columns={activityCols} data={activities} actions={(row) => (
                  <>
                    <button onClick={() => { setSelectedActivity(row); setEditActivityModal(true); }} className="text-yellow-400 hover:underline mr-2">Edit</button>
                    <button onClick={() => handleActivityDelete(row._id)} className="text-red-400 hover:underline">Delete</button>
                    <button onClick={() => { setSelectedRow(row); setGenericModal(true); }} className="text-blue-400 hover:underline ml-2">View</button>
                  </>
                )} onRowClick={row => { setSelectedActivity(row); setEditActivityModal(true); }} cellRenderers={{
                  developersWorking: (value, row) => (
                    <button onClick={(e) => { e.stopPropagation(); openDevelopersModal(row); }} className="px-2 py-1 bg-indigo-600 text-white rounded text-sm">
                      {typeof value === 'number' ? value : 0}
                    </button>
                  ),
                  deadline: (value) => {
                    if (!value) return <span className="text-gray-400">No deadline</span>;
                    try {
                      const now = new Date();
                      const end = new Date(value);
                      const diffDays = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
                      if (diffDays < 0) return <span className="text-red-400">Overdue by {Math.abs(diffDays)} d</span>;
                      return <span className="text-green-300">{diffDays} d left</span>;
                    } catch {
                      return String(value);
                    }
                  }
                }} />
                {/* Edit Activity Modal */}
                {editActivityModal && selectedActivity && (
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
                    <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-xs sm:max-w-lg p-4 sm:p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white">Edit Activity</h3>
                        <button onClick={() => setEditActivityModal(false)} className="text-gray-400 hover:text-white">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        </button>
                      </div>
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                          const updated = await api.put(`/api/activities/${selectedActivity._id}`, selectedActivity);
                          setActivities((prev) => prev.map(a => a._id === selectedActivity._id ? updated.data.data : a));
                          setEditActivityModal(false);
                          toast.success('Activity updated successfully');
                        } catch (err) {
                          toast.error('Failed to update activity');
                        }
                      }} className="space-y-3">
                        <input type="text" value={selectedActivity.title} onChange={e => setSelectedActivity({ ...selectedActivity, title: e.target.value })} className="w-full px-3 py-2 bg-gray-700 text-white rounded" required />
                        <textarea value={selectedActivity.description} onChange={e => setSelectedActivity({ ...selectedActivity, description: e.target.value })} className="w-full px-4 py-2 bg-gray-700 text-white rounded" required />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-gray-300 mb-2">Type</label>
                            <select
                              value={selectedActivity.type}
                              onChange={e => setSelectedActivity({ ...selectedActivity, type: e.target.value })}
                              className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                            >
                              <option value="">Select type</option>
                              {typeOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-gray-300 mb-2">Status</label>
                            <select
                              value={selectedActivity.status}
                              onChange={e => setSelectedActivity({ ...selectedActivity, status: e.target.value })}
                              className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                            >
                              <option value="">Select status</option>
                              {statusOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-gray-300 mb-2">Priority</label>
                            <select
                              value={selectedActivity.priority}
                              onChange={e => setSelectedActivity({ ...selectedActivity, priority: e.target.value })}
                              className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                            >
                              <option value="">Select priority</option>
                              {priorityOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-gray-300 mb-2">Deadline</label>
                            <input
                              type="date"
                              value={selectedActivity.deadline ? selectedActivity.deadline.split('T')[0] : ''}
                              onChange={e => setSelectedActivity({ ...selectedActivity, deadline: e.target.value })}
                              className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => setEditActivityModal(false)} className="px-4 py-2 bg-gray-700 text-white rounded">Cancel</button>
                          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
                {/* Add Activity Modal */}
                {showActivityModal && (
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
                    <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-xs sm:max-w-lg p-4 sm:p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white">Add Activity</h3>
                        <button onClick={() => setShowActivityModal(false)} className="text-gray-400 hover:text-white">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                          const payload = {
                            title: activityForm.title,
                            description: activityForm.description,
                            type: activityForm.type,
                            status: activityForm.status,
                            priority: activityForm.priority,
                            deadline: activityForm.deadline || undefined
                          };
                          const res = await api.post('/api/activities', payload);
                          setActivities(prev => [res.data.data, ...(prev || [])]);
                          setShowActivityModal(false);
                          setActivityForm({ title: '', description: '', type: '', status: '', priority: '', deadline: '' });
                          toast.success('Activity created');
                        } catch (err) {
                          toast.error(err?.response?.data?.message || 'Failed to create activity');
                        }
                      }} className="space-y-3">
                        <input type="text" value={activityForm.title} onChange={e => setActivityForm({ ...activityForm, title: e.target.value })} className="w-full px-3 py-2 bg-gray-700 text-white rounded" placeholder="Title" required />
                        <textarea value={activityForm.description} onChange={e => setActivityForm({ ...activityForm, description: e.target.value })} className="w-full px-4 py-2 bg-gray-700 text-white rounded" placeholder="Description" required />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-gray-300 mb-2">Type</label>
                            <select value={activityForm.type} onChange={e => setActivityForm({ ...activityForm, type: e.target.value })} className="w-full px-4 py-2 bg-gray-700 text-white rounded">
                              <option value="">Select type</option>
                              {typeOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-gray-300 mb-2">Status</label>
                            <select value={activityForm.status} onChange={e => setActivityForm({ ...activityForm, status: e.target.value })} className="w-full px-4 py-2 bg-gray-700 text-white rounded">
                              <option value="">Select status</option>
                              {statusOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-gray-300 mb-2">Priority</label>
                            <select value={activityForm.priority} onChange={e => setActivityForm({ ...activityForm, priority: e.target.value })} className="w-full px-4 py-2 bg-gray-700 text-white rounded">
                              <option value="">Select priority</option>
                              {priorityOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-gray-300 mb-2">Deadline</label>
                            <input type="date" value={activityForm.deadline || ''} onChange={e => setActivityForm({ ...activityForm, deadline: e.target.value })} className="w-full px-4 py-2 bg-gray-700 text-white rounded" />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => setShowActivityModal(false)} className="px-4 py-2 bg-gray-700 text-white rounded">Cancel</button>
                          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                
              </div>
            )}

            {activeTab === 'teams' && (
              <div className="bg-gray-800 rounded-lg p-4 sm:p-6 mb-8 min-h-[40vh] flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Teams Management</h2>
                  <div className="flex gap-2">
                    <button onClick={fetchTeams} disabled={teamsLoading} className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">{teamsLoading ? 'Refreshing...' : 'Refresh'}</button>
                    <button onClick={() => setShowTeamModal(true)} className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-blue-700">Add Team</button>
                    {selectedItems.length > 0 && (
                      <button onClick={handleBulkDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mb-4">
                        Delete Selected ({selectedItems.length})
                      </button>
                    )}
                  </div>
                </div>
                <Table columns={teamCols} data={teams} actions={(row) => (
                  <>
                    <button onClick={() => { setSelectedTeam(row); setEditTeamModal(true); }} className="text-yellow-400 hover:underline mr-2">Edit</button>
                    <button onClick={() => handleTeamDelete(row._id)} className="text-red-400 hover:underline">Delete</button>
                    <button onClick={() => { setSelectedRow(row); setGenericModal(true); }} className="text-blue-400 hover:underline ml-2">View</button>
                  </>
                )} onRowClick={row => { setSelectedTeam(row); setEditTeamModal(true); }} />
                {/* Add Team Modal */}
                {showTeamModal && (
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
                    <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-xs sm:max-w-lg p-4 sm:p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white">Add Team</h3>
                        <button onClick={() => setShowTeamModal(false)} className="text-gray-400 hover:text-white">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        </button>
                      </div>
                      <form onSubmit={handleTeamSubmit} className="space-y-3">
                        <input type="text" value={teamForm.name} onChange={e => setTeamForm({ ...teamForm, name: e.target.value })} className="w-full px-3 py-2 bg-gray-700 text-white rounded" placeholder="Name" required />
                        <input type="text" value={teamForm.rank} onChange={e => setTeamForm({ ...teamForm, rank: e.target.value })} className="w-full px-3 py-2 bg-gray-700 text-white rounded" placeholder="Rank (e.g., Core, Lead)" />
                        <input type="text" value={teamForm.techStacks} onChange={e => setTeamForm({ ...teamForm, techStacks: e.target.value })} className="w-full px-3 py-2 bg-gray-700 text-white rounded" placeholder="Tech Stacks (comma-separated)" />
                        <input type="url" value={teamForm.whatsappGroup} onChange={e => setTeamForm({ ...teamForm, whatsappGroup: e.target.value })} className="w-full px-3 py-2 bg-gray-700 text-white rounded" placeholder="WhatsApp Group Link (optional)" />
                        <textarea value={teamForm.bio} onChange={e => setTeamForm({ ...teamForm, bio: e.target.value })} className="w-full px-3 py-2 bg-gray-700 text-white rounded" placeholder="Short Bio" />
                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => setShowTeamModal(false)} className="px-4 py-2 bg-gray-700 text-white rounded">Cancel</button>
                          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Edit Team Modal with Messaging */}
                {editTeamModal && selectedTeam && (
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
                    <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-xs sm:max-w-2xl p-4 sm:p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white">Edit Team</h3>
                        <button onClick={() => setEditTeamModal(false)} className="text-gray-400 hover:text-white">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        </button>
                      </div>
                      <form onSubmit={handleTeamEdit} className="space-y-3">
                        <input type="text" value={selectedTeam.name} onChange={e => setSelectedTeam({ ...selectedTeam, name: e.target.value })} className="w-full px-3 py-2 bg-gray-700 text-white rounded" required />
                        <input type="text" value={selectedTeam.rank || ''} onChange={e => setSelectedTeam({ ...selectedTeam, rank: e.target.value })} className="w-full px-3 py-2 bg-gray-700 text-white rounded" />
                        <input type="text" value={Array.isArray(selectedTeam.techStacks) ? selectedTeam.techStacks.join(', ') : (selectedTeam.techStacks || '')} onChange={e => setSelectedTeam({ ...selectedTeam, techStacks: e.target.value })} className="w-full px-3 py-2 bg-gray-700 text-white rounded" />
                        <input type="url" value={selectedTeam.whatsappGroup || ''} onChange={e => setSelectedTeam({ ...selectedTeam, whatsappGroup: e.target.value })} className="w-full px-3 py-2 bg-gray-700 text-white rounded" placeholder="WhatsApp Group Link" />
                        <textarea value={selectedTeam.bio || ''} onChange={e => setSelectedTeam({ ...selectedTeam, bio: e.target.value })} className="w-full px-3 py-2 bg-gray-700 text-white rounded" />
                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => setEditTeamModal(false)} className="px-4 py-2 bg-gray-700 text-white rounded">Cancel</button>
                          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                        </div>
                      </form>
                      <div className="border-t border-gray-700 mt-4 pt-4">
                        <h4 className="text-white font-bold mb-2">Team Messages</h4>
                        <div className="max-h-40 sm:max-h-64 overflow-y-auto bg-gray-900 rounded p-2 sm:p-3 space-y-2">
                          {(selectedTeam.messages || []).slice().reverse().map((m, idx) => (
                            <div key={m._id || idx} className="text-gray-200">
                              <span className="text-blue-400 font-semibold flex items-center gap-1">
                                {m.author === 'Admin' ? (
                                  <>
                                    Admin
                                    <FaCheckCircle className="text-green-400 ml-1" title="Approved Admin" size={13} />
                                  </>
                                ) : m.author}
                              </span>
                              <span className="text-gray-400 text-xs ml-2">{new Date(m.createdAt).toLocaleString()}</span>
                              <div className="flex items-center gap-2">
                                <div className="flex-1">{m.text}</div>
                                <button
                                  onClick={async () => {
                                    try {
                                      await api.delete(`/api/teams/${selectedTeam._id}/messages/${m._id}?admin=true`);
                                      const res = await api.get('/api/teams');
                                      setTeams(res.data.data || []);
                                      setSelectedTeam(res.data.data.find(t=>t._id===selectedTeam._id));
                                      toast.success('Message deleted');
                                    } catch (err) {
                                      toast.error(
                                        err?.response?.data?.message ||
                                        'Failed to delete'
                                      );
                                    }
                                  }}
                                  className="text-red-400 hover:underline text-xs"
                                >
                                  Delete
                                </button>
                              </div>
                              {(m.replies || []).map((r, rIdx) => (
                                <div key={r._id || rIdx} className="ml-4 mt-1 text-sm text-gray-300">
                                  <span className="text-green-400 font-medium">{r.author}</span>
                                  <span className="text-gray-500 text-[10px] ml-2">{new Date(r.createdAt).toLocaleString()}</span>
                                  <div>{r.text}</div>
                                </div>
                              ))}
                            </div>
                          ))}
                          {(!selectedTeam.messages || selectedTeam.messages.length === 0) && (
                            <div className="text-gray-400">No messages yet.</div>
                          )}
                        </div>
                        {/* Message input: only text, author is always "Admin" */}
             <div className="mt-3 flex gap-1 sm:gap-2">
  <input 
    type="text" 
    value={selectedTeam._newText || ''} 
    placeholder="Write a message as Admin..." 
    className="flex-[2] px-2 sm:px-3 py-2 bg-gray-700 text-white rounded" 
    onChange={e => setSelectedTeam(prev => ({ ...prev, _newText: e.target.value }))} 
    onKeyDown={async e => { 
      if (e.key === 'Enter' && selectedTeam._newText && !selectedTeam._loading) {
        setSelectedTeam(prev => ({ ...prev, _loading: true }));
        await handleSendTeamMessage(selectedTeam._id, selectedTeam._newText);
        setSelectedTeam(prev => ({ ...prev, _newText: '', _loading: false }));
      }
    }} 
    disabled={selectedTeam._loading}
  />
  <button
    onClick={async () => {
      if (selectedTeam._loading || !selectedTeam._newText) return;
      setSelectedTeam(prev => ({ ...prev, _loading: true }));
      await handleSendTeamMessage(selectedTeam._id, selectedTeam._newText);
      setSelectedTeam(prev => ({ ...prev, _newText: '', _loading: false }));
    }}
    disabled={!selectedTeam._newText || selectedTeam._loading}
    className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
  >
    {selectedTeam._loading ? (
      <>
        <svg
          className="animate-spin h-5 w-5 text-white"
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
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <span>Sending...</span>
      </>
    ) : (
      "Send as Admin"
    )}
  </button>
</div>

                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {showProjectModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-xl w-full max-w-xs sm:max-w-lg transform transition-all">
              <div className="border-b border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">Create New Project</h3>
                  <button onClick={() => setShowProjectModal(false)} className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <form onSubmit={handleProjectSubmit} className="p-4 space-y-3">
                <div>
                  <input
                    type="text"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    required
                    placeholder="Project Title"
                    className="w-full px-3 py-2 bg-gray-700/50 text-white rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Description</label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    required
                    rows="3"
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-300 mb-2">Category</label>
                    <input
                      type="text"
                      value={projectForm.category}
                      onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                      required
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Technologies (comma-separated)</label>
                    <input
                      type="text"
                      value={projectForm.technologies}
                      onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                      required
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                      placeholder="React, Node.js, MongoDB"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-300 mb-2">Live URL (optional)</label>
                    <input
                      type="url"
                      value={projectForm.liveUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">GitHub URL (optional)</label>
                    <input
                      type="url"
                      value={projectForm.githubUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Project Image</label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setProjectForm({ ...projectForm, image: file });
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setImagePreview(reader.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                      id="project-image"
                    />
                    <label
                      htmlFor="project-image"
                      className="px-4 py-2 bg-gray-700 text-gray-300 rounded cursor-pointer hover:bg-gray-600"
                    >
                      Choose Image
                    </label>
                    {imagePreview && (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-16 h-16 rounded object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setProjectForm({ ...projectForm, image: null });
                            setImagePreview(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowProjectModal(false)}
                    className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center min-w-[120px]"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Creating...
                      </>
                    ) : 'Create Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Chat Modal */}
        {showChatModal && selectedDeveloper && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-lg w-full max-w-lg p-6 relative">
              <button
                onClick={() => setShowChatModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h3 className="text-xl text-blue-300 font-bold mb-4">
                Chat with <span className='text-green-400'>{selectedDeveloper.name}</span>
              </h3>

              <div 
                ref={chatRef}
                className="bg-gray-800 rounded-lg p-4 h-96 overflow-y-auto mb-4 space-y-4"
              >
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg px-4 py-2 relative ${
                      msg.sender === 'admin' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-200'
                    }`}>
                      <p className="text-sm">{msg.message}</p>
                      <div className="flex items-center justify-between text-xs opacity-75">
                        <span>{new Date(msg.createdAt).toLocaleString()}</span>
                        {msg.edited && <span className="italic">(edited)</span>}
                        {msg.sender !== 'admin' && (
                          <span className={`flex items-center gap-1 ml-2 ${
                            msg.adminRead ? 'text-green-400' : 'text-red-400'
                          }`}>
                            <FaEye />
                            {!msg.adminRead ? (
                              <button 
                                onClick={() => markAsRead(msg._id)}
                                className="hover:text-red-300"
                              >
                                Read
                              </button>
                            ) : (
                              <span>Read {msg.adminReadAt && `(${new Date(msg.adminReadAt).toLocaleString()})`}</span>
                            )}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 mt-1 items-center">
                        {msg.sender === 'admin' && (
                          <button 
                            onClick={() => handleEditMessage(msg._id, msg.message)}
                            className="text-xs text-blue-300 hover:text-blue-200"
                          >
                            Edit
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteMessage(msg._id)}
                          className="text-xs text-red-300 hover:text-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={sendChatMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-800 text-white rounded px-4 py-2"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <FaPaperPlane />
                  Send
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Generic Modal for all tables except projects */}
        {genericModal && selectedRow && renderGenericModal()}

        {/* Developers modal (shows list of developers working on current activity).
            Note: backend endpoint GET /api/activities/:id/developers is optional — if absent the modal will show a helpful message. */}
        {showDevelopersModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Developers working on: {currentActivityForDevelopers?.title || 'Activity'}</h3>
                <button onClick={closeDevelopersModal} className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="text-gray-200">
                {activityDevelopersLoading ? (
                  <div>Loading...</div>
                ) : activityDevelopers && activityDevelopers.length > 0 ? (
                  <div className="space-y-3">
                    {activityDevelopers.map(dev => (
                      <div key={dev._id || dev.email} className="p-2 bg-gray-900 rounded">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold">{dev.name || dev.email}</div>
                            <div className="text-sm text-gray-400">{dev.email}</div>
                          </div>
                          <div className="text-sm text-gray-400">{dev.phone || ''}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400">No developer is working on this activity</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
