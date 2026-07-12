"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Layers, PlusCircle, Menu, X, LogOut, ArrowLeft } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const navItems = [
  { label: "Analytics", href: "/provider/analytics", icon: LayoutDashboard },
  { label: "Manage Services", href: "/items/manage", icon: Layers },
  { label: "Add Service", href: "/items/add", icon: PlusCircle },
];

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isPending && (!session || (session.user.role !== "provider" && session.user.role !== "admin"))) {
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

  if (!session || (session.user.role !== "provider" && session.user.role !== "admin")) {
    return null;
  }

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  const getPageTitle = () => {
    const activeItem = navItems.find((item) => item.href === pathname);
    return activeItem ? activeItem.label : "Provider Console";
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-outline-variant">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-black font-display">
          P
        </div>
        <div>
          <span className="font-extrabold text-on-surface font-display text-sm tracking-wide block">PartnerHub</span>
          <span className="text-[10px] text-primary font-bold tracking-wider uppercase block -mt-0.5">Provider Console</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface/75 hover:bg-surface-container hover:text-on-surface"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-outline-variant space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-on-surface/70 hover:bg-surface-container hover:text-on-surface transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Marketplace</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-error hover:bg-error/10 transition-all cursor-pointer text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar (lg+) */}
      <aside className="hidden lg:block w-64 bg-surface border-r border-outline-variant shrink-0">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header bar */}
        <header className="h-16 bg-surface border-b border-outline-variant flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-on-surface/70 hover:bg-surface-container transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-extrabold text-on-surface font-display text-sm tracking-tight lg:text-base">
              {getPageTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                {session.user.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left leading-none">
                <span className="text-xs font-bold text-on-surface block">{session.user.name}</span>
                <span className="text-[9px] text-on-surface/50 font-medium">{session.user.email}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic page contents wrapper */}
        <main className="flex-1 overflow-y-auto bg-background/50">
          {children}
        </main>
      </div>

      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/45 backdrop-blur-xs lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-surface border-r border-outline-variant transition-transform duration-200 ease-in-out lg:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 rounded-lg bg-surface-container border border-outline-variant text-on-surface/75 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <SidebarContent />
      </div>
    </div>
  );
}
