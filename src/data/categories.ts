export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  serviceCount: number;
}

export const categories: Category[] = [
  {
    id: "cleaning",
    name: "Home Cleaning",
    description: "Professional deep cleaning, move-in/out, and regular upkeep",
    icon: "🧹",
    serviceCount: 124,
  },
  {
    id: "plumbing",
    name: "Plumbing",
    description: "Leak repairs, pipe installation, and drainage solutions",
    icon: "🔧",
    serviceCount: 87,
  },
  {
    id: "electrical",
    name: "Electrical",
    description: "Wiring, fixture installation, and safety inspections",
    icon: "⚡",
    serviceCount: 65,
  },
  {
    id: "painting",
    name: "Painting",
    description: "Interior and exterior painting with professional finishes",
    icon: "🎨",
    serviceCount: 93,
  },
  {
    id: "landscaping",
    name: "Landscaping",
    description: "Lawn care, garden design, and tree trimming services",
    icon: "🌿",
    serviceCount: 71,
  },
  {
    id: "carpentry",
    name: "Carpentry",
    description: "Custom furniture, cabinet fitting, and wood repairs",
    icon: "🪚",
    serviceCount: 49,
  },
  {
    id: "moving",
    name: "Moving & Storage",
    description: "Local and long-distance moving with packing support",
    icon: "📦",
    serviceCount: 38,
  },
  {
    id: "hvac",
    name: "HVAC & Cooling",
    description: "AC installation, maintenance, and heating system repairs",
    icon: "❄️",
    serviceCount: 56,
  },
];
