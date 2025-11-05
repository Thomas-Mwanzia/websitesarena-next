"use client";

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Head from "next/head";import { toast } from 'react-hot-toast';
import { FaCheck, FaQuestionCircle, FaClock, FaShieldAlt, FaRocket } from 'react-icons/fa';
import { FiPackage, FiCalendar, FiTool, FiUsers, FiAward, FiGrid, FiList } from 'react-icons/fi';
import api from '../utils/axios';

const scrollbarStyles = `
  .custom-scrollbar {
    padding-bottom: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar {
    height: 10px;
    background: rgba(30, 41, 59, 0.5);
    border-radius: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(30, 41, 59, 0.8);
    margin: 0 15%;
    border-radius: 8px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #3B82F6;
    border-radius: 8px;
    border: 2px solid rgba(30, 41, 59, 0.8);
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #2563EB;
  }
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
  @keyframes blink {
    0%, 100% {
      border-color: rgb(34, 197, 94);
      box-shadow: 0 0 20px rgb(34, 197, 94, 0.7);
      transform: scale(1);
    }
    50% {
      border-color: transparent;
      box-shadow: 0 0 0 transparent;
      transform: scale(0.98);
    }
  }
`;

export const processSteps = [
  {
    icon: FiPackage,
    title: 'Choose Package',
    description: 'Select the service package that best fits your needs'
  },
  {
    icon: FiCalendar,
    title: 'Book Consultation',
    description: 'Schedule a free consultation with our expert team'
  },
  {
    icon: FiTool,
    title: 'Development',
    description: 'Our team begins working on your project'
  },
  {
    icon: FiUsers,
    title: 'Review & Feedback',
    description: 'Regular updates and revisions as needed'
  },
  {
    icon: FiAward,
    title: 'Launch',
    description: 'Your project goes live with our ongoing support'
  }
];

const faqs = [
  {
    question: 'How long does the development process take?',
    answer: 'Development timelines vary by project complexity. Most projects are completed within 2-8 weeks.'
  },
  {
    question: 'Do you provide ongoing support?',
    answer: 'Yes, we offer comprehensive support and maintenance packages after launch.'
  },
  {
    question: 'Can I request custom features?',
    answer: 'Absolutely! We can customize any package to meet your specific requirements.'
  },
  {
    question: 'What technologies do you use?',
    answer: 'We use modern frameworks like React, Next.js, Node.js, and more based on project needs.'
  },
  {
    question: 'How do you handle project communication?',
    answer: 'We maintain regular communication through dedicated project channels, providing weekly updates and milestone reports.'
  },
  {
    question: 'What is your payment structure?',
    answer: 'We typically require a 50% upfront payment, with the remaining balance due upon project completion.'
  },
  {
    question: 'Do you offer hosting services?',
    answer: 'Yes, we provide secure hosting solutions with 99.9% uptime guarantee and regular backups.'
  },
  {
    question: 'How do you ensure website security?',
    answer: 'We implement industry-standard security measures, including SSL certificates, regular security audits, and secure coding practices.'
  },
  {
    question: 'Can you help with content creation?',
    answer: "Yes, we offer content strategy and creation services to help optimize your website's messaging."
  },
  {
    question: 'What happens after the website launches?',
    answer: 'We provide post-launch support, monitoring, and optimization services to ensure your site performs optimally.'
  },
  {
    question: 'Do you provide SEO services?',
    answer: 'Yes, we implement SEO best practices and offer ongoing SEO optimization packages.'
  },
  {
    question: 'How do you handle mobile responsiveness?',
    answer: 'All our websites are built with a mobile-first approach, ensuring perfect display across all devices.'
  }
];

export const packages = [
  {
    id: 1,
    name: 'Personal Blog',
    price: '$250',
    timeline: '5-7 days',
    features: [
      'Responsive Blog Design',
      'Comment System',
      'Newsletter Integration',
      'Social Media Sharing',
      'Basic SEO Setup'
    ]
  },
  {
    id: 2,
    name: 'Portfolio Pro',
    price: '$320',
    timeline: '7-10 days',
    features: [
      'Custom Portfolio Layout',
      'Project Categorization',
      'Animation Effects',
      'Contact Integration',
      'Mobile Optimization'
    ]
  },
  {
    id: 3,
    name: 'Small Business',
    price: '$370',
    timeline: '10-14 days',
    features: [
      'Business Landing Page',
      'Service Showcase',
      'Lead Generation Forms',
      'Google Business Integration',
      'Analytics Setup'
    ]
  },
  {
    id: 4,
    name: 'E-commerce Basic',
    price: '$430',
    timeline: '14-21 days',
    features: [
      'Product Management',
      'Secure Payment Gateway',
      'Order System',
      'Customer Accounts',
      'Mobile Shopping Cart'
    ]
  },
  {
    id: 5,
    name: 'Restaurant Site',
    price: '$500',
    timeline: '10-14 days',
    features: [
      'Menu Display System',
      'Table Reservations',
      'Food Gallery',
      'Online Ordering',
      'Restaurant Location Map'
    ]
  },
  {
    id: 6,
    name: 'Real Estate Pro',
    price: '$570',
    timeline: '14-21 days',
    features: [
      'Property Listings',
      'Virtual Tours',
      'Agent Profiles',
      'Property Search',
      'Inquiry System'
    ]
  },
  {
    id: 7,
    name: 'Educational Platform',
    price: '$630',
    timeline: '21-28 days',
    features: [
      'Course Management',
      'Student Portal',
      'Progress Tracking',
      'Content Library',
      'Discussion Forums'
    ]
  },
  {
    id: 8,
    name: 'Healthcare Suite',
    price: '$700',
    timeline: '21-28 days',
    features: [
      'Appointment Booking',
      'Patient Portal',
      'Medical Records',
      'Doctor Profiles',
      'HIPAA Compliance'
    ]
  },
  {
    id: 9,
    name: 'Nonprofit Portal',
    price: '$760',
    timeline: '14-21 days',
    features: [
      'Donation System',
      'Event Management',
      'Volunteer Portal',
      'Impact Reporting',
      'Newsletter System'
    ]
  },
  {
    id: 10,
    name: 'Fitness Website',
    price: '$830',
    timeline: '14-21 days',
    features: [
      'Class Scheduling',
      'Membership Portal',
      'Trainer Profiles',
      'Workout Tracking',
      'Nutrition Plans'
    ]
  },
  {
    id: 11,
    name: 'Event Platform',
    price: '$900',
    timeline: '21-28 days',
    features: [
      'Event Registration',
      'Ticket Sales',
      'Schedule Management',
      'Speaker Profiles',
      'Virtual Event Support'
    ]
  },
  {
    id: 12,
    name: 'iOS App Basic',
    price: '$970',
    timeline: '30-45 days',
    features: [
      'Native iOS Development',
      'UI/UX Design',
      'Core Features',
      'App Store Submission',
      'Basic Analytics'
    ]
  },
  {
    id: 13,
    name: 'Android App Basic',
    price: '$1040',
    timeline: '30-45 days',
    features: [
      'Native Android Development',
      'Material Design UI',
      'Core Features',
      'Play Store Setup',
      'Performance Optimization'
    ]
  },
  {
    id: 14,
    name: 'Cross-Platform App Pro',
    price: '$1110',
    timeline: '45-60 days',
    features: [
      'iOS & Android Apps',
      'Shared Codebase',
      'Advanced Features',
      'Push Notifications',
      'Cloud Integration'
    ]
  },
  {
    id: 15,
    name: 'Enterprise Custom',
    price: 'Custom',
    timeline: 'Flexible',
    features: [
      'Custom Development',
      'Advanced Security',
      'API Integration',
      'Scalable Architecture',
      'Premium Support'
    ]
  },
  {
    id: 16,
    name: 'SaaS Platform',
    price: '$1200',
    timeline: '45-60 days',
    features: [
      'User Management',
      'Subscription Billing',
      'Admin Dashboard',
      'API Integration',
      'Multi-Tenant Support'
    ]
  },
  {
    id: 17,
    name: 'Law Firm Website',
    price: '$650',
    timeline: '10-14 days',
    features: [
      'Attorney Profiles',
      'Case Study Showcase',
      'Appointment Booking',
      'Legal Blog',
      'Contact Forms'
    ]
  },
  {
    id: 18,
    name: 'Logistics Portal',
    price: '$950',
    timeline: '21-28 days',
    features: [
      'Shipment Tracking',
      'Customer Dashboard',
      'Order Management',
      'Driver Profiles',
      'Analytics & Reports'
    ]
  },
  {
    id: 19,
    name: 'Travel Agency',
    price: '$780',
    timeline: '14-21 days',
    features: [
      'Tour Listings',
      'Booking System',
      'Photo Gallery',
      'Customer Reviews',
      'Payment Integration'
    ]
  },
  {
    id: 20,
    name: 'Digital Marketing Suite',
    price: '$890',
    timeline: '21-28 days',
    features: [
      'Landing Pages',
      'Email Campaigns',
      'Lead Capture Forms',
      'SEO Tools',
      'Analytics Dashboard'
    ]
  },
  {
    id: 21,
    name: 'Podcast Website',
    price: '$540',
    timeline: '10-14 days',
    features: [
      'Episode Management',
      'Audio Player',
      'Subscription Links',
      'Guest Profiles',
      'Blog Integration'
    ]
  },
  {
    id: 22,
    name: 'Wedding Planner Site',
    price: '$600',
    timeline: '10-14 days',
    features: [
      'Event Calendar',
      'RSVP System',
      'Gallery',
      'Vendor Directory',
      'Contact Forms'
    ]
  },
  {
    id: 23,
    name: 'Car Dealership Platform',
    price: '$950',
    timeline: '14-21 days',
    features: [
      'Inventory Management',
      'Car Listings',
      'Finance Calculator',
      'Lead Forms',
      'Dealer Profiles'
    ]
  },
  {
    id: 24,
    name: 'Marketplace Platform',
    price: '$1500',
    timeline: '30-45 days',
    features: [
      'Multi-vendor Support',
      'Product Listings',
      'Order Management',
      'Payment Integration',
      'Ratings & Reviews'
    ]
  },
  {
    id: 25,
    name: 'SaaS Analytics Dashboard',
    price: '$1100',
    timeline: '21-28 days',
    features: [
      'Custom Charts',
      'User Segmentation',
      'Real-time Data',
      'Export Reports',
      'Role-based Access'
    ]
  },
  {
    id: 26,
    name: 'News Portal',
    price: '$800',
    timeline: '14-21 days',
    features: [
      'Article Management',
      'Category System',
      'Newsletter Signup',
      'Commenting',
      'Ad Integration'
    ]
  },
  {
    id: 27,
    name: 'Job Board',
    price: '$950',
    timeline: '21-28 days',
    features: [
      'Job Listings',
      'Resume Upload',
      'Employer Accounts',
      'Application Tracking',
      'Search & Filter'
    ]
  },
  {
    id: 28,
    name: 'Photography Portfolio',
    price: '$420',
    timeline: '7-10 days',
    features: [
      'Gallery Layouts',
      'Client Proofing',
      'Booking Form',
      'Image Protection',
      'Blog Integration'
    ]
  },
  {
    id: 29,
    name: 'Salon & Spa Booking',
    price: '$580',
    timeline: '10-14 days',
    features: [
      'Service Menu',
      'Online Booking',
      'Staff Profiles',
      'Promotions',
      'Review System'
    ]
  },
  {
    id: 30,
    name: 'Charity Crowdfunding',
    price: '$990',
    timeline: '21-28 days',
    features: [
      'Campaign Pages',
      'Donation System',
      'Progress Tracking',
      'Social Sharing',
      'Volunteer Signup'
    ]
  },
  {
    id: 31,
    name: 'Podcast Hosting Platform',
    price: '$1350',
    timeline: '30-45 days',
    features: [
      'Audio Hosting',
      'RSS Feed Generation',
      'Analytics Dashboard',
      'Subscription Management',
      'Custom Player Widgets'
    ]
  },
  {
    id: 32,
    name: 'Membership Community',
    price: '$990',
    timeline: '21-28 days',
    features: [
      'Member Profiles',
      'Private Forums',
      'Event Calendar',
      'Content Locking',
      'Payment Integration'
    ]
  },
  {
    id: 33,
    name: 'Online Course Platform',
    price: '$1400',
    timeline: '30-45 days',
    features: [
      'Course Builder',
      'Video Hosting',
      'Quizzes & Certificates',
      'Student Dashboard',
      'Progress Tracking'
    ]
  },
  {
    id: 34,
    name: 'Virtual Event Platform',
    price: '$1600',
    timeline: '30-45 days',
    features: [
      'Live Streaming',
      'Attendee Chat',
      'Ticketing System',
      'Speaker Profiles',
      'Sponsor Showcases'
    ]
  },
  {
    id: 35,
    name: 'Food Delivery App',
    price: '$1800',
    timeline: '45-60 days',
    features: [
      'Restaurant Listings',
      'Order Tracking',
      'Payment Gateway',
      'Driver App',
      'Push Notifications'
    ]
  },
  {
    id: 36,
    name: 'Pet Care Website',
    price: '$480',
    timeline: '7-10 days',
    features: [
      'Service Listings',
      'Appointment Booking',
      'Pet Gallery',
      'Testimonials',
      'Contact Forms'
    ]
  },
  {
    id: 37,
    name: 'Construction Company Site',
    price: '$650',
    timeline: '10-14 days',
    features: [
      'Project Gallery',
      'Service Pages',
      'Team Profiles',
      'Quote Request Form',
      'Blog Integration'
    ]
  },
  {
    id: 38,
    name: 'Fashion E-commerce',
    price: '$1200',
    timeline: '21-28 days',
    features: [
      'Product Catalog',
      'Lookbook',
      'Wishlist',
      'Secure Checkout',
      'Order Management'
    ]
  },
  {
    id: 39,
    name: 'Musician/Band Website',
    price: '$520',
    timeline: '7-10 days',
    features: [
      'Music Player',
      'Tour Dates',
      'Photo Gallery',
      'Merch Store',
      'Newsletter Signup'
    ]
  },
  {
    id: 40,
    name: 'Language Learning Platform',
    price: '$1500',
    timeline: '30-45 days',
    features: [
      'Lesson Modules',
      'Interactive Quizzes',
      'Progress Tracking',
      'Audio/Video Content',
      'Community Forum'
    ]
  },
  {
    id: 41,
    name: 'Influencer Portfolio',
    price: '$390',
    timeline: '7-10 days',
    features: [
      'Instagram Feed Integration',
      'Media Kit Download',
      'Contact Form',
      'Blog Section',
      'Brand Collaborations Showcase'
    ]
  },
  {
    id: 42,
    name: 'Podcast Network Platform',
    price: '$1700',
    timeline: '45-60 days',
    features: [
      'Multiple Show Management',
      'Host Profiles',
      'Centralized Analytics',
      'Sponsorship Tools',
      'Listener Community'
    ]
  },
  {
    id: 43,
    name: 'Online Magazine',
    price: '$850',
    timeline: '14-21 days',
    features: [
      'Article Publishing',
      'Category Navigation',
      'Newsletter Signup',
      'Ad Management',
      'Author Profiles'
    ]
  },
  {
    id: 44,
    name: 'Subscription Box E-commerce',
    price: '$1300',
    timeline: '21-28 days',
    features: [
      'Recurring Payments',
      'Box Customization',
      'Order Management',
      'Customer Portal',
      'Referral Program'
    ]
  },
  {
    id: 45,
    name: 'Marketplace for Services',
    price: '$1550',
    timeline: '30-45 days',
    features: [
      'Service Listings',
      'Provider Profiles',
      'Booking System',
      'Payment Integration',
      'Ratings & Reviews'
    ]
  },
  {
    id: 46,
    name: 'Online Booking for Tutors',
    price: '$780',
    timeline: '14-21 days',
    features: [
      'Tutor Profiles',
      'Session Scheduling',
      'Payment Gateway',
      'Student Dashboard',
      'Review System'
    ]
  },
  {
    id: 47,
    name: 'Digital Downloads Store',
    price: '$690',
    timeline: '10-14 days',
    features: [
      'Product Catalog',
      'Instant Download',
      'License Management',
      'Secure Payments',
      'Customer Accounts'
    ]
  },
  {
    id: 48,
    name: 'Wedding Invitation Site',
    price: '$350',
    timeline: '5-7 days',
    features: [
      'RSVP System',
      'Event Details',
      'Photo Gallery',
      'Gift Registry',
      'Countdown Timer'
    ]
  },
  {
    id: 49,
    name: 'Art Gallery Website',
    price: '$600',
    timeline: '10-14 days',
    features: [
      'Artwork Showcase',
      'Exhibition Calendar',
      'Artist Profiles',
      'Online Store',
      'Newsletter Signup'
    ]
  },
  {
    id: 50,
    name: 'Sports Team Website',
    price: '$720',
    timeline: '10-14 days',
    features: [
      'Team Roster',
      'Match Schedule',
      'News & Updates',
      'Photo Gallery',
      'Fan Shop'
    ]
  },
  {
    id: 51,
    name: 'Online Forum Platform',
    price: '$950',
    timeline: '21-28 days',
    features: [
      'Threaded Discussions',
      'User Profiles',
      'Moderation Tools',
      'Private Messaging',
      'Reputation System'
    ]
  },
  {
    id: 52,
    name: 'Real Estate Marketplace',
    price: '$1800',
    timeline: '30-45 days',
    features: [
      'Property Listings',
      'Agent Accounts',
      'Advanced Search',
      'Map Integration',
      'Lead Management'
    ]
  },
  {
    id: 53,
    name: 'Virtual Classroom',
    price: '$1300',
    timeline: '21-28 days',
    features: [
      'Live Video Classes',
      'Assignment Uploads',
      'Student Dashboard',
      'Attendance Tracking',
      'Discussion Boards'
    ]
  },
  {
    id: 54,
    name: 'Influencer Marketing Platform',
    price: '$2200',
    timeline: '45-60 days',
    features: [
      'Campaign Management',
      'Influencer Discovery',
      'Analytics Dashboard',
      'Payment Processing',
      'Brand Profiles'
    ]
  },
  {
    id: 55,
    name: 'Car Rental Website',
    price: '$900',
    timeline: '14-21 days',
    features: [
      'Fleet Listings',
      'Online Booking',
      'Payment Integration',
      'Rental Calendar',
      'Customer Reviews'
    ]
  },
  {
    id: 56,
    name: 'Online Grocery Store',
    price: '$1100',
    timeline: '21-28 days',
    features: [
      'Product Catalog',
      'Cart & Checkout',
      'Delivery Scheduling',
      'Order Tracking',
      'Discount Codes'
    ]
  },
  {
    id: 57,
    name: 'Podcast Analytics Tool',
    price: '$1250',
    timeline: '21-28 days',
    features: [
      'Listener Stats',
      'Episode Performance',
      'Geographic Data',
      'Exportable Reports',
      'Custom Dashboards'
    ]
  },
  {
    id: 58,
    name: 'Online Voting Platform',
    price: '$800',
    timeline: '14-21 days',
    features: [
      'Poll Creation',
      'Secure Voting',
      'Result Analytics',
      'User Authentication',
      'Mobile Friendly'
    ]
  },
  {
    id: 59,
    name: 'Digital Resume Builder',
    price: '$350',
    timeline: '5-7 days',
    features: [
      'Template Selection',
      'PDF Export',
      'Section Customization',
      'Live Preview',
      'Shareable Link'
    ]
  },
  {
    id: 60,
    name: 'Online Appointment Scheduler',
    price: '$600',
    timeline: '10-14 days',
    features: [
      'Calendar Integration',
      'Automated Reminders',
      'Client Portal',
      'Payment Support',
      'Staff Management'
    ]
  }
];

const categories = [
  { id: 'all', name: 'All Services' },
  { id: 'web', name: 'Web Development', packages: [1, 2, 3, 4, 5, 6] },
  { id: 'mobile', name: 'Mobile Apps', packages: [12, 13, 14] },
  { id: 'platforms', name: 'Platforms', packages: [7, 8, 9, 10, 11] },
  { id: 'enterprise', name: 'Enterprise', packages: [15] }
];

const BookService = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const [view, setView] = useState('grid'); // 'grid' or 'table'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    requirements: ''
  });
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sliderRef = useRef(null);

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setFormData(prev => ({
      ...prev,
      service: pkg.name
    }));
  };

  // Removed handleScroll function as we're using native scrolling

  const handlePackageClick = (pkg) => {
    if (selectedPackage?.id === pkg.id) return;
    setSelectedPackage(pkg);
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-gradient-to-br from-blue-600/20 via-blue-900/30 to-purple-900/30 shadow-2xl rounded-lg pointer-events-auto flex ring-2 ring-blue-500/50 border border-blue-400/20 backdrop-blur-md transform transition-all duration-300 ease-out ${t.visible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-4 opacity-0 scale-95'}`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <FaCheck className="text-white text-lg" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">
                {pkg.name}
              </h3>
              <p className="text-sm text-blue-400 font-medium">
                {pkg.price} · {pkg.timeline}
              </p>
              <div className="mt-2 space-y-1">
                {pkg.features.slice(0, 2).map((feature) => (
                  <p key={feature} className="text-xs text-gray-400 flex items-center">
                    <FaCheck className="text-blue-500 text-xs mr-1" />
                    {feature}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-700">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toast.dismiss();
              window.location.href = '/contact?package=' + pkg.id;
            }}
            className="w-full border-2 border-green-500 rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium bg-blue-500/10 text-white hover:bg-blue-500/20 hover:text-white active:bg-blue-600/20 transition-all duration-200 gap-2 group animate-[blink_1.5s_ease-in-out_infinite] hover:animate-none hover:border-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.7)]"
          >
            <span className="group-hover:translate-x-0.5 transition-transform duration-150 cursor-pointer">Click here to book</span>
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    ), {
      duration: 6000,
      position: 'top-center',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredPackages = selectedCategory === 'all' 
    ? packages 
    : packages.filter(pkg => {
        const category = categories.find(cat => cat.id === selectedCategory);
        return category?.packages?.includes(pkg.id);
      });

  return (
    <>
      <Head>
        <title>Book a Service | Websites Arena - Web & Mobile App Experts</title>
        <meta name="description" content="Book professional web and mobile app development services with Websites Arena. Choose a package or request a custom solution for your business. Fast, reliable, and customer-focused digital solutions." />
        <meta property="og:title" content="Book a Service | Websites Arena - Web & Mobile App Experts" />
        <meta property="og:description" content="Book professional web and mobile app development services with Websites Arena. Choose a package or request a custom solution for your business. Fast, reliable, and customer-focused digital solutions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://websitesarena.com/book-service" />
        <meta property="og:image" content="/logo.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Book a Service | Websites Arena - Web & Mobile App Experts" />
        <meta name="twitter:description" content="Book professional web and mobile app development services with Websites Arena. Choose a package or request a custom solution for your business. Fast, reliable, and customer-focused digital solutions." />
        <meta name="twitter:image" content="/logo.jpg" />
        <link rel="canonical" href="https://websitesarena.com/book-service" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Web & Mobile App Development',
          provider: {
            '@type': 'Organization',
            name: 'Websites Arena',
            url: 'https://websitesarena.com/'
          },
          url: 'https://websitesarena.com/book-service',
          description: 'Book professional web and mobile app development services with Websites Arena.'
        })}</script>
        <style>{scrollbarStyles}</style>
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-400 mb-6 px-4">
              Transform Your Digital Presence
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Choose from our carefully crafted packages or request a custom solution for your business needs.
            </p>
          </motion.div>

          {/* Packages Section */}
          <div className="relative mb-16 mx-auto">
            <div className="flex justify-center mb-8">
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Packages Display */}

            {/* Slider Container */}
            <div 
              ref={sliderRef}
              className="flex overflow-x-auto overflow-y-hidden custom-scrollbar gap-6 md:gap-8 py-4 snap-x snap-mandatory mx-auto"
              style={{
                WebkitOverflowScrolling: 'touch',
                paddingLeft: '10%',
                paddingRight: '10%',
                paddingBottom: '12px',
                maxHeight: 'fit-content'
              }}
            >
              {filteredPackages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handlePackageClick(pkg)}
                  className={`flex-none w-[280px] sm:w-[300px] md:w-[320px] snap-center bg-gray-800/95 
                    backdrop-blur-sm rounded-xl p-6 relative ${
                    selectedPackage?.id === pkg.id
                      ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20'
                      : 'hover:bg-gray-700/95 hover:ring-1 hover:ring-blue-500/50'
                  } transition-all duration-300 cursor-pointer transform hover:scale-105 group`}
                >
                <div className="flex flex-col h-full relative group">
                  {selectedPackage?.id === pkg.id && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <FaCheck className="text-white text-xs" />
                    </div>
                  )}
                  
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{pkg.name}</h3>
                    <p className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">{pkg.price}</p>
                    <p className="text-gray-400 text-sm">{pkg.timeline}</p>
                  </div>
                  
                  <div className="mt-4 flex-grow">
                    <ul className="space-y-2 mb-4">
                      {pkg.features.slice(0, 5).map((feature) => (
                        <li key={feature} className="flex items-start space-x-2 text-gray-300">
                          <FaCheck className="text-blue-500 flex-shrink-0 mt-1 text-xs" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
       
              </motion.div>
            ))}
          </div>
        </div>

          {/* Process Timeline */}
          <div className="max-w-4xl mx-auto py-20">
            <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-500/20"></div>
              <div className="space-y-12">
                {processSteps.map((step, index) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} gap-8`}
                  >
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                      <p className="text-gray-400">{step.description}</p>
                    </div>
                    <div className="relative flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center z-10">
                        <step.icon className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="absolute w-16 h-16 rounded-full bg-blue-500/5 animate-ping"></div>
                    </div>
                    <div className="flex-1"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* FAQs Section */}
          <div className="max-w-3xl mx-auto py-20">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.slice(0, showAllFaqs ? faqs.length : 5).map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm cursor-pointer hover:bg-gray-800/70 transition-colors duration-200"
                >
                  <div className="flex items-start gap-4">
                    <FaQuestionCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                        <svg
                          className={`w-5 h-5 text-blue-400 transform transition-transform duration-200 ${
                            expandedFaq === index ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      <motion.div
                        initial={false}
                        animate={{ height: expandedFaq === index ? 'auto' : 0, opacity: expandedFaq === index ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-gray-300 mt-2">{faq.answer}</p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {faqs.length > 5 && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setShowAllFaqs(!showAllFaqs)}
                    className="px-6 py-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    {showAllFaqs ? 'Show Less' : `Show More (${faqs.length - 5} items)`}
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default BookService;
