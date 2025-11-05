import '@fontsource/cinzel-decorative/400.css';
import '@fontsource/cinzel-decorative/700.css';
import './globals.css';
import ToastProvider from '@/components/ToastProvider';

export const metadata = {
  title: 'Websites Arena',
  description: 'Web and Mobile App Development Agency',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}