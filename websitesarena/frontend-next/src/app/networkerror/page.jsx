"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
const NetworkError = () => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center relative">
        {/* Animated signal waves */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute border-4 border-purple-500 rounded-full"
              style={{
                width: `${(i + 1) * 100}px`,
                height: `${(i + 1) * 100}px`,
                animation: `ping ${2 + i * 0.5}s cubic-bezier(0, 0, 0.2, 1) infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10 bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-purple-700">
          {/* Network Error SVG */}
          <div className="w-full max-w-md mx-auto mb-8">
            <svg className="w-24 h-24 mx-auto mb-4" viewBox="0 0 24 24" fill="none">
              <path
                className="stroke-current text-purple-500"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M23 12l-4-4v3H5v2h14v3l4-4z"
              >
                <animate
                  attributeName="opacity"
                  values="0.2;1;0.2"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </path>
              <path
                className="stroke-current text-purple-300"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M1 12l4 4v-3h14v-2H5V8l-4 4z"
              >
                <animate
                  attributeName="opacity"
                  values="1;0.2;1"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">Network Error</h1>
          <p className="text-gray-300 mb-8 text-lg">
            Oops! It seems we've lost connection to the server.
            <br />
            Please check your internet connection and try again.
          </p>

          {/* Interactive elements */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center gap-2 disabled:opacity-50"
            >
              {isRetrying ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Retrying...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Retry Connection
                </>
              )}
            </button>
            <Link
              href="/"
              className="px-6 py-3 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
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
              Return Home
            </Link>
          </div>

          {/* Status indicator */}
          <div className="mt-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-700/50">
            <div className={`w-2 h-2 rounded-full ${isRetrying ? 'bg-yellow-400 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-300">
              {isRetrying ? 'Attempting to reconnect...' : 'Connection lost'}
            </span>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes ping {
          0% {
            transform: scale(0.2);
            opacity: 0.8;
          }
          80%, 100% {
            transform: scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default NetworkError;