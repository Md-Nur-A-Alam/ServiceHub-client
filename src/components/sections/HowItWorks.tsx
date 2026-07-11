import { Container } from "@/components/layout/Container";
import { howItWorksSteps } from "@/data/howItWorksSteps";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-20 bg-surface-container-low">
      <Container>
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display leading-tight tracking-tight text-on-surface">How ServiceHub Works</h2>
          <p className="text-base text-on-surface/60 mt-3 max-w-xl mx-auto">
            From search to service in three easy steps. No calls, no waiting — just results.
          </p>
        </div>

        {/* Steps */}
        <div className="relative flex flex-col md:flex-row items-start gap-0 md:gap-8">
          {howItWorksSteps.map((step, i) => (
            <div key={step.number} className="relative flex md:flex-col items-start md:items-center gap-6 md:gap-4 flex-1">
              {/* Connector line on md+ */}
              {i < howItWorksSteps.length - 1 && (
                <div
                  className="hidden md:block absolute top-10 left-[calc(50%+2.5rem)] right-[calc(-50%+2.5rem)] h-0.5 bg-outline-variant"
                  aria-hidden="true"
                />
              )}

              {/* Connector line on base (vertical) */}
              {i < howItWorksSteps.length - 1 && (
                <div
                  className="md:hidden absolute left-[1.75rem] top-[4.5rem] w-0.5 h-10 bg-outline-variant"
                  aria-hidden="true"
                />
              )}

              {/* Step icon circle */}
              <div className="relative z-10 w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-2xl shadow-md shrink-0">
                {step.icon}
                {/* Step number badge */}
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-secondary text-on-secondary text-xs font-bold flex items-center justify-center">
                  {step.number}
                </span>
              </div>

              {/* Text */}
              <div className="flex-1 md:flex-none pb-10 md:pb-0 md:text-center">
                <h3 className="font-bold text-on-surface text-base md:text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-on-surface/65 leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default HowItWorks;
