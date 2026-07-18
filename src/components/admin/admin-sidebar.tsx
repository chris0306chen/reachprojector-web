"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Mail, 
  Truck, 
  Users, 
  Download,
  LogOut,
  ExternalLink,
  Menu,
  X
} from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/admin/dashboard", label: "仪表盘", icon: LayoutDashboard },
  { href: "/admin/products", label: "产品管理", icon: Package },
  { href: "/admin/products/import", label: "导入产品", icon: Download },
  { href: "/admin/orders", label: "订单管理", icon: ShoppingCart },
  { href: "/admin/inquiries", label: "询价管理", icon: Mail },
  { href: "/admin/shipping", label: "物流管理", icon: Truck },
  { href: "/admin/users", label: "用户管理", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navLinks = (
    <nav className="flex flex-col flex-1 p-3 space-y-1 overflow-y-auto">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  const footerLinks = (
    <div className="p-3 border-t border-slate-200 space-y-1">
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
      >
        <ExternalLink className="w-5 h-5 flex-shrink-0" />
        <span>查看网站</span>
      </Link>
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full text-left transition-colors"
      >
        <LogOut className="w-5 h-5 flex-shrink-0" />
        <span>退出登录</span>
      </button>
    </div>
  );

  return (
    <>
      {/* ===== MOBILE: Top header bar (always visible on mobile) ===== */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-200 z-40 flex items-center px-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="打开菜单"
        >
          <Menu className="w-5 h-5 text-slate-700" />
        </button>
        <div className="flex items-center gap-2 ml-3">
          <div className="w-7 h-7 bg-orange-500 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-xs">R</span>
          </div>
          <span className="font-bold text-slate-900 text-sm">REACH 管理后台</span>
        </div>
      </header>

      {/* ===== MOBILE: Overlay (only when drawer is open) ===== */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ===== MOBILE: Sidebar drawer (slides in from left, hidden by default) ===== */}
      <aside
        className={cn(
          "lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-white border-r border-slate-200 z-[60] flex flex-col transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Drawer header with close button */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-sm leading-tight">REACH</h1>
              <p className="text-xs text-slate-500 leading-tight">管理后台</p>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="关闭菜单"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        {navLinks}
        {footerLinks}
      </aside>

      {/* ===== DESKTOP: Fixed sidebar (always visible on lg+) ===== */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-slate-200 fixed left-0 top-0 bottom-0 z-20">
        {/* Desktop header */}
        <div className="p-4 border-b border-slate-200">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-sm leading-tight">REACH</h1>
              <p className="text-xs text-slate-500 leading-tight">管理后台</p>
            </div>
          </Link>
        </div>
        {navLinks}
        {footerLinks}
      </aside>
    </>
  );
}
