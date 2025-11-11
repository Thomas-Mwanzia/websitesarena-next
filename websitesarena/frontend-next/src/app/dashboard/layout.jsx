export const metadata = {
  robots: 'noindex, nofollow',
  title: 'Dashboard | Websites Arena'
};

export default function DashboardLayout({ children }) {
  return (
    <div>
      {/* We don't include Navbar or Footer here */}
      {children}
    </div>
  );
}