"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";
import confetti from "canvas-confetti";
import { apiClient } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import { useCreateBooking } from "@/hooks/useBooking";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutForm } from "./CheckoutForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);


interface BookingCardProps {
  serviceId: string;
  price: number;
}

const AVAILABLE_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

export function BookingCard({ serviceId, price }: BookingCardProps) {
  const { data: session } = authClient.useSession();
  const createBooking = useCreateBooking();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const [date, setDate] = useState(tomorrowStr);
  const [timeSlot, setTimeSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState<"select" | "confirm" | "payment" | "success">("select");
  const [clientSecret, setClientSecret] = useState("");
  const [isGettingIntent, setIsGettingIntent] = useState(false);

  // Fetch taken slots for service & selected date
  const { data: takenSlots = [], isLoading: isLoadingSlots } = useQuery({
    queryKey: ["taken-slots", serviceId, date],
    queryFn: async () => {
      const res = await apiClient.get(`/bookings/taken-slots`, {
        params: { serviceId, date },
      });
      return res.data.data as string[];
    },
    enabled: !!date && !!serviceId,
  });

  const handleNextStep = () => {
    if (!session) {
      toast.info("Please log in to book a service.");
      return;
    }
    if (session.user.role !== "customer") {
      toast.warn("Only customer accounts can book services.");
      return;
    }
    if (!date) {
      toast.error("Please select a date.");
      return;
    }
    if (!timeSlot) {
      toast.error("Please select a time slot.");
      return;
    }
    setStep("confirm");
  };

  const handleProceedToPayment = async () => {
    try {
      setIsGettingIntent(true);
      const res = await apiClient.post("/payments/create-intent", { 
        serviceId,
        date,
        timeSlot,
        notes 
      });
      if (res.data?.success && res.data?.clientSecret) {
        setClientSecret(res.data.clientSecret);
        setStep("payment");
      } else {
        toast.error("Failed to initialize payment");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to initialize payment");
    } finally {
      setIsGettingIntent(false);
    }
  };

  const handleBook = () => {
    // The actual booking is now created via Stripe Webhooks securely on the backend.
    setStep("success");
  };

  // Run confetti only ONCE when entering success step
  useEffect(() => {
    if (step === "success") {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  }, [step]);

  if (step === "success") {
    return (
      <div className="bg-surface border border-outline-variant rounded-2xl p-6 text-center shadow-lg flex flex-col items-center gap-4 max-w-sm w-full mx-auto">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center text-success mb-2">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-on-surface font-display">Booking Requested!</h3>
        <p className="text-sm text-on-surface/70 leading-relaxed">
          Your booking on <strong className="text-on-surface">{new Date(date).toLocaleDateString()}</strong> at <strong className="text-on-surface">{timeSlot}</strong> has been sent to the provider for confirmation.
        </p>

        <div className="w-full border-t border-b border-outline-variant py-3 my-2 text-left text-xs space-y-1.5 text-on-surface/75">
          <div className="flex justify-between">
            <span>Price:</span>
            <span className="font-bold text-on-surface">${price}</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="px-2 py-0.5 rounded-full bg-warning/15 text-warning font-semibold text-[10px]">
              Pending Approval
            </span>
          </div>
        </div>

        <Link
          href="/bookings"
          className="w-full py-2.5 bg-primary text-on-primary font-semibold rounded-xl hover:brightness-110 transition-all text-sm inline-block"
        >
          View My Bookings
        </Link>
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div className="bg-surface border border-outline-variant rounded-2xl p-6 shadow-lg max-w-sm w-full mx-auto flex flex-col gap-4">
        <h3 className="text-lg font-bold text-on-surface font-display">Confirm Booking</h3>

        <div className="bg-surface-container rounded-xl p-4 text-sm space-y-3">
          <div className="flex items-center gap-2 text-on-surface/75">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{new Date(date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-on-surface/75">
            <Clock className="w-4 h-4 text-primary" />
            <span>{timeSlot}</span>
          </div>
          <div className="border-t border-outline-variant pt-2 flex justify-between font-bold text-on-surface">
            <span>Total Price:</span>
            <span>${price}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="booking-notes" className="text-xs font-semibold text-on-surface/70">
            Notes / Instructions (Optional)
          </label>
          <textarea
            id="booking-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Specify any special requests for the service provider..."
            className="w-full p-3 rounded-lg border border-outline-variant bg-surface text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary h-20 resize-none"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setStep("select")}
            className="flex-1 py-2.5 border border-outline-variant rounded-xl hover:bg-surface-container transition-colors text-sm font-semibold cursor-pointer text-on-surface"
          >
            Back
          </button>
          <button
            onClick={handleProceedToPayment}
            disabled={isGettingIntent}
            className="flex-1 py-2.5 bg-primary text-on-primary rounded-xl font-semibold hover:brightness-110 transition-all text-sm cursor-pointer disabled:opacity-50"
          >
            {isGettingIntent ? "Please wait..." : "Proceed to Payment"}
          </button>
        </div>
      </div>
    );
  }

  if (step === "payment" && clientSecret) {
    return (
      <div className="bg-surface border border-outline-variant rounded-2xl p-6 shadow-lg max-w-sm w-full mx-auto flex flex-col gap-4">
        <h3 className="text-lg font-bold text-on-surface font-display">Complete Payment</h3>
        <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
          <CheckoutForm 
            onSuccess={handleBook} 
            onCancel={() => setStep("confirm")} 
            isProcessingOverride={createBooking.isPending} 
          />
        </Elements>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-outline-variant rounded-2xl p-6 shadow-lg max-w-sm w-full mx-auto flex flex-col gap-5">
      <div>
        <h3 className="text-lg font-bold text-on-surface font-display mb-1">Book this Service</h3>
        <p className="text-xs text-on-surface/60">Choose date and select a slot</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="booking-date" className="text-xs font-semibold text-on-surface/70">
          Select Date
        </label>
        <input
          id="booking-date"
          type="date"
          min={tomorrowStr}
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setTimeSlot(""); // Reset slot when date changes
          }}
          className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-on-surface/70">Select Time Slot</span>
        {isLoadingSlots ? (
          <div className="grid grid-cols-3 gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-9 rounded-lg bg-surface-container animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {AVAILABLE_SLOTS.map((slot) => {
              const isTaken = takenSlots.includes(slot);
              const isSelected = timeSlot === slot;
              return (
                <button
                  key={slot}
                  onClick={() => !isTaken && setTimeSlot(slot)}
                  disabled={isTaken}
                  className={`py-2 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                    isTaken
                      ? "bg-surface-container text-on-surface/20 border-outline-variant/30 cursor-not-allowed"
                      : isSelected
                      ? "bg-primary text-on-primary border-primary font-semibold"
                      : "bg-surface text-on-surface border-outline-variant hover:border-primary hover:text-primary"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t border-outline-variant pt-4 flex items-center justify-between">
        <div>
          <span className="text-2xl font-black text-on-surface">${price}</span>
          <span className="text-xs text-on-surface/50 ml-1">total</span>
        </div>

        <button
          onClick={handleNextStep}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-semibold hover:brightness-110 transition-all cursor-pointer"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
