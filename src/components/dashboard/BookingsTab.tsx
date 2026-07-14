"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { ReviewForm } from "@/components/forms/ReviewForm";
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  FileText, 
  MessageSquare,
  X
} from "lucide-react";
import { toast } from "react-toastify";

interface BookingsTabProps {
  role: string;
}

export function BookingsTab({ role }: BookingsTabProps) {
  const queryClient = useQueryClient();
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<any>(null);

  // Fetch bookings
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: async () => {
      const response = await apiClient.get("/bookings");
      return response.data.data || [];
    }
  });

  // Booking status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiClient.patch(`/bookings/${id}`, { status });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Booking status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || "Failed to update booking status");
    }
  });

  const getStatusBadge = (status: string) => {
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

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div>
          <div className="h-8 w-48 bg-surface-container rounded-lg mb-2"></div>
          <div className="h-4 w-72 bg-surface-container rounded-lg"></div>
        </div>
        <div className="bg-surface border border-outline-variant rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-outline-variant bg-surface-container/30">
            <div className="h-6 w-1/3 bg-surface-container-high rounded-lg"></div>
          </div>
          <div className="divide-y divide-outline-variant">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-6 flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-5 w-40 bg-surface-container-high rounded-md"></div>
                  <div className="h-4 w-24 bg-surface-container-high rounded-md"></div>
                </div>
                <div className="h-8 w-24 bg-surface-container-high rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-on-surface font-display">
          Manage Bookings
        </h2>
        <p className="text-xs text-on-surface/50 mt-0.5">
          {role === "customer"
            ? "Track and manage your service requests"
            : "Respond to customer booking requests and manage job lifecycle"
          }
        </p>
      </div>

      {/* Review Modal Form */}
      {selectedBookingForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg">
            <button
              onClick={() => setSelectedBookingForReview(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-surface-container hover:bg-surface-container-high rounded-full flex items-center justify-center text-on-surface/75 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <ReviewForm
              serviceId={selectedBookingForReview.serviceId._id || selectedBookingForReview.serviceId.id || selectedBookingForReview.serviceId}
              bookingId={selectedBookingForReview._id}
              onSuccess={() => setSelectedBookingForReview(null)}
            />
          </div>
        </div>
      )}

      {/* Bookings List */}
      <div className="bg-surface border border-outline-variant rounded-2xl overflow-hidden shadow-xs">
        {bookings.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface/40">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-on-surface text-sm">No Bookings Found</h4>
              <p className="text-xs text-on-surface/50 mt-1 max-w-[280px]">
                {role === "customer"
                  ? "You have not placed any service bookings yet."
                  : "You have not received any service bookings yet."
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container/30 text-xs font-bold text-on-surface/60">
                  <th className="px-6 py-3.5">Service Details</th>
                  <th className="px-6 py-3.5">Date & Time</th>
                  <th className="px-6 py-3.5">{role === "customer" ? "Provider" : "Customer"}</th>
                  <th className="px-6 py-3.5">Price</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant text-sm">
                {bookings.map((booking: any) => {
                  const customerName = booking.customer?.name || "Unknown Customer";
                  const providerName = booking.provider?.name || "Unknown Provider";
                  const serviceTitle = booking.serviceId?.title || "Deleted Service";
                  const category = booking.serviceId?.category || "";

                  return (
                    <tr key={booking._id} className="hover:bg-surface-container/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-on-surface">{serviceTitle}</div>
                        {category && (
                          <div className="text-xs text-on-surface/40 mt-0.5 capitalize">{category}</div>
                        )}
                        {booking.notes && (
                          <div className="text-xs bg-surface-container/50 border border-outline-variant p-2 rounded-lg text-on-surface/70 mt-2 max-w-[220px] italic">
                            "{booking.notes}"
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-on-surface/80">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-on-surface/40" />
                          <span>{new Date(booking.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-on-surface/50 mt-1">
                          <Clock className="w-3.5 h-3.5 text-on-surface/40" />
                          <span>{booking.timeSlot}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-on-surface/85">
                          {role === "customer" ? providerName : customerName}
                        </div>
                        <div className="text-xs text-on-surface/40 mt-0.5">
                          {role === "customer" ? booking.provider?.email : booking.customer?.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-on-surface">${booking.price}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-2">
                          {/* Provider actions */}
                          {role === "provider" && booking.status === "pending" && (
                            <>
                              <button
                                onClick={() => updateStatusMutation.mutate({ id: booking._id, status: "confirmed" })}
                                disabled={updateStatusMutation.isPending}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-success/15 hover:bg-success/20 text-success text-xs font-bold cursor-pointer transition-colors"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Confirm</span>
                              </button>
                              <button
                                onClick={() => updateStatusMutation.mutate({ id: booking._id, status: "cancelled" })}
                                disabled={updateStatusMutation.isPending}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-error/15 hover:bg-error/20 text-error text-xs font-bold cursor-pointer transition-colors"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Decline</span>
                              </button>
                            </>
                          )}

                          {role === "provider" && booking.status === "confirmed" && (
                            <>
                              <button
                                onClick={() => updateStatusMutation.mutate({ id: booking._id, status: "completed" })}
                                disabled={updateStatusMutation.isPending}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-success text-on-success text-xs font-bold cursor-pointer transition-colors"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Complete Job</span>
                              </button>
                              <button
                                onClick={() => updateStatusMutation.mutate({ id: booking._id, status: "cancelled" })}
                                disabled={updateStatusMutation.isPending}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-error/15 hover:bg-error/20 text-error text-xs font-bold cursor-pointer transition-colors"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Cancel</span>
                              </button>
                            </>
                          )}

                          {/* Customer Actions */}
                          {role === "customer" && (booking.status === "pending" || booking.status === "confirmed") && (
                            <button
                              onClick={() => updateStatusMutation.mutate({ id: booking._id, status: "cancelled" })}
                              disabled={updateStatusMutation.isPending}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-error/15 hover:bg-error/20 text-error text-xs font-bold cursor-pointer transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Cancel</span>
                            </button>
                          )}

                          {role === "customer" && booking.status === "completed" && (
                            <button
                              onClick={() => setSelectedBookingForReview(booking)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary text-on-secondary text-xs font-bold cursor-pointer transition-colors"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Review Service</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
