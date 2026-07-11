export interface Step {
  number: number;
  title: string;
  description: string;
  icon: string;
}

export const howItWorksSteps: Step[] = [
  {
    number: 1,
    title: "Find Your Service",
    description:
      "Browse 500+ verified local service providers across 8 categories. Filter by rating, price, and availability to find the perfect match for your needs.",
    icon: "🔍",
  },
  {
    number: 2,
    title: "Book in Seconds",
    description:
      "Pick your date and time, add any notes or special requests, and confirm your booking — no phone calls, no waiting on hold. Get instant confirmation.",
    icon: "📅",
  },
  {
    number: 3,
    title: "Sit Back & Review",
    description:
      "Your provider arrives on time. Once the job is done to your satisfaction, leave a review to help your community find great services too.",
    icon: "⭐",
  },
];
