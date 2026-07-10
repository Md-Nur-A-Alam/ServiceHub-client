export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
}

export const testimonials: Testimonial[] = [
  { id: "1", name: "John Doe", role: "Customer", content: "Great service!" },
];
