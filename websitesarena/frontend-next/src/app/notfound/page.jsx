"use client";

import React from 'react';
import Link from 'next/link';
import Head from "next/head";

const NotFound = () => {
  return (
    <>
      <Head>
        <title>404 Not Found | Websites Arena</title>
        <meta name="description" content="Sorry, the page you are looking for does not exist. Explore Websites Arena for web and mobile development, portfolio, and client feedback." />
        <meta property="og:title" content="404 Not Found | Websites Arena" />
        <meta property="og:description" content="Sorry, the page you are looking for does not exist. Explore Websites Arena for web and mobile development, portfolio, and client feedback." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://websitesarena.com/404" />
        <meta property="og:image" content="/logo.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="404 Not Found | Websites Arena" />
        <meta name="twitter:description" content="Sorry, the page you are looking for does not exist. Explore Websites Arena for web and mobile development, portfolio, and client feedback." />
        <meta name="twitter:image" content="/logo.jpg" />
        <link rel="canonical" href="https://websitesarena.com/404" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: '404 Not Found',
          url: 'https://websitesarena.com/404',
          description: 'Sorry, the page you are looking for does not exist.'
        })}</script>
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center relative" role="main" aria-label="404 Not Found">
          {/* Animated background elements */}
          <div className="absolute inset-0 grid grid-cols-3 gap-2 opacity-20">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-blue-500/30 rounded-full w-full h-full"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '3s'
                }}
              />
            ))}
          </div>

          {/* Main content */}
          <div className="relative z-10 bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-700">
            {/* 404 SVG */}
            <div className="w-full max-w-md mx-auto mb-8 relative">
              <svg className="w-full h-32" viewBox="0 0 400 100">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }}>
                      <animate
                        attributeName="stop-color"
                        values="#3B82F6; #60A5FA; #93C5FD; #3B82F6"
                        dur="4s"
                        repeatCount="indefinite"
                      />
                    </stop>
                    <stop offset="100%" style={{ stopColor: '#60A5FA', stopOpacity: 1 }}>
                      <animate
                        attributeName="stop-color"
                        values="#60A5FA; #93C5FD; #3B82F6; #60A5FA"
                        dur="4s"
                        repeatCount="indefinite"
                      />
                    </stop>
                  </linearGradient>
                </defs>
                <text
                  x="50%"
                  y="50%"
                  dy=".35em"
                  textAnchor="middle"
                  className="text-9xl font-bold"
                  fill="url(#gradient)"
                  stroke="url(#gradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  404
                </text>
              </svg>

              {/* Glowing effects */}
              <div className="absolute inset-0 blur-2xl">
                <svg className="w-full h-full" viewBox="0 0 400 100">
                  <text
                    x="50%"
                    y="50%"
                    dy=".35em"
                    textAnchor="middle"
                    className="text-9xl font-bold"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="4"
                    opacity="0.2"
                  >
                    404
                  </text>
                </svg>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-white mb-4">Page Not Found</h1>
            <p className="text-gray-300 mb-8 text-lg">
              Oops! The page you're looking for seems to have vanished into the digital void.
            </p>

            {/* Internal links for navigation */}
            <nav className="mb-6 flex flex-wrap justify-center gap-4" aria-label="Helpful links">
              <Link href="/" className="text-blue-400 hover:underline">Home</Link>
              <Link href="/book-service" className="text-blue-400 hover:underline">Book Service</Link>
              <Link href="/past-projects" className="text-blue-400 hover:underline">Portfolio</Link>
              <Link href="feedbacks" className="text-blue-400 hover:underline">Client Feedback</Link>
              <Link href="/contact" className="text-blue-400 hover:underline">Contact</Link>
            </nav>

            {/* Interactive elements */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/"
                className="group px-6 py-3 bg-blue-600 text-white rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center gap-2 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <svg
                  className="w-5 h-5 relative z-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span className="relative z-10">Return Home</span>
              </Link>
              <button
                onClick={() => window.history.back()}
                className="group px-6 py-3 bg-gray-700 text-gray-200 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center gap-2 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <svg
                  className="w-5 h-5 relative z-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span className="relative z-10">Go Back</span>
              </button>
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-blue-500/30 rounded-full w-2 h-2"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `float${i % 3} ${2 + Math.random() * 4}s linear infinite`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* CSS Animations */}
        <style>{`
          @keyframes float0 {
            0% {
              transform: translate(0, 0) rotate(0deg);
              opacity: 0;
            }
            50% {
              opacity: 0.5;
            }
            100% {
              transform: translate(100px, -100px) rotate(360deg);
              opacity: 0;
            }
          }
          @keyframes float1 {
            0% {
              transform: translate(0, 0) rotate(0deg);
              opacity: 0;
            }
            50% {
              opacity: 0.5;
            }
            100% {
              transform: translate(-100px, -100px) rotate(-360deg);
              opacity: 0;
            }
          }
          @keyframes float2 {
            0% {
              transform: translate(0, 0) rotate(0deg);
              opacity: 0;
            }
            50% {
              opacity: 0.5;
            }
            100% {
              transform: translate(50px, -150px) rotate(180deg);
              opacity: 0;
            }
          }
  `}</style>
      </div>
    </>
  );
};

export default NotFound;