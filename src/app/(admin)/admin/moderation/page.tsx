"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Check, X, ShieldAlert, Layers } from "lucide-react";
import { toast } from "react-toastify";

export default function ModerationPage() {
  const queryClient = useQueryClient();

  const { data: services = [], isLoading, isError } = useQuery({
    queryKey: ["admin-services"],
    queryFn: async () => {
      const response = await apiClient.get("/admin/services");
      return response.data.data;
    },
  });

  const moderateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "approved" | "rejected" }) => {
      const response = await apiClient.patch(`/admin/services/${id}/status`, { status });
      return response.data.data;
    },
    onSuccess: (data) => {
      toast.success(`Service is now ${data.status}`);
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      // Invalidate normal explore queries too
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error?.message || "Failed to update service status.");
    },
  });

  const handleStatusUpdate = (id: string, status: "approved" | "rejected") => {
    moderateMutation.mutate({ id, status });
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-surface-container rounded-xl border border-outline-variant" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center bg-surface border border-outline-variant rounded-2xl">
        <p className="text-on-surface/70">Failed to load moderation queue.</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="px-2 py-0.5 rounded-full bg-warning/15 text-warning text-2xs font-bold uppercase">Pending</span>;
      case "approved":
        return <span className="px-2 py-0.5 rounded-full bg-success/15 text-success text-2xs font-bold uppercase">Approved</span>;
      case "rejected":
        return <span className="px-2 py-0.5 rounded-full bg-error/15 text-error text-2xs font-bold uppercase">Rejected</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-outline-variant text-on-surface/50 text-2xs font-bold uppercase">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ShieldAlert className="w-5 h-5 text-error" />
        <h1 className="text-xl font-bold text-on-surface font-display">Service Moderation</h1>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-20 bg-surface border border-outline-variant rounded-2xl">
          <Layers className="w-12 h-12 text-on-surface/20 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-on-surface mb-1">No services registered</h3>
          <p className="text-sm text-on-surface/50">There are no services created on the platform yet.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View (lg+) */}
          <div className="hidden lg:block bg-surface border border-outline-variant rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container/40 border-b border-outline-variant text-xs text-on-surface/60 font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Provider</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60 text-sm">
                {services.map((s: any) => (
                  <tr key={s._id} className="hover:bg-surface-container/20 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <span className="text-3xl shrink-0">{s.imageEmoji || "🛠️"}</span>
                      <div className="min-w-0">
                        <span className="font-bold text-on-surface block truncate max-w-xs">{s.title}</span>
                        <span className="text-xs text-on-surface/40 block truncate max-w-xs">{s.shortDesc}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize text-on-surface/80">{s.category}</td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-semibold text-on-surface block">{s.provider?.name || "Unknown"}</span>
                        <span className="text-xs text-on-surface/40 block">{s.provider?.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-on-surface">${s.price}</td>
                    <td className="px-6 py-4">{getStatusBadge(s.status)}</td>
                    <td className="px-6 py-4 text-right">
                      {s.status === "pending" && (
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => handleStatusUpdate(s._id, "rejected")}
                            disabled={moderateMutation.isPending}
                            className="p-1.5 border border-error/50 rounded-lg text-error hover:bg-error/5 transition-colors cursor-pointer"
                            title="Reject service"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(s._id, "approved")}
                            disabled={moderateMutation.isPending}
                            className="p-1.5 bg-primary text-on-primary rounded-lg hover:brightness-110 transition-all cursor-pointer"
                            title="Approve service"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Card View (<lg) */}
          <div className="lg:hidden flex flex-col gap-4">
            {services.map((s: any) => (
              <div
                key={s._id}
                className="bg-surface border border-outline-variant rounded-2xl p-4 flex flex-col gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="text-4xl shrink-0">{s.imageEmoji || "🛠️"}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-on-surface text-sm truncate">{s.title}</h3>
                      {getStatusBadge(s.status)}
                    </div>
                    <span className="text-xs text-on-surface/40 capitalize">{s.category} • ${s.price}</span>
                  </div>
                </div>

                <div className="border-t border-outline-variant/60 pt-2 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-on-surface/50">Provider:</span>
                    <strong className="text-on-surface ml-1">{s.provider?.name || "Unknown"}</strong>
                  </div>
                  <span className="text-[10px] text-on-surface/40">{new Date(s.createdAt).toLocaleDateString()}</span>
                </div>

                {s.status === "pending" && (
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button
                      onClick={() => handleStatusUpdate(s._id, "rejected")}
                      disabled={moderateMutation.isPending}
                      className="py-2 border border-error text-error text-xs font-semibold rounded-lg hover:bg-error/5 transition-colors cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(s._id, "approved")}
                      disabled={moderateMutation.isPending}
                      className="py-2 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:brightness-110 transition-all cursor-pointer"
                    >
                      Approve
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
