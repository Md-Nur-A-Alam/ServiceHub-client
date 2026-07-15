"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Calendar, User, UserCheck, CreditCard } from "lucide-react";

export default function AuditBookingPage() {
  const [page, setPage] = useState(1);

  const { data: bookingResponse, isLoading, isError } = useQuery({
    queryKey: ["admin-audit-bookings", page],
    queryFn: async () => {
      const response = await apiClient.get("/admin/bookings", {
        params: { page, limit: 15 },
      });
      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-surface-container rounded-xl border border-outline-variant" />
        ))}
      </div>
    );
  }

  if (isError || !bookingResponse) {
    return (
      <div className="p-8 text-center bg-surface border border-outline-variant rounded-2xl">
        <p className="text-on-surface/70">Failed to load booking audit logs.</p>
      </div>
    );
  }

  const { items: bookings = [], totalPages = 1 } = bookingResponse;

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success/15 text-success border-success/20";
      case "pending":
        return "bg-primary/10 text-primary border-primary/20";
      case "cancelled":
        return "bg-error/15 text-error border-error/20";
      default:
        return "bg-surface-container text-on-surface/70 border-outline-variant";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-on-surface/80" />
        <h1 className="text-xl font-bold text-on-surface font-display">Booking Audit</h1>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-surface border border-outline-variant rounded-2xl">
          <Calendar className="w-12 h-12 text-on-surface/20 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-on-surface mb-1">No Bookings Found</h3>
          <p className="text-sm text-on-surface/50">There are no transactions recorded in the system yet.</p>
        </div>
      ) : (
        <>
          <div className="bg-surface border border-outline-variant rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-surface-container/40 border-b border-outline-variant text-xs text-on-surface/60 font-semibold uppercase tracking-wider">
                    <th className="px-6 py-4">Transaction Details</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Provider</th>
                    <th className="px-6 py-4">Status & Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/60 text-sm">
                  {bookings.map((booking: any) => (
                    <tr key={booking.id} className="hover:bg-surface-container/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className="font-bold text-on-surface block text-base truncate max-w-[200px]" title={booking.serviceTitle}>
                            {booking.serviceTitle}
                          </span>
                          <span className="text-xs font-semibold text-on-surface/70 block flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" />
                            {new Date(booking.date).toLocaleDateString()} at {booking.timeSlot}
                          </span>
                          <span className="font-mono text-[10px] text-on-surface/40 block mt-1">
                            ID: {booking.id}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                            {booking.customer?.name?.charAt(0) || <User className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <span className="font-bold text-on-surface text-sm block truncate max-w-[150px]">{booking.customer?.name || "Unknown"}</span>
                            <span className="text-[10px] text-on-surface/50 block truncate max-w-[150px]">{booking.customer?.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-xs shrink-0">
                            {booking.provider?.name?.charAt(0) || <UserCheck className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <span className="font-bold text-on-surface text-sm block truncate max-w-[150px]">{booking.provider?.name || "Unknown"}</span>
                            <span className="text-[10px] text-on-surface/50 block truncate max-w-[150px]">{booking.provider?.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-start gap-2">
                          <span className={`px-2.5 py-1 rounded-md border text-[10px] font-bold tracking-wider uppercase ${getStatusStyles(booking.status)}`}>
                            {booking.status}
                          </span>
                          <span className="font-black text-on-surface font-display flex items-center gap-1">
                            <CreditCard className="w-3.5 h-3.5 text-on-surface/60" />
                            ${booking.price}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-surface border border-outline-variant text-xs font-bold rounded-xl hover:bg-surface-container transition-colors disabled:opacity-40 cursor-pointer text-on-surface shadow-xs"
              >
                Previous Page
              </button>
              <span className="text-xs text-on-surface/60 font-semibold px-4 py-2 bg-surface-container-low rounded-xl border border-outline-variant">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-surface border border-outline-variant text-xs font-bold rounded-xl hover:bg-surface-container transition-colors disabled:opacity-40 cursor-pointer text-on-surface shadow-xs"
              >
                Next Page
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
