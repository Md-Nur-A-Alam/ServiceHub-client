export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const faqItems: FAQItem[] = [
  {
    id: "how-to-book",
    question: "How do I book a service?",
    answer:
      "Browse our service categories, find a provider that fits your needs, and click 'Book Now' on their listing. Choose your preferred date and time slot, add any notes for the provider, confirm your booking — it's done in under two minutes.",
  },
  {
    id: "pricing",
    question: "How is pricing determined?",
    answer:
      "Providers set their own transparent rates. You'll see the exact price on each listing before you book — no hidden fees ever. For larger jobs, many providers offer free on-site estimates that you can request through the platform.",
  },
  {
    id: "provider-vetting",
    question: "How are service providers vetted?",
    answer:
      "Every provider goes through identity verification and a background check before joining ServiceHub. We also monitor ongoing review scores and maintain a strict quality assurance process. Providers with repeated poor reviews are removed from the platform.",
  },
  {
    id: "cancellation",
    question: "What is the cancellation policy?",
    answer:
      "You can cancel or reschedule a booking up to 24 hours before the appointment at no charge. Cancellations within 24 hours may incur a small fee depending on the provider's policy, which is clearly stated on their listing.",
  },
  {
    id: "become-provider",
    question: "How do I become a service provider?",
    answer:
      "Sign up with a 'Provider' account, complete your profile with your skills, service area, and pricing, then submit your ID and qualifications for verification. Our team reviews applications within 48 hours. Once approved, your listings go live immediately.",
  },
  {
    id: "dispute",
    question: "What if I'm unhappy with the service?",
    answer:
      "Our team is here to help. Contact our support team within 72 hours of your appointment, describe the issue, and we'll mediate with the provider to reach a fair resolution — including partial or full refunds where appropriate.",
  },
];
