"use client";

import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { faqItems } from "@/data/faq";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

export default function FAQPage() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-background min-h-screen py-12">
      <Container className="max-w-3xl space-y-12">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-on-surface font-display">Frequently Asked Questions</h1>
          <p className="text-sm text-on-surface/65">
            Everything you need to know about booking services, provider vetting, payments, and cancellations.
          </p>
        </div>

        {/* FAQ Accordion list */}
        <div className="space-y-4">
          {faqItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="bg-surface border border-outline-variant rounded-2xl overflow-hidden shadow-xs hover:border-primary/50 transition-colors"
              >
                <button
                  onClick={() => toggleFAQ(item.id)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-on-surface transition-colors hover:bg-surface-container/30 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-primary shrink-0 ml-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-on-surface/50 shrink-0 ml-4" />
                  )}
                </button>

                {/* Answer drawer */}
                <div
                  className={`transition-all duration-200 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-40 border-t border-outline-variant/60" : "max-h-0"
                  }`}
                >
                  <div className="p-5 text-xs text-on-surface/75 leading-relaxed bg-surface-container/20">
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
