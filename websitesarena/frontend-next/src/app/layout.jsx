import "./globals.css";
import { Toaster } from "react-hot-toast";
import VisitTracker from '@/components/VisitTracker';
import RootClient from '@/components/RootClient';
import ClientLayout from '@/components/ClientLayout';

export default function RootLayout({ children }) {
  // Root layout is intentionally a server-rendered shell
  // Any dashboard-only client logic lives inside the dashboard layout

  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <ClientLayout>
          <VisitTracker />
          <RootClient>
            <main>{children}</main>
          </RootClient>
        </ClientLayout>
        {/* Beautiful dark-themed toast notifications */}
        <Toaster
          position="center-top"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            className: "shadow-lg rounded-lg border p-4",
            style: {
              background: "#1f1f1f",
              color: "#fff",
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
                primary: "#198754",
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
                primary: "#dc3545",
                secondary: "#1f1f1f",
              },
            },
            loading: {
              style: {
                background: "#0d6efd",
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
