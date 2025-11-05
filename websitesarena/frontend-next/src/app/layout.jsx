'use client';

import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { usePathname } from 'next/navigation';
import Head from 'next/head';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  // Create middleware-like auth check for dashboard routes
  if (typeof window !== 'undefined' && isDashboard) {
    const isClientDashboard = pathname?.startsWith('/dashboard/client');
    const isDeveloperDashboard = pathname?.startsWith('/dashboard/developer');
    const hasClientToken = !!localStorage.getItem('token') || !!localStorage.getItem('admin_token');
    const hasDevToken = !!localStorage.getItem('developer_token');

    if (isClientDashboard && !hasClientToken) {
      window.location.href = '/clientauth';
      return null;
    }
    if (isDeveloperDashboard && !hasDevToken) {
      window.location.href = '/signin';
      return null;
    }
    // For admin and generic dashboard routes, require at least a client/admin token
    if (!isClientDashboard && !isDeveloperDashboard && !hasClientToken && !hasDevToken) {
      // default to signin for admin/developer
      window.location.href = '/signin';
      return null;
    }
  }

  return (
    <html lang="en">
      {isDashboard && (
        <Head>
          {/* Prevent dashboard pages from being indexed by search engines */}
          <meta name="robots" content="noindex, nofollow" />
          <meta name="googlebot" content="noindex, nofollow" />
        </Head>
      )}
      <body className="bg-gray-900 text-white">
        {!isDashboard && <Navbar />}
        <main>{children}</main>
        {!isDashboard && <Footer />}
        {/* Beautiful dark-themed toast notifications */}
        <Toaster
          position="center-top"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            className: "shadow-lg rounded-lg border p-4",
            style: {
              background: "#1f1f1f", // dark background
              color: "#fff",          // text color
              fontWeight: "500",
            },
            success: {
              duration: 4000,
              style: {
                background: "#0f5132",
                color: "#d1e7dd",
                border: "1px solid #198754",
              },
              iconTheme: {
                primary: "#198754", // green icon
                secondary: "#1f1f1f",
              },
            },
            error: {
              duration: 4000,
              style: {
                background: "#842029",
                color: "#f8d7da",
                border: "1px solid #dc3545",
              },
              iconTheme: {
                primary: "#dc3545", // red icon
                secondary: "#1f1f1f",
              },
            },
            loading: {
              style: {
                background: "#0d6efd", // blue for loading
                color: "#cfe2ff",
                border: "1px solid #0d6efd",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#0d6efd",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
