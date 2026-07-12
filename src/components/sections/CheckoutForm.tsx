"use client";

import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";

interface CheckoutFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  isProcessingOverride?: boolean;
}

export function CheckoutForm({ onSuccess, onCancel, isProcessingOverride }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Return URL is required, but we will redirect manually or just handle state if it doesn't redirect
        // For test mode without redirect, we can just let it finish. But confirmPayment expects return_url usually.
        return_url: window.location.origin + window.location.pathname,
      },
      redirect: "if_required",
    });

    setIsProcessing(false);

    if (error) {
      toast.error(error.message || "An error occurred with payment");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isProcessing || isProcessingOverride}
          className="flex-1 py-2.5 border border-outline-variant rounded-xl hover:bg-surface-container transition-colors text-sm font-semibold cursor-pointer text-on-surface"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || isProcessing || isProcessingOverride}
          className="flex-1 py-2.5 bg-primary text-on-primary rounded-xl font-semibold hover:brightness-110 transition-all text-sm cursor-pointer disabled:opacity-50"
        >
          {isProcessing || isProcessingOverride ? "Processing..." : "Pay & Book"}
        </button>
      </div>
    </form>
  );
}
