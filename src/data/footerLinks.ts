export interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

export const footerLinkGroups: FooterLinkGroup[] = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
    ],
  },
  {
    title: "For Customers",
    links: [
      { label: "Find Services", href: "/explore" },
      { label: "My Bookings", href: "/bookings" },
      { label: "Saved Services", href: "/wishlist" },
      { label: "Leave a Review", href: "/dashboard" },
      { label: "Help Center", href: "/help" },
    ],
  },
  {
    title: "For Providers",
    links: [
      { label: "Become a Provider", href: "/register" },
      { label: "Provider Dashboard", href: "/dashboard" },
      { label: "Add a Service", href: "/items/add" },
      { label: "Provider Resources", href: "/resources" },
      { label: "Partner Program", href: "/partners" },
    ],
  },
];

export const socialLinks = [
  { label: "Twitter / X", href: "https://twitter.com", icon: "𝕏" },
  { label: "Instagram", href: "https://instagram.com", icon: "📸" },
  { label: "Facebook", href: "https://facebook.com", icon: "📘" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "💼" },
];

export const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
];
