"use client";

import { useState } from "react";
import { ChevronDown, Plus, Minus } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { faqItems } from "@/data/faq";

export function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section className="py-16 md:py-20 bg-background">
      <Container>
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display leading-tight tracking-tight text-on-surface">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-on-surface/60 mt-3">
            Everything you need to know about using ServiceHub
          </p>
        </div>

        {/* FAQ accordion — max-w-2xl centered on md+ */}
        <div className="w-full md:max-w-2xl md:mx-auto space-y-3">
          {faqItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                  isOpen
                    ? "border-primary/40 bg-primary/5 shadow-sm"
                    : "border-outline-variant bg-surface"
                }`}
              >
                <button
                  onClick={() => toggle(item.id)}
                  aria-expanded={isOpen}
                  className="flex items-center justify-between w-full px-5 py-4 text-left cursor-pointer group"
                >
                  <span
                    className={`text-sm font-semibold leading-snug pr-4 transition-colors ${
                      isOpen ? "text-primary" : "text-on-surface group-hover:text-primary"
                    }`}
                  >
                    {item.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isOpen ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface"
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="w-3.5 h-3.5" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <p className="px-5 pb-5 text-sm text-on-surface/70 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default FAQSection;
