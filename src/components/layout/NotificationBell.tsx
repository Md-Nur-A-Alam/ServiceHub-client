"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, X, Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useNotifications, INotification } from "@/hooks/useNotifications";
import { authClient } from "@/lib/auth-client";

export function NotificationBell() {
  const { data: session } = authClient.useSession();
  const { data: notifications = [], markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [isPulse, setIsPulse] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Listen to new-notification-pulse event
  useEffect(() => {
    const handlePulse = () => {
      setIsPulse(true);
      const timer = setTimeout(() => setIsPulse(false), 1200);
      return () => clearTimeout(timer);
    };

    window.addEventListener("new-notification-pulse", handlePulse);
    return () => window.removeEventListener("new-notification-pulse", handlePulse);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  if (!session) return null;

  const handleMarkRead = () => {
    markAllAsRead();
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`relative w-10 h-10 flex items-center justify-center rounded-lg text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer ${
          isPulse ? "animate-bounce" : ""
        }`}
        aria-label="View notifications"
        aria-expanded={isOpen}
      >
        <Bell className={`w-5 h-5 ${isPulse ? "text-primary animate-pulse" : ""}`} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] font-bold text-white ring-2 ring-surface animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Modal / Panel */}
      {isOpen && (
        <>
          {/* Mobile Full Screen Panel (<md) */}
          <div className="md:hidden fixed inset-0 z-50 bg-surface flex flex-col animate-in fade-in slide-in-from-bottom duration-250">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-on-surface font-display">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-error/10 text-error text-[10px] font-bold">
                    {unreadCount} unread
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface/70 hover:bg-surface-container-high cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-20 text-on-surface/50">
                  <p className="text-sm">You're all caught up!</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <Link
                    key={n._id}
                    href={n.link || "#"}
                    onClick={() => setIsOpen(false)}
                    className={`block p-4 rounded-xl border transition-all ${
                      n.read
                        ? "bg-surface-container/30 border-outline-variant/50 text-on-surface/75"
                        : "bg-primary/5 border-primary/20 text-on-surface font-medium shadow-xs"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-on-surface/50 mt-2 block">
                      {new Date(n.createdAt).toLocaleTimeString()}
                    </span>
                  </Link>
                ))
              )}
            </div>

            {/* Footer */}
            {unreadCount > 0 && (
              <div className="p-4 border-t border-outline-variant">
                <button
                  onClick={handleMarkRead}
                  className="w-full py-2.5 bg-primary text-on-primary font-semibold rounded-xl hover:brightness-110 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Mark all as read</span>
                </button>
              </div>
            )}
          </div>

          {/* Desktop Dropdown Panel (md+) */}
          <div className="hidden md:block absolute right-0 top-full mt-2 w-80 bg-surface border border-outline-variant rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant bg-surface-container/50">
              <span className="font-bold text-xs text-on-surface uppercase tracking-wider">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkRead}
                  className="text-xs text-primary hover:text-primary-hover font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark read</span>
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-outline-variant/60">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-on-surface/50 text-xs">
                  <span>No new notifications</span>
                </div>
              ) : (
                notifications.map((n) => (
                  <Link
                    key={n._id}
                    href={n.link || "#"}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 hover:bg-surface-container-high transition-colors ${
                      n.read ? "text-on-surface/70" : "bg-primary/5 text-on-surface font-semibold"
                    }`}
                  >
                    <p className="text-xs leading-relaxed break-words">{n.message}</p>
                    <span className="text-[9px] text-on-surface/40 mt-1 block">
                      {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </Link>
                ))
              )}
            </div>

            <div className="px-4 py-2.5 bg-surface-container/30 border-t border-outline-variant text-center">
              <Link
                href="/bookings"
                onClick={() => setIsOpen(false)}
                className="text-[11px] font-semibold text-primary hover:text-primary-hover inline-flex items-center gap-1"
              >
                <span>View bookings page</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export default NotificationBell;
