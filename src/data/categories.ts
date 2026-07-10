export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const categories: Category[] = [
  { id: "cleaning", name: "Cleaning", icon: "Sparkles" },
  { id: "plumbing", name: "Plumbing", icon: "Wrench" },
  { id: "electrical", name: "Electrical", icon: "Zap" },
];
