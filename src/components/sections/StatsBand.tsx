import { Container } from "@/components/layout/Container";

const stats = [
  { value: "1,200+", label: "Verified Providers", icon: "👷" },
  { value: "50,000+", label: "Happy Customers", icon: "😊" },
  { value: "45,000+", label: "Jobs Completed", icon: "✅" },
  { value: "4.9 / 5", label: "Average Rating", icon: "⭐" },
];

export function StatsBand() {
  return (
    <section className="bg-primary-container py-12 md:py-16">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label, icon }) => (
            <div key={label} className="flex flex-col items-center text-center gap-2">
              <span className="text-3xl md:text-4xl">{icon}</span>
              <span className="text-2xl md:text-4xl font-black text-on-primary-container font-display tracking-tight">
                {value}
              </span>
              <span className="text-sm text-on-primary-container/70 font-medium">{label}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default StatsBand;
