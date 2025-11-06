'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  
  // Hide navbar and footer for admin and developer dashboards
  const shouldHideLayout = pathname?.startsWith('/dashboard/admin') || 
                         pathname?.startsWith('/dashboard/developer');
  
  // Show navbar and footer for client dashboard and other routes
  return (
    <>
      {!shouldHideLayout && <Navbar />}
      <main>{children}</main>
      {!shouldHideLayout && <Footer />}
    </>
  );
}