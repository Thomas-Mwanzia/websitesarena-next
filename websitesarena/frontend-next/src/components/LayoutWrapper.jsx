'use client';

import { usePathname } from 'next/navigation';
import ROUTES from '@/app/utils/routes';
import Navbar from './Navbar';
import Footer from './Footer';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  
  // Check if we're on any dashboard route
  const isDashboardRoute = pathname?.startsWith('/dashboard');

  // Only render Navbar and Footer for non-dashboard routes
  if (isDashboardRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}