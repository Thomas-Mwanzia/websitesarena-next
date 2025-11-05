import '@fontsource/cinzel-decorative/400.css';
import '@fontsource/cinzel-decorative/700.css';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
export const metadata = {
  title: 'Websites Arena',
  description: 'Web and Mobile App Development Agency',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster
          position="center-top"
          reverseOrder={false}
        />
      </body>
    </html>
  );
}