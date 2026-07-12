export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  imageEmoji: string;
  imageBg: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-choose-the-right-provider",
    title: "How to Choose the Right Service Provider",
    excerpt: "Learn the core criteria for vetting service professionals online, from checking verifications to interpreting rating distributions.",
    content: `
      Choosing the right professional for home maintenance, tutoring, or personal care can feel daunting. With so many options available online, it is essential to follow a structured vetting process to ensure your safety, budget, and quality standards are met.

      ### 1. Check for Verification Badges
      On ServiceHub, verified providers undergo basic profile screening. Always look for the green 'Verified' badge on service listings. This indicator shows the provider has a confirmed account, connected email, and has passed preliminary moderation criteria.

      ### 2. Analyze the Rating Distribution
      Do not just look at the average star rating (e.g. 4.8). Look at the total rating count and the specific comments. A provider with fifty reviews and a 4.6 rating is often more reliable than a provider with one 5.0 rating. Look for reviews detailing:
      - Communication quality
      - Punctuality
      - Quality of clean-up (for physical tasks)

      ### 3. Ask Questions Before Booking
      Use our platform messaging channels to clarify scope, materials, and expectations before scheduling. Clear upfront alignment prevents project delays and misunderstandings down the road.
    `,
    date: "July 10, 2026",
    readTime: "4 min read",
    imageEmoji: "🔍",
    imageBg: "bg-primary/10",
  },
  {
    slug: "maximizing-your-servicehub-profile",
    title: "Maximizing Your Business Profile as a Provider",
    excerpt: "A guide for independent professionals on optimizing bios, photos, and slot availability to boost booking conversion rates.",
    content: `
      Your ServiceHub profile is your digital storefront. Creating a premium, trustworthy impression is key to turning visitors into confirmed bookings. Here is how to optimize your provider profile:

      ### 1. Write a Compelling Biography
      Explain not just *what* you do, but *how* you do it. Detail your experience, certifications, and what sets your service apart. Keep it professional, friendly, and free of typos.

      ### 2. Maintain Accurate Slot Availability
      Nothing frustrates customers more than selecting a date and slot only to have it rejected due to calendar conflicts. Keep your available hours updated. When a booking comes in, respond within a few hours to build trust and maintain a high search ranking.

      ### 3. Encourage Reviews After Every Completed Task
      Ratings are the primary driver of customer decisions. Once you complete a booking, ask your customer to leave an honest review on the platform. More verified reviews directly correlate with higher profile conversion.
    `,
    date: "June 28, 2026",
    readTime: "5 min read",
    imageEmoji: "💼",
    imageBg: "bg-success/10",
  },
  {
    slug: "importance-of-verified-reviews",
    title: "The Importance of Verified Reviews in Modern Marketplaces",
    excerpt: "Why verified feedback loop matters and how ServiceHub prevents review fraud with booking-locked submissions.",
    content: `
      Online trust is the foundation of the modern gig economy. However, anonymous review sites are frequently plagued by fake ratings and competitor spam. Here is why verified review loops are essential:

      ### What is a Verified Review?
      At ServiceHub, a customer can only submit a review for a service *after* they have placed a booking, the provider confirmed it, and the status was officially transitioned to 'Completed'. This strict relationship prevents:
      - Fake positive ratings from provider acquaintances
      - Spam negative reviews from business competitors
      - Out-of-context complaints

      ### Trust Goes Both Ways
      By locking reviews to real completed bookings, we ensure providers get fair, constructive feedback they can respond to, and customers get authentic, dependable recommendations.
    `,
    date: "June 15, 2026",
    readTime: "3 min read",
    imageEmoji: "⭐",
    imageBg: "bg-secondary/10",
  },
];
