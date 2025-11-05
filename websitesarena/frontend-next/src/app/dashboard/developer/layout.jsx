export const metadata = {
  title: "Dashboard | Websites Arena",
  description: "Manage your account and projects",
};
import ClientLoader from "./ClientLoader";

export default function DashboardLayout({ children }) {
  return (
    <div className="bg-gray-900 text-white">
      {/* ClientLoader is a small client-only wrapper that shows the 3s spinner */}
      <ClientLoader>
        <main className="min-h-screen">{children}</main>
      </ClientLoader>
    </div>
  );
}
