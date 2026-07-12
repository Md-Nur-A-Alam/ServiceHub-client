"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ShieldAlert, Users, ListFilter, ScrollText, Menu, X, LogOut, ArrowLeft } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Moderation", href: "/admin/moderation", icon: ListFilter },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Audit Log", href: "/admin/audit-log", icon: ScrollText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isPending && (!session || session.user.role !== "admin")) {
      router.push("/");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session || session.user.role !== "admin") {
    return null;
  }

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  const getPageTitle = () => {
    const activeItem = navItems.find((item) => item.href === pathname);
    return activeItem ? activeItem.label : "Admin Control Panel";
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-outline-variant">
        <div className="w-8 h-8 rounded-lg bg-error flex items-center justify-center text-on-error font-black font-display">
          A
        </div>
        <div>
          <span className="font-extrabold text-on-surface font-display text-sm tracking-wide block">AdminHub</span>
          <span className="text-[10px] text-error font-bold tracking-wider uppercase block -mt-0.5">Control panel</span>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
                isActive
                  ? "bg-error/10 text-error shadow-xs"
                  : "text-on-surface/75 hover:bg-surface-container-high hover:text-on-surface"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-outline-variant space-y-3 bg-surface-container/30">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface text-xs font-bold hover:bg-surface-container transition-colors min-h-[44px]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Site</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-error/10 text-error text-xs font-bold hover:bg-error/15 transition-colors cursor-pointer min-h-[44px]"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background text-on-surface">
      {/* Persistent Left Sidebar (lg+) */}
      <aside className="hidden lg:block w-64 bg-surface-container border-r border-outline-variant shrink-0">
        <div className="sticky top-0 h-screen">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      {/* Mobile Drawer Panel */}
      <aside
        className={`lg:hidden fixed top-0 bottom-0 left-0 z-50 w-64 bg-surface-container shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-surface hover:bg-surface-container-high border border-outline-variant cursor-pointer text-on-surface/75"
          aria-label="Close sidebar"
        >
          <X className="w-4 h-4" />
        </button>
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 bg-surface border-b border-outline-variant flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-high cursor-pointer text-on-surface"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-on-surface font-display">{getPageTitle()}</h2>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-error text-on-error flex items-center justify-center font-bold text-xs">
                {session.user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-on-surface/80 hidden sm:inline">{session.user.name}</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
