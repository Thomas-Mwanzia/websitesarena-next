export const metadata = {
  title: "Admin Dashboard | Websites Arena",
  description: "Manage the platform and users",
};

export default function AdminDashboardLayout({ children }) {
  return (
    <div className="min-h-screen">
      {/* Clean layout without Navbar or Footer */}
      {children}
    </div>
  );
}
