"use client";

import React from 'react'
import Link from 'next/link';
import { 
  FaInstagram, FaYoutube, FaTiktok 
} from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear();

  const socialLinks = [
    { 
      icon: FaInstagram, 
      href: 'https://instagram.com/@websitesarena', 
      label: 'Instagram',
      color: 'hover:bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500'
    },
    { 
      icon: FaYoutube, 
      href: 'https://youtube.com/@websitesarena', 
      label: 'YouTube',
      color: 'hover:bg-red-600'
    },
    { 
      icon: FaTiktok, 
      href: 'https://tiktok.com/@websitesarena', 
      label: 'TikTok',
      color: 'hover:bg-black'
    },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-white text-xl font-bold">Websites Arena</h3>
              <p className="text-gray-400 mt-2">
                Professional web development solutions for businesses worldwide.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center group"
                  aria-label={social.label}
                >
                  <div className={`flex items-center justify-center h-8 w-8 rounded-md bg-gray-800 text-gray-400 ${social.color} hover:text-white transform group-hover:scale-110 transition-all duration-200`}>
                    <social.icon className="h-4 w-4" />
                  </div>
                  <span className="mt-1 text-xs text-gray-400 group-hover:text-white transition-colors duration-200">
                    {social.label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: '/', text: 'Home' },
                { href: '/about', text: 'About Us' },
                { href: '/projects', text: 'Past Projects' },
                { href: '/careers', text: 'Careers' },
              ].map((link) => (
                <li key={link.text}>
                  {link.isExternal ? (
                    <a 
                      href={link.href}
                      className="text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                    >
                      {link.text}
                      <svg 
                        className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200" 
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  ) : (
                    <Link 
                      href={link.href} // ✅ FIXED: use href instead of to
                      className="text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                    >
                      {link.text}
                      <svg 
                        className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200" 
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Services</h3>
            <ul className="space-y-3">
              {[
                'Web Development',
                'Mobile App Development',
              ].map((service) => (
                <li 
                  key={service}
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200 cursor-pointer flex items-center group"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="group">
                <a 
                  href="mailto:info@websitesarena.com"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-start"
                >
                  <svg 
                    className="w-5 h-5 mr-2 mt-1 text-gray-500 group-hover:text-blue-400 transition-colors duration-200" 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <div>
                    <span className="block text-sm font-medium">Email:</span>
                    info@websitesarena.com
                  </div>
                </a>
              </li>
              <li className="group">
                <div className="text-gray-400 transition-colors duration-200 flex items-start">
                  <svg 
                    className="w-5 h-5 mr-2 mt-1 text-gray-500 group-hover:text-blue-400 transition-colors duration-200" 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <div>
                    <span className="block text-sm font-medium">Phone:</span>
                    <a href="tel:+254115258685" className="hover:text-blue-400">+254 115 258 685</a>
                    <br/>
                    <a href="tel:+254736671857" className="hover:text-blue-400">+254 736 671 857</a>
                  </div>
                </div>
              </li>
              <li className="group">
                <div className="text-gray-400 transition-colors duration-200 flex items-start">
                  <svg 
                    className="w-5 h-5 mr-2 mt-1 text-gray-500 group-hover:text-blue-400 transition-colors duration-200" 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <div>
                    <span className="block text-sm font-medium">Address:</span>
                    Nairobi, Kenya
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-400">
            © {year} Websites Arena. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
