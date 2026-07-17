"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminErrorBoundary } from "@/components/admin/error-boundary";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  // Login page: standalone, no sidebar or header
  if (isLoginPage) {
    return (
      <AdminErrorBoundary>
        {children}
      </AdminErrorBoundary>
    );
  }

  return (
    <AdminErrorBoundary>
      <div className="min-h-screen bg-slate-50">
        <AdminSidebar />
        {/* Main content: offset for mobile header (h-14) on mobile, offset for desktop sidebar (w-64) on lg+ */}
        <main className="pt-14 lg:pt-0 lg:ml-64 min-h-screen">
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </AdminErrorBoundary>
  );
}
