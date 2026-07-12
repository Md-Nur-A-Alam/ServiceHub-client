"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { Search, SlidersHorizontal, ArrowUpRight, Loader2, Sparkles, AlertCircle } from "lucide-react";
import Link from "next/link";

interface ServiceItem {
  id: string;
  title: string;
  category: string;
  price: number;
  status: "pending" | "approved" | "rejected";
  imageEmoji: string;
  ratingAvg: number;
  ratingCount: number;
}

export default function ManageServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "approved" | "pending">("all");

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await apiClient.get("/services/me");
        if (res.data?.success) {
          setServices(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load provider services:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const filtered = services.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) || 
                          s.category.toLowerCase().includes(search.toLowerCase());
    
    if (tab === "all") return matchesSearch;
    if (tab === "approved") return matchesSearch && s.status === "approved";
    if (tab === "pending") return matchesSearch && s.status === "pending";
    return matchesSearch;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Overview Intro */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-on-surface font-display tracking-tight">Service Inventory</h1>
          <p className="text-xs text-on-surface/65">
            Manage your professional offerings, monitor moderation status, and track pricing.
          </p>
        </div>

        <Link
          href="/items/add"
          className="px-4 py-2 bg-primary text-on-primary font-bold text-xs rounded-xl shadow-xs hover:brightness-110 transition-all shrink-0 text-center"
        >
          + Add New Service
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-surface border border-outline-variant rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-on-surface/40" />
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-container/30 border border-outline-variant rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 border border-outline-variant rounded-xl bg-surface-container/20 shrink-0 self-start md:self-auto">
          <button
            onClick={() => setTab("all")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              tab === "all" ? "bg-surface text-primary shadow-xs" : "text-on-surface/75 hover:bg-surface-container/40"
            }`}
          >
            All Services ({services.length})
          </button>
          <button
            onClick={() => setTab("approved")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              tab === "approved" ? "bg-surface text-success shadow-xs" : "text-on-surface/75 hover:bg-surface-container/40"
            }`}
          >
            Approved ({services.filter((s) => s.status === "approved").length})
          </button>
          <button
            onClick={() => setTab("pending")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              tab === "pending" ? "bg-surface text-warning shadow-xs" : "text-on-surface/75 hover:bg-surface-container/40"
            }`}
          >
            Pending ({services.filter((s) => s.status === "pending").length})
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-surface border border-outline-variant rounded-2xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="text-xs text-on-surface/60 font-semibold">Loading your catalog...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-on-surface/40" />
            </div>
            <div>
              <span className="font-bold text-sm text-on-surface block">No Services Found</span>
              <span className="text-xs text-on-surface/60 mt-1 block">
                {search ? "No services match your active search terms." : "You haven't listed any services yet."}
              </span>
            </div>
            {!search && (
              <Link
                href="/items/add"
                className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold rounded-xl transition-colors mt-2"
              >
                Create First Service
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container/30 text-[10px] font-bold text-on-surface/60 uppercase tracking-wider">
                  <th className="px-6 py-4">Thumbnail</th>
                  <th className="px-6 py-4">Service Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/65">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container/10 transition-colors text-xs text-on-surface">
                    {/* Thumbnail */}
                    <td className="px-6 py-4">
                      <div className="w-11 h-11 rounded-lg bg-surface-container overflow-hidden flex items-center justify-center border border-outline-variant shrink-0">
                        {item.imageEmoji.startsWith("http") ? (
                          <img src={item.imageEmoji} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl">{item.imageEmoji || "🛠️"}</span>
                        )}
                      </div>
                    </td>

                    {/* Title */}
                    <td className="px-6 py-4 font-bold text-on-surface">
                      <div className="max-w-[200px] sm:max-w-xs truncate leading-snug">
                        {item.title}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                        {item.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 font-bold text-on-surface">
                      ${item.price}/hr
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {item.status === "approved" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-bold uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-success" />
                          <span>Approved</span>
                        </span>
                      )}
                      {item.status === "pending" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-warning/10 text-warning text-[10px] font-bold uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
                          <span>Pending</span>
                        </span>
                      )}
                      {item.status === "rejected" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-error/10 text-error text-[10px] font-bold uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-error" />
                          <span>Rejected</span>
                        </span>
                      )}
                    </td>

                    {/* Rating */}
                    <td className="px-6 py-4 text-on-surface/70">
                      {item.ratingCount > 0 ? (
                        <span className="font-semibold">
                          ⭐ {item.ratingAvg.toFixed(1)} ({item.ratingCount})
                        </span>
                      ) : (
                        <span className="text-[10px] text-on-surface/40">No Ratings</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/services/${item.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface border border-outline-variant hover:border-primary/50 text-[10px] font-bold text-on-surface transition-colors cursor-pointer"
                      >
                        <span>View</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
