export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  content: string;
  rating: number;
  service: string;
  avatarInitials: string;
  avatarColor: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Mitchell",
    role: "Homeowner",
    location: "Austin, TX",
    content:
      "I needed emergency plumbing on a Sunday evening and had a verified plumber at my door within an hour. The whole booking process took less than five minutes. ServiceHub saved my weekend — and my floors.",
    rating: 5,
    service: "Emergency Plumbing",
    avatarInitials: "SM",
    avatarColor: "bg-primary",
  },
  {
    id: "2",
    name: "James Okonkwo",
    role: "Property Manager",
    location: "Chicago, IL",
    content:
      "I manage twelve rental units and ServiceHub has completely replaced my old contractor spreadsheet. Scheduled recurring cleanings, same-day repairs — everything is tracked in one place. The providers are professional and reliable.",
    rating: 5,
    service: "Home Cleaning & Maintenance",
    avatarInitials: "JO",
    avatarColor: "bg-secondary",
  },
  {
    id: "3",
    name: "Priya Natarajan",
    role: "Working Parent",
    location: "Seattle, WA",
    content:
      "With two kids and a full-time job, finding time to vet and hire contractors was exhausting. ServiceHub's rating system and verified profiles gave me the confidence to book without second-guessing. The deck painting came out beautifully.",
    rating: 5,
    service: "Exterior Painting",
    avatarInitials: "PN",
    avatarColor: "bg-tertiary",
  },
  {
    id: "4",
    name: "Marcus Webb",
    role: "First-time Homeowner",
    location: "Nashville, TN",
    content:
      "As someone who just bought their first home, I had no idea who to call for anything. ServiceHub demystified the whole process. I've booked an electrician, a landscaper, and a carpet cleaner all in the last month — stress-free every time.",
    rating: 5,
    service: "Multiple Home Services",
    avatarInitials: "MW",
    avatarColor: "bg-primary",
  },
];
