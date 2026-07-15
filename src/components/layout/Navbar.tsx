"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown, LogOut, User, Settings, LayoutDashboard } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { MobileDrawer } from "./MobileDrawer";
import { NotificationBell } from "./NotificationBell";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const publicNavLinks = [
  { label: "Explore", href: "/explore" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "For Providers", href: "/#for-providers" },
];

const customerNavLinks = [
  { label: "Explore", href: "/explore" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Bookings", href: "/bookings" },
  { label: "Wishlist", href: "/wishlist" },
];

const providerNavLinks = [
  { label: "Explore", href: "/explore" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Bookings", href: "/bookings" },
  { label: "Add Service", href: "/items/add" },
];

const adminNavLinks = [
  { label: "Explore", href: "/explore" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Admin", href: "/admin" },
  { label: "Bookings", href: "/bookings" },
];

function getNavLinks(role?: string) {
  if (!role) return publicNavLinks;
  if (role === "provider") return providerNavLinks;
  if (role === "admin") return adminNavLinks;
  return customerNavLinks;
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const { data: session } = authClient.useSession();
  const user = session?.user as any;
  const isLoggedIn = !!user;
  const userRole = user?.role;
  const navLinks = getNavLinks(userRole);

  // Scroll detection for border
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close avatar dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus hamburger when drawer closes
  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
    setTimeout(() => hamburgerRef.current?.focus(), 100);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-surface transition-all duration-200 ${scrolled ? "border-b border-outline-variant shadow-sm" : ""
          }`}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-2">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 mr-4">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-on-primary font-bold text-sm font-display">S</span>
              </div>
              <span className="font-bold text-lg text-on-surface font-display hidden sm:block">
                ServiceHub
              </span>
            </Link>

            {/* Desktop Nav Links (md+) */}
            <nav className="hidden md:flex items-center gap-1 flex-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === link.href
                      ? "text-primary bg-primary/10"
                      : "text-on-surface/75 hover:text-on-surface hover:bg-surface-container-high"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side controls */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Theme toggle always visible */}
              <div className="hidden md:block">
                <ThemeToggle />
              </div>

              {isLoggedIn ? (
                <>
                  <NotificationBell />
                  {/* Avatar dropdown (lg+) */}
                  <div className="hidden lg:block relative" ref={avatarRef}>
                    <button
                      onClick={() => setAvatarOpen((v) => !v)}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
                      aria-label="User menu"
                      aria-expanded={avatarOpen}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary text-xs font-bold overflow-hidden border border-outline-variant">
                        {user?.image ? (
                          <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          getInitials(user?.name)
                        )}
                      </div>
                      <span className="text-sm font-medium text-on-surface max-w-[100px] truncate">
                        {user?.name?.split(" ")[0]}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-on-surface/50 transition-transform ${avatarOpen ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {/* Dropdown */}
                    {avatarOpen && (
                      <div className="absolute right-0 top-full mt-2 w-52 bg-surface border border-outline-variant rounded-xl shadow-lg py-1 z-50">
                        <div className="px-4 py-2 border-b border-outline-variant">
                          <p className="text-sm font-semibold text-on-surface truncate">{user?.name}</p>
                          <p className="text-xs text-on-surface/50 truncate">{user?.email}</p>
                        </div>
                        <Link
                          href="/dashboard"
                          onClick={() => setAvatarOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-high transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                        <Link
                          href="/dashboard?tab=settings"
                          onClick={() => setAvatarOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-high transition-colors"
                        >
                          <User className="w-4 h-4" /> Profile
                        </Link>
                        <Link
                          href="/dashboard?tab=settings"
                          onClick={() => setAvatarOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-high transition-colors"
                        >
                          <Settings className="w-4 h-4" /> Settings
                        </Link>
                        <div className="border-t border-outline-variant mt-1">
                          <button
                            onClick={() => { handleLogout(); setAvatarOpen(false); }}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-error hover:bg-error/10 transition-colors cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" /> Log Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* Auth buttons (md+) */
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-semibold text-on-surface rounded-lg border border-outline-variant hover:bg-surface-container-high transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-sm font-semibold bg-primary text-on-primary rounded-lg hover:brightness-110 transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Hamburger — visible below lg for logged-in, below md for logged-out */}
              <button
                ref={hamburgerRef}
                onClick={() => setDrawerOpen(true)}
                className={`flex items-center justify-center w-10 h-10 rounded-lg text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer ${isLoggedIn ? "lg:hidden" : "md:hidden"
                  }`}
                aria-label="Open navigation menu"
                aria-expanded={drawerOpen}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={handleDrawerClose}
        navLinks={navLinks}
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        userName={user?.name}
        onLogout={handleLogout}
      />
    </>
  );
}

export default Navbar;
