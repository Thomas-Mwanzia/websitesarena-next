export const metadata = {
  title: "Client Dashboard | Websites Arena",
  description: "Manage your projects and services",
};

export default function ClientDashboardLayout({ children }) {
  return (
    <div className="min-h-screen">
      {/* Clean layout without Navbar or Footer */}
      {children}
    </div>
  );
}
