"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { 
  LayoutDashboard, 
  Briefcase, 
  Calendar, 
  Star, 
  Users, 
  Heart, 
  Settings, 
  Menu, 
  X,
  LogOut,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

// Sub-views
import { OverviewTab } from "@/components/dashboard/OverviewTab";
import { ManageServicesTab } from "@/components/dashboard/ManageServicesTab";
import { BookingsTab } from "@/components/dashboard/BookingsTab";
import { ReviewsTab } from "@/components/dashboard/ReviewsTab";
import { UsersTab } from "@/components/dashboard/UsersTab";
import { FavoritesTab } from "@/components/dashboard/FavoritesTab";
import { SettingsTab } from "@/components/dashboard/SettingsTab";

interface NavItem {
  id: string;
  label: string;
  icon: any;
  roles: string[];
}

const navItems: NavItem[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, roles: ["customer", "provider", "admin"] },
  { id: "services", label: "Manage Services", icon: Briefcase, roles: ["provider", "admin"] },
  { id: "bookings", label: "Bookings", icon: Calendar, roles: ["customer", "provider"] },
  { id: "reviews", label: "Reviews", icon: Star, roles: ["customer", "provider", "admin"] },
  { id: "users", label: "Users", icon: Users, roles: ["admin"] },
  { id: "favorites", label: "Wishlist", icon: Heart, roles: ["customer", "provider", "admin"] },
  { id: "settings", label: "Settings", icon: Settings, roles: ["customer", "provider", "admin"] },
];

export default function UnifiedDashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login?callbackURL=/dashboard");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const user = session.user;
  const userRole = user.role || "customer";

  // Filter nav items based on user role
  const allowedNavItems = navItems.filter((item) => item.roles.includes(userRole));

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  const activeItem = allowedNavItems.find((item) => item.id === activeTab) || allowedNavItems[0];

  const renderActiveTab = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab role={userRole} onNavigate={(tab) => setActiveTab(tab)} />;
      case "services":
        return <ManageServicesTab role={userRole} />;
      case "bookings":
        return <BookingsTab role={userRole} />;
      case "reviews":
        return <ReviewsTab role={userRole} />;
      case "users":
        return <UsersTab />;
      case "favorites":
        return <FavoritesTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <OverviewTab role={userRole} onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-surface-container">
      {/* Brand / Role header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-outline-variant">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-black font-display uppercase">
          {userRole[0]}
        </div>
        <div>
          <span className="font-extrabold text-on-surface font-display text-sm tracking-wide block capitalize">
            {userRole} Portal
          </span>
          <span className="text-[10px] text-on-surface/50 font-bold tracking-wider uppercase block -mt-0.5">
            ServiceHub Dashboard
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {allowedNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all w-full text-left min-h-[44px] cursor-pointer ${
                isActive
                  ? "bg-primary/10 text-primary shadow-xs"
                  : "text-on-surface/75 hover:bg-surface-container-high hover:text-on-surface"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer controls inside sidebar */}
      <div className="p-4 border-t border-outline-variant space-y-2 bg-surface-container-low/40">
        <button
          onClick={() => router.push("/")}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface text-xs font-bold hover:bg-surface-container transition-colors min-h-[40px] cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Site</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-error/10 text-error text-xs font-bold hover:bg-error/15 transition-colors cursor-pointer min-h-[40px]"
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
      <aside className="hidden lg:block w-64 border-r border-outline-variant bg-surface-container shrink-0">
        <div className="sticky top-16 h-[calc(100vh-64px)]">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
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
        {/* Top Header Bar for Mobile (lg:hidden) */}
        <header className="lg:hidden sticky top-16 z-30 h-14 bg-surface border-b border-outline-variant flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container cursor-pointer text-on-surface"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-bold text-on-surface font-display capitalize">
              {activeItem?.label || "Dashboard"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-[1280px] w-full mx-auto">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
}
