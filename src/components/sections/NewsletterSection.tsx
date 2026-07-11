"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Container } from "@/components/layout/Container";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section className="py-16 md:py-20 bg-surface-container-low">
      <Container>
        <div className="max-w-2xl mx-auto text-center flex flex-col gap-6">
          {/* Header */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-display leading-tight tracking-tight text-on-surface">
              Stay in the Loop
            </h2>
            <p className="text-lg text-on-surface/60 mt-3">
              Get weekly tips, local service deals, and new provider spotlights delivered to your inbox.
            </p>
          </div>

          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <CheckCircle className="w-10 h-10 text-tertiary" />
              <p className="font-semibold text-on-surface">You're subscribed!</p>
              <p className="text-sm text-on-surface/60">
                Thanks for joining. We'll be in touch with great local service deals.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-full bg-surface border border-outline-variant text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary font-semibold text-sm hover:brightness-110 transition-all cursor-pointer min-h-[44px] shrink-0"
              >
                Subscribe <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <p className="text-xs text-on-surface/40">
            No spam, ever. Unsubscribe with one click at any time.
          </p>
        </div>
      </Container>
    </section>
  );
}

export default NewsletterSection;
