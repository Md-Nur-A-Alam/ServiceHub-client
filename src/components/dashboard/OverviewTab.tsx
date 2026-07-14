"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Calendar, 
  Layers, 
  Heart, 
  DollarSign, 
  Clock,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

interface OverviewTabProps {
  role: string;
  onNavigate: (tab: string) => void;
}

export function OverviewTab({ role, onNavigate }: OverviewTabProps) {
  // Fetch bookings
  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: async () => {
      const response = await apiClient.get("/bookings");
      return response.data.data || [];
    },
    enabled: role !== "admin"
  });

  // Fetch wishlist
  const { data: wishlistData, isLoading: wishlistLoading } = useQuery({
    queryKey: ["my-wishlist"],
    queryFn: async () => {
      const response = await apiClient.get("/favorites");
      return response.data.data || [];
    },
    enabled: role === "customer"
  });

  // Fetch provider services
  const { data: servicesData, isLoading: servicesLoading } = useQuery({
    queryKey: ["provider-services"],
    queryFn: async () => {
      const response = await apiClient.get("/services/provider/me");
      return response.data.data || [];
    },
    enabled: role === "provider"
  });

  // Fetch admin analytics
  const { data: adminAnalytics, isLoading: adminLoading } = useQuery({
    queryKey: ["admin-analytics-dashboard"],
    queryFn: async () => {
      const response = await apiClient.get("/admin/analytics");
      return response.data.data;
    },
    enabled: role === "admin"
  });

  const isLoading = bookingsLoading || wishlistLoading || servicesLoading || adminLoading;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-surface-container rounded-2xl border border-outline-variant" />
          ))}
        </div>
        <div className="h-64 bg-surface-container rounded-2xl border border-outline-variant" />
      </div>
    );
  }

  // Define stats based on role
  let stats: any[] = [];
  let recentBookings: any[] = [];

  if (role === "customer") {
    const bookings = bookingsData || [];
    const wishlist = wishlistData || [];
    const completedBookings = bookings.filter((b: any) => b.status === "completed");
    const pendingBookings = bookings.filter((b: any) => b.status === "pending");
    const totalSpent = completedBookings.reduce((sum: number, b: any) => sum + b.price, 0);

    stats = [
      {
        title: "Total Bookings",
        value: bookings.length,
        icon: Calendar,
        color: "text-primary bg-primary/10",
        desc: "All requested services"
      },
      {
        title: "Pending Bookings",
        value: pendingBookings.length,
        icon: Clock,
        color: "text-warning bg-warning/10",
        desc: "Awaiting provider response"
      },
      {
        title: "Saved Services",
        value: wishlist.length,
        icon: Heart,
        color: "text-error bg-error/10",
        desc: "In your wishlist"
      },
      {
        title: "Total Spent",
        value: `$${totalSpent.toLocaleString()}`,
        icon: DollarSign,
        color: "text-success bg-success/10",
        desc: "On completed bookings"
      }
    ];

    recentBookings = bookings.slice(0, 5);
  } else if (role === "provider") {
    const bookings = bookingsData || [];
    const services = servicesData || [];
    const completedBookings = bookings.filter((b: any) => b.status === "completed");
    const pendingBookings = bookings.filter((b: any) => b.status === "pending");
    const totalEarnings = completedBookings.reduce((sum: number, b: any) => sum + b.price, 0);

    stats = [
      {
        title: "My Services",
        value: services.length,
        icon: Layers,
        color: "text-primary bg-primary/10",
        desc: "Active & pending listings"
      },
      {
        title: "Total Bookings",
        value: bookings.length,
        icon: Calendar,
        color: "text-secondary bg-secondary/10",
        desc: "All received bookings"
      },
      {
        title: "Pending Bookings",
        value: pendingBookings.length,
        icon: Clock,
        color: "text-warning bg-warning/10",
        desc: "Action required"
      },
      {
        title: "Total Earnings",
        value: `$${totalEarnings.toLocaleString()}`,
        icon: DollarSign,
        color: "text-success bg-success/10",
        desc: "From completed jobs"
      }
    ];

    recentBookings = bookings.slice(0, 5);
  } else if (role === "admin" && adminAnalytics) {
    const { stats: adminStats, revenue } = adminAnalytics;
    stats = [
      {
        title: "Total Bookings",
        value: adminStats.totalBookings,
        icon: Calendar,
        color: "text-primary bg-primary/10",
        desc: "Across the platform"
      },
      {
        title: "Total Services",
        value: adminStats.totalServices,
        icon: Layers,
        color: "text-secondary bg-secondary/10",
        desc: "Created by providers"
      },
      {
        title: "Pending Approval",
        value: adminStats.pendingServices,
        icon: Clock,
        color: "text-warning bg-warning/10",
        desc: "Moderation queue"
      },
      {
        title: "Admin Earnings",
        value: `$${revenue.total.toLocaleString()}`,
        icon: DollarSign,
        color: "text-success bg-success/10",
        desc: "Last 30 days platform total"
      }
    ];
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "confirmed":
        return "bg-info/10 text-info border-info/20";
      case "completed":
        return "bg-success/10 text-success border-success/20";
      case "cancelled":
        return "bg-error/10 text-error border-error/20";
      default:
        return "bg-outline-variant text-on-surface/60";
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome & Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-outline-variant rounded-3xl p-6 sm:p-8">
        <div className="relative z-10 max-w-xl">
          <h1 className="text-2xl sm:text-3xl font-black text-on-surface font-display leading-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-on-surface/70 mt-2">
            Welcome back! Here is a summary of your activity and performance statistics on ServiceHub.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 bg-[radial-gradient(circle_at_center,_var(--color-primary)_0%,_transparent_100%)] hidden md:block" />
      </div>



      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="group bg-surface border border-outline-variant rounded-2xl p-5 shadow-xs flex flex-col gap-3 justify-between hover:shadow-md hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1 cursor-default"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-on-surface/60 uppercase tracking-wider">{card.title}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-on-surface font-display">{card.value}</h2>
                <p className="text-[11px] text-on-surface/40 mt-1 font-medium">{card.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Chart */}
      {role !== "admin" && (
        <div className="bg-surface border border-outline-variant rounded-2xl p-6 shadow-xs">
          <div className="mb-6">
            <h3 className="font-bold text-on-surface text-lg">Activity Trend</h3>
            <p className="text-xs text-on-surface/50 mt-1">Your recent booking activity over time</p>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={recentBookings.map((b: any, index: number) => ({ name: `Day ${index + 1}`, value: b.price })).reverse()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-on-surface)', opacity: 0.5 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-on-surface)', opacity: 0.5 }} dx={-10} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  cursor={{ stroke: 'var(--color-outline-variant)', strokeWidth: 1, strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-outline-variant)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
                <Line type="monotone" dataKey="value" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: 'var(--color-surface)' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Bookings or Actions (Only for Customer & Provider) */}
      {role !== "admin" && (
        <div className="bg-surface border border-outline-variant rounded-2xl overflow-hidden shadow-xs">
          <div className="px-6 py-5 border-b border-outline-variant flex justify-between items-center">
            <div>
              <h3 className="font-bold text-on-surface text-base">Recent Bookings</h3>
              <p className="text-xs text-on-surface/50 mt-0.5">Your 5 most recent booking requests</p>
            </div>
            <button
              onClick={() => onNavigate("bookings")}
              className="text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              View All Bookings
            </button>
          </div>

          {recentBookings.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface/40">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-on-surface text-sm">No Bookings Yet</h4>
                <p className="text-xs text-on-surface/50 mt-1 max-w-[280px]">
                  {role === "customer" 
                    ? "Book a local service provider to start managing your requests here." 
                    : "Your services haven't been booked yet. Promote your listings!"
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container/30 text-xs font-bold text-on-surface/60">
                    <th className="px-6 py-3.5">Service</th>
                    <th className="px-6 py-3.5">Date & Time</th>
                    <th className="px-6 py-3.5">{role === "customer" ? "Provider" : "Customer"}</th>
                    <th className="px-6 py-3.5">Amount</th>
                    <th className="px-6 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant text-sm">
                  {recentBookings.map((booking: any) => (
                    <tr key={booking._id} className="hover:bg-surface-container/20 transition-colors">
                      <td className="px-6 py-4 font-semibold text-on-surface">
                        {booking.serviceId?.title || "Deleted Service"}
                      </td>
                      <td className="px-6 py-4 text-on-surface/80">
                        <div>{new Date(booking.date).toLocaleDateString()}</div>
                        <div className="text-xs text-on-surface/50 mt-0.5">{booking.timeSlot}</div>
                      </td>
                      <td className="px-6 py-4 text-on-surface/80">
                        {role === "customer" 
                          ? booking.provider?.name || "Unknown Provider"
                          : booking.customer?.name || "Unknown Customer"
                        }
                      </td>
                      <td className="px-6 py-4 font-bold text-on-surface">
                        ${booking.price}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Admin Quick Links */}
      {role === "admin" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface border border-outline-variant rounded-2xl p-6 flex flex-col justify-between gap-4">
            <div>
              <h3 className="font-bold text-on-surface text-base">Service Moderation</h3>
              <p className="text-xs text-on-surface/50 mt-1">
                Approve or reject new service listings submitted by providers before they go public.
              </p>
            </div>
            <button
              onClick={() => onNavigate("services")}
              className="px-4 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/95 transition-colors self-start cursor-pointer"
            >
              Manage Services
            </button>
          </div>

          <div className="bg-surface border border-outline-variant rounded-2xl p-6 flex flex-col justify-between gap-4">
            <div>
              <h3 className="font-bold text-on-surface text-base">User Management</h3>
              <p className="text-xs text-on-surface/50 mt-1">
                Monitor and moderate platform users. Ban or restrict accounts violating platform policies.
              </p>
            </div>
            <button
              onClick={() => onNavigate("users")}
              className="px-4 py-2.5 rounded-xl bg-error/10 text-error text-xs font-bold hover:bg-error/15 transition-colors self-start cursor-pointer"
            >
              Manage Users
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
