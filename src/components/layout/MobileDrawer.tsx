"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface NavLink {
  label: string;
  href: string;
}

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
  isLoggedIn: boolean;
  userRole?: string;
  userName?: string;
  onLogout?: () => void;
}

export function MobileDrawer({
  isOpen,
  onClose,
  navLinks,
  isLoggedIn,
  userRole,
  userName,
  onLogout,
}: MobileDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Trap focus and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    // Focus close button when drawer opens
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      // Basic focus trap
      if (e.key === "Tab" && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, a, input, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Drawer panel - slides in from right */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[85vw] bg-surface flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-on-primary font-bold text-sm font-display">S</span>
            </div>
            <span className="font-bold text-lg text-on-surface font-display">ServiceHub</span>
          </Link>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface/70 hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="flex items-center px-4 py-3 rounded-lg text-on-surface font-medium hover:bg-surface-container-high transition-colors min-h-[44px]"
            >
              {link.label}
            </Link>
          ))}

          {/* Role-specific links */}
          {isLoggedIn && userRole === "provider" && (
            <Link
              href="/items/add"
              onClick={onClose}
              className="flex items-center px-4 py-3 rounded-lg text-secondary font-semibold hover:bg-surface-container-high transition-colors min-h-[44px]"
            >
              + Add Service
            </Link>
          )}
          {isLoggedIn && userRole === "admin" && (
            <Link
              href="/admin"
              onClick={onClose}
              className="flex items-center px-4 py-3 rounded-lg text-error font-semibold hover:bg-surface-container-high transition-colors min-h-[44px]"
            >
              Admin Panel
            </Link>
          )}
        </nav>

        {/* Footer controls */}
        <div className="px-4 py-6 border-t border-outline-variant space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-sm text-on-surface/60 font-medium">Theme</span>
            <ThemeToggle />
          </div>

          {isLoggedIn ? (
            <div className="space-y-2">
              <Link
                href="/dashboard"
                onClick={onClose}
                className="flex items-center justify-center w-full px-4 py-2.5 rounded-lg border border-outline-variant text-on-surface font-semibold text-sm hover:bg-surface-container-high transition-colors min-h-[44px]"
              >
                My Dashboard
              </Link>
              <button
                onClick={() => { onLogout?.(); onClose(); }}
                className="flex items-center justify-center w-full px-4 py-2.5 rounded-lg text-error font-semibold text-sm hover:bg-error/10 transition-colors min-h-[44px] cursor-pointer"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                href="/login"
                onClick={onClose}
                className="flex items-center justify-center w-full px-4 py-2.5 rounded-lg border border-outline-variant text-on-surface font-semibold text-sm hover:bg-surface-container-high transition-colors min-h-[44px]"
              >
                Log In
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-primary text-on-primary font-semibold text-sm hover:brightness-110 transition-all min-h-[44px]"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MobileDrawer;
