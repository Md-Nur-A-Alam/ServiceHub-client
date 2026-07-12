"use client";

import { useState } from "react";
import { useBookings, useUpdateBookingStatus } from "@/hooks/useBooking";
import { Container } from "@/components/layout/Container";
import { authClient } from "@/lib/auth-client";
import { Calendar, Clock, User, ShieldCheck, Tag, DollarSign, X, Check, CheckCircle2, MessageSquare } from "lucide-react";
import Link from "next/link";
import { ReviewForm } from "@/components/forms/ReviewForm";

export default function BookingsPage() {
  const { data: session } = authClient.useSession();
  const { data: bookings = [], isLoading, isError } = useBookings();
  const updateStatus = useUpdateBookingStatus();
  const [activeReviewBooking, setActiveReviewBooking] = useState<{ serviceId: string; bookingId: string } | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="px-2.5 py-1 rounded-full bg-warning/15 text-warning text-xs font-semibold">Pending</span>;
      case "confirmed":
        return <span className="px-2.5 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold">Confirmed</span>;
      case "completed":
        return <span className="px-2.5 py-1 rounded-full bg-success/15 text-success text-xs font-semibold">Completed</span>;
      case "cancelled":
        return <span className="px-2.5 py-1 rounded-full bg-error/15 text-error text-xs font-semibold">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-outline-variant text-on-surface/50 text-xs font-semibold">{status}</span>;
    }
  };

  const handleStatusUpdate = (id: string, status: string) => {
    if (confirm(`Are you sure you want to mark this booking as ${status}?`)) {
      updateStatus.mutate({ id, status });
    }
  };

  return (
    <div className="bg-background min-h-screen py-8">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-on-surface font-display">My Bookings</h1>
            <p className="text-sm text-on-surface/60">
              {session?.user?.role === "provider"
                ? "Manage reservations against your services"
                : "Manage your upcoming and past service appointments"}
            </p>
          </div>
          <Link
            href="/explore"
            className="px-5 py-2.5 bg-primary/10 text-primary font-semibold rounded-xl hover:bg-primary/20 transition-colors text-sm text-center"
          >
            Explore Services
          </Link>
        </div>

        {isError ? (
          <div className="p-8 text-center bg-surface border border-outline-variant rounded-2xl">
            <p className="text-on-surface/70">Failed to load bookings. Please try again later.</p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-surface-container animate-pulse rounded-2xl border border-outline-variant" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 bg-surface border border-outline-variant rounded-2xl flex flex-col items-center justify-center">
            <Calendar className="w-12 h-12 text-on-surface/20 mb-4" />
            <h3 className="text-lg font-bold text-on-surface mb-2">No bookings found</h3>
            <p className="text-on-surface/65 max-w-sm mb-6">
              {session?.user?.role === "provider"
                ? "You haven't received any bookings yet. Make sure your services are approved."
                : "You don't have any booked appointments. Go ahead and reserve a service slot!"}
            </p>
            {session?.user?.role !== "provider" && (
              <Link
                href="/explore"
                className="px-6 py-2.5 bg-primary text-on-primary font-semibold rounded-xl hover:brightness-110 transition-all text-sm shadow-sm"
              >
                Find Services
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((booking: any) => {
              const service = booking.serviceId || {};
              const formattedDate = new Date(booking.date).toLocaleDateString(undefined, {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              return (
                <div
                  key={booking._id}
                  className="bg-surface border border-outline-variant rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-4"
                >
                  <div className="flex gap-4">
                    {/* Thumbnail Emoji placeholder */}
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-4xl shrink-0">
                      {service.imageEmoji || "🛠️"}
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-on-surface text-sm truncate leading-snug">
                          {service.title || "Deleted Service"}
                        </h3>
                        {getStatusBadge(booking.status)}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-on-surface/60">
                        <Tag className="w-3.5 h-3.5" />
                        <span className="capitalize">{service.category || "Service"}</span>
                      </div>

                      {session?.user?.role === "provider" ? (
                        <div className="flex items-center gap-1.5 text-xs text-on-surface/70">
                          <User className="w-3.5 h-3.5 text-primary" />
                          <span>Customer: <strong className="text-on-surface">{booking.customer?.name || "Unknown"}</strong></span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-on-surface/70">
                          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                          <span>Provider: <strong className="text-on-surface">{booking.provider?.name || "Unknown"}</strong></span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Booking date & details */}
                  <div className="grid grid-cols-2 gap-2 bg-surface-container rounded-xl p-3 text-xs text-on-surface/80">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span>{booking.timeSlot}</span>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="text-xs bg-surface-container/40 p-2.5 rounded-lg border border-outline-variant/50">
                      <span className="font-semibold text-on-surface/70 block mb-0.5">Notes:</span>
                      <p className="text-on-surface/85 italic break-words">"{booking.notes}"</p>
                    </div>
                  )}

                  {/* Pricing + Action Buttons */}
                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-outline-variant mt-auto">
                    <div>
                      <span className="text-xs text-on-surface/50 block">Amount</span>
                      <span className="text-lg font-black text-on-surface">${booking.price}</span>
                    </div>

                    <div className="flex gap-2">
                      {/* Customer Actions */}
                      {session?.user?.role === "customer" && booking.status === "pending" && (
                        <button
                          onClick={() => handleStatusUpdate(booking._id, "cancelled")}
                          className="px-4 py-2 border border-error text-error text-xs font-semibold rounded-lg hover:bg-error/5 transition-colors cursor-pointer"
                        >
                          Cancel Booking
                        </button>
                      )}

                      {session?.user?.role === "customer" && booking.status === "completed" && (
                        <button
                          onClick={() => setActiveReviewBooking({ serviceId: service._id || service, bookingId: booking._id })}
                          className="flex items-center gap-1.5 px-4 py-2 bg-secondary text-on-secondary text-xs font-semibold rounded-lg hover:brightness-110 transition-all cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Leave a Review</span>
                        </button>
                      )}

                      {/* Provider Actions */}
                      {session?.user?.role === "provider" && booking.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(booking._id, "cancelled")}
                            className="px-3 py-1.5 border border-outline-variant text-on-surface text-xs font-semibold rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(booking._id, "confirmed")}
                            className="flex items-center gap-1 px-3 py-1.5 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:brightness-110 transition-all cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Confirm</span>
                          </button>
                        </>
                      )}

                      {session?.user?.role === "provider" && booking.status === "confirmed" && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(booking._id, "cancelled")}
                            className="px-3 py-1.5 border border-error/50 text-error text-xs font-semibold rounded-lg hover:bg-error/5 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(booking._id, "completed")}
                            className="flex items-center gap-1 px-3 py-1.5 bg-success text-on-success text-xs font-semibold rounded-lg hover:brightness-110 transition-all cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark Completed</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal for reviews */}
        {activeReviewBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="relative max-w-md w-full bg-surface border border-outline-variant rounded-2xl shadow-2xl p-6">
              <button
                onClick={() => setActiveReviewBooking(null)}
                className="absolute top-4 right-4 text-on-surface/50 hover:text-on-surface cursor-pointer w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container"
              >
                <X className="w-4 h-4" />
              </button>
              <ReviewForm
                serviceId={activeReviewBooking.serviceId}
                bookingId={activeReviewBooking.bookingId}
                onSuccess={() => setActiveReviewBooking(null)}
              />
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
