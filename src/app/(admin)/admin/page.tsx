"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { AnalyticsCharts } from "@/components/admin/AnalyticsCharts";
import { Calendar, Layers, Users, ShieldAlert, TrendingUp } from "lucide-react";

export default function AdminDashboardPage() {
  const { data: analytics, isLoading, isError } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const response = await apiClient.get("/admin/analytics");
      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        {/* Stats placeholder */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-surface-container rounded-2xl border border-outline-variant" />
          ))}
        </div>
        {/* Charts placeholder */}
        <div className="h-96 bg-surface-container rounded-2xl border border-outline-variant" />
      </div>
    );
  }

  if (isError || !analytics) {
    return (
      <div className="p-8 text-center bg-surface border border-outline-variant rounded-2xl">
        <p className="text-on-surface/70">Failed to load analytics dashboard. Please try again later.</p>
      </div>
    );
  }

  const { stats, bookingsPerDay, categoryBreakdown, revenue } = analytics;

  const statCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: Calendar,
      colorClass: "bg-primary/10 text-primary",
      desc: "All time bookings",
    },
    {
      title: "Active Services",
      value: stats.totalServices,
      icon: Layers,
      colorClass: "bg-secondary/10 text-secondary",
      desc: "Services on platform",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      colorClass: "bg-tertiary/10 text-tertiary",
      desc: "Registered accounts",
    },
    {
      title: "Pending Approval",
      value: stats.pendingServices,
      icon: ShieldAlert,
      colorClass: "bg-error/10 text-error",
      desc: "Services in moderation",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Revenue callout card */}
      <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-xs text-on-surface/50 uppercase tracking-wider font-semibold">Last 30 Days Revenue</span>
          <h1 className="text-3xl font-black text-on-surface mt-1">${revenue.total.toLocaleString()}</h1>
        </div>
        <div className="flex items-center gap-2 bg-success/15 px-3 py-1.5 rounded-xl text-success font-semibold text-xs shrink-0 self-start sm:self-center">
          <TrendingUp className="w-4 h-4" />
          <span>{revenue.trend >= 0 ? `+${revenue.trend}%` : `${revenue.trend}%`} vs previous period</span>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-surface border border-outline-variant rounded-2xl p-5 shadow-xs flex flex-col gap-2 justify-between"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-on-surface/60 line-clamp-1">{card.title}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${card.colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-black text-on-surface font-display">{card.value}</h2>
                <p className="text-[10px] text-on-surface/40 mt-0.5">{card.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <AnalyticsCharts bookingsPerDay={bookingsPerDay} categoryBreakdown={categoryBreakdown} />
    </div>
  );
}
