export const BUSINESS_TYPES = [
  {
    value: "Food & Beverage",
    emoji: "🍽️",
    description: "Restaurants, cafés, milk tea, bakeries, and food stalls",
  },
  {
    value: "Retail Store",
    emoji: "🛍️",
    description: "Retail shops, groceries, convenience stores, and pharmacies",
  },
  {
    value: "Beauty & Wellness",
    emoji: "💈",
    description: "Salons, barbershops, spas, and wellness centers",
  },
  {
    value: "Service Business",
    emoji: "🧰",
    description: "Laundry, repair, cleaning, and professional services",
  },
  {
    value: "Auto Shop",
    emoji: "🚗",
    description: "Auto repair, maintenance, and automotive services",
  },
  {
    value: "Hardware & Electronics",
    emoji: "🔩",
    description: "Hardware, electronics, and appliance stores",
  },
  {
    value: "Office",
    emoji: "🏢",
    description: "Offices, agencies, and administrative businesses",
  },
  {
    value: "Other",
    emoji: "📦",
    description: "Something else",
  },
] as const

export type BusinessType = (typeof BUSINESS_TYPES)[number]["value"]
