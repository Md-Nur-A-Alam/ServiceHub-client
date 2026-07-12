"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { ScrollText, Calendar, ShieldAlert } from "lucide-react";

export default function AuditLogPage() {
  const [page, setPage] = useState(1);

  const { data: logResponse, isLoading, isError } = useQuery({
    queryKey: ["admin-audit-logs", page],
    queryFn: async () => {
      const response = await apiClient.get("/admin/audit-log", {
        params: { page, limit: 15 },
      });
      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 bg-surface-container rounded-xl border border-outline-variant" />
        ))}
      </div>
    );
  }

  if (isError || !logResponse) {
    return (
      <div className="p-8 text-center bg-surface border border-outline-variant rounded-2xl">
        <p className="text-on-surface/70">Failed to load audit logs.</p>
      </div>
    );
  }

  const { items: logs = [], totalPages = 1 } = logResponse;

  const getActionStyles = (action: string) => {
    if (action.includes("approve")) {
      return "bg-success/15 text-success border-success/20";
    }
    if (action.includes("reject") || action.includes("ban")) {
      return "bg-error/15 text-error border-error/20";
    }
    return "bg-primary/10 text-primary border-primary/20";
  };

  const formatActionName = (action: string) => {
    return action.replace("_", " ").toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ScrollText className="w-5 h-5 text-on-surface/80" />
        <h1 className="text-xl font-bold text-on-surface font-display">System Audit Logs</h1>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-20 bg-surface border border-outline-variant rounded-2xl">
          <ScrollText className="w-12 h-12 text-on-surface/20 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-on-surface mb-1">No log entries</h3>
          <p className="text-sm text-on-surface/50">No administrative actions have been captured yet.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View (lg+) */}
          <div className="hidden lg:block bg-surface border border-outline-variant rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container/40 border-b border-outline-variant text-xs text-on-surface/60 font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Administrator</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Target Type</th>
                  <th className="px-6 py-4">Target ID</th>
                  <th className="px-6 py-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60 text-sm">
                {logs.map((log: any) => (
                  <tr key={log._id} className="hover:bg-surface-container/20 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-bold text-on-surface block">{log.admin?.name || "System"}</span>
                        <span className="text-xs text-on-surface/40 block">{log.admin?.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold tracking-wider ${getActionStyles(log.action)}`}>
                        {formatActionName(log.action)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-on-surface/85 capitalize">{log.targetType}</td>
                    <td className="px-6 py-4 font-mono text-xs text-on-surface/50">{log.targetId}</td>
                    <td className="px-6 py-4 text-on-surface/70">
                      {new Date(log.timestamp).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Chronological Timeline View (<lg) */}
          <div className="lg:hidden flex flex-col pl-4 border-l-2 border-outline-variant/70 gap-6 mt-4 ml-2">
            {logs.map((log: any) => (
              <div key={log._id} className="relative">
                {/* Timeline Dot */}
                <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-background" />

                <div className="bg-surface border border-outline-variant rounded-2xl p-4 space-y-2.5 shadow-xs">
                  <div className="flex justify-between items-start gap-2">
                    <span className={`px-2 py-0.5 rounded-full border text-[9px] font-semibold tracking-wider ${getActionStyles(log.action)}`}>
                      {formatActionName(log.action)}
                    </span>
                    <span className="text-[10px] text-on-surface/40">
                      {new Date(log.timestamp).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                    </span>
                  </div>

                  <div className="text-xs text-on-surface/80 space-y-1">
                    <p>
                      Admin: <strong className="text-on-surface">{log.admin?.name || "System"}</strong>
                    </p>
                    <p>
                      Target: <span className="font-semibold">{log.targetType}</span> (
                      <span className="font-mono text-[10px] text-on-surface/50">{log.targetId}</span>)
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-outline-variant">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-outline-variant text-xs font-semibold rounded-lg hover:bg-surface-container transition-colors disabled:opacity-40 cursor-pointer text-on-surface"
              >
                Previous
              </button>
              <span className="text-xs text-on-surface/60 font-semibold">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-outline-variant text-xs font-semibold rounded-lg hover:bg-surface-container transition-colors disabled:opacity-40 cursor-pointer text-on-surface"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
