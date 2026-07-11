import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Container } from "@/components/layout/Container";

const providerBenefits = [
  "Set your own rates and availability",
  "Get booked by thousands of local customers",
  "Secure payments, every time",
  "Build your reputation with verified reviews",
  "Dedicated provider support team",
];

export function ProviderCTA() {
  return (
    <section id="for-providers" className="py-16 md:py-20 bg-surface-container-low">
      <Container>
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 bg-surface border border-outline-variant rounded-3xl overflow-hidden p-8 md:p-12">
          {/* Text column */}
          <div className="flex-1 flex flex-col gap-6 text-center md:text-left items-center md:items-start">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-bold border border-secondary/20">
              For Professionals
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-display leading-tight tracking-tight text-on-surface">
              Grow Your Business with ServiceHub
            </h2>
            <p className="text-base text-on-surface/65 max-w-md">
              Join 1,200+ verified professionals already earning more with ServiceHub. List your services for free and start getting bookings today.
            </p>
            <ul className="space-y-2.5 text-left w-full max-w-sm">
              {providerBenefits.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm text-on-surface/80">
                  <CheckCircle className="w-4 h-4 text-tertiary shrink-0 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary text-on-secondary font-bold text-sm hover:brightness-105 transition-all shadow-md"
            >
              Become a Provider <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Visual column (below text on base, side-by-side md+) */}
          <div className="w-full md:w-[40%] shrink-0 flex justify-center">
            <div className="relative w-full max-w-xs h-64 md:h-72">
              {/* Background decoration */}
              <div className="absolute inset-0 rounded-2xl bg-secondary/10" />

              {/* Floating earnings card */}
              <div className="absolute top-4 left-4 right-4 bg-surface border border-outline-variant rounded-xl p-4 shadow-lg">
                <p className="text-xs text-on-surface/50 font-medium">This month's earnings</p>
                <p className="text-3xl font-black text-on-surface mt-1">$3,840</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs font-bold text-tertiary">↑ 23%</span>
                  <span className="text-xs text-on-surface/50">vs last month</span>
                </div>
              </div>

              {/* Floating booking card */}
              <div className="absolute bottom-4 right-4 bg-surface border border-outline-variant rounded-xl p-3 shadow-lg w-44">
                <p className="text-xs text-on-surface/50 font-medium">New booking!</p>
                <p className="text-sm font-bold text-on-surface mt-0.5">House Deep Clean</p>
                <p className="text-xs text-on-surface/60 mt-0.5">Tomorrow, 10:00 AM</p>
                <span className="mt-2 inline-block px-2 py-0.5 rounded-full bg-tertiary/15 text-tertiary text-xs font-bold">
                  Confirmed
                </span>
              </div>

              {/* Provider avatar */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-surface border border-outline-variant rounded-xl px-3 py-2 shadow-md">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-on-secondary text-xs font-bold">
                  JD
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface">James D.</p>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => <span key={i} className="text-secondary text-xs">★</span>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default ProviderCTA;
