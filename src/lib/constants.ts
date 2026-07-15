export const BUSINESS_TYPES = [
  {
    value: "Coffee Shop",
    emoji: "☕️",
    description: "Coffee, espresso, and café businesses",
  },
  {
    value: "Milk Tea Shop",
    emoji: "🧋",
    description: "Bubble tea, fruit tea, and beverage shops",
  },
  {
    value: "Restaurant",
    emoji: "🍽️",
    description: "Dine-in, casual, and full-service restaurants",
  },
  {
    value: "Fast Food",
    emoji: "🍔",
    description: "Quick-service restaurants and food stalls",
  },
  {
    value: "Bakery",
    emoji: "🍞",
    description: "Bread, cakes, pastries, and baked goods",
  },
  {
    value: "Retail Store",
    emoji: "🛍️",
    description: "General merchandise and specialty retail",
  },
  {
    value: "Convenience Store",
    emoji: "🏪",
    description: "Convenience stores and sari-sari stores",
  },
  {
    value: "Grocery",
    emoji: "🛒",
    description: "Mini groceries and supermarkets",
  },
  {
    value: "Pharmacy",
    emoji: "💊",
    description: "Drugstores and pharmacies",
  },
  {
    value: "Salon & Barbershop",
    emoji: "💈",
    description: "Hair salons, barber shops, and beauty services",
  },
  {
    value: "Spa & Wellness",
    emoji: "💆",
    description: "Massage, spa, and wellness centers",
  },
  {
    value: "Laundry Shop",
    emoji: "🧺",
    description: "Laundry, dry cleaning, and washing services",
  },
  {
    value: "Hardware Store",
    emoji: "🔩",
    description: "Hardware, construction, and home improvement supplies",
  },
  {
    value: "Electronics Store",
    emoji: "💻",
    description: "Electronics, gadgets, and appliance retailers",
  },
  {
    value: "Fashion & Apparel",
    emoji: "👕",
    description: "Clothing, footwear, and fashion accessories",
  },
  {
    value: "Bookstore & School Supplies",
    emoji: "📚",
    description: "Books, stationery, and school supplies",
  },
  {
    value: "Pet Shop",
    emoji: "🐶",
    description: "Pet supplies, food, and grooming services",
  },
  {
    value: "Auto Shop",
    emoji: "🚗",
    description: "Automotive parts, repair, and maintenance services",
  },
  {
    value: "Service Business",
    emoji: "🧰",
    description: "Repair, cleaning, maintenance, and professional services",
  },
  {
    value: "Office",
    emoji: "🏢",
    description: "Offices, agencies, and administrative workplaces",
  },
  {
    value: "Other",
    emoji: "📦",
    description: "Any other type of business",
  },
] as const

export type BusinessType = (typeof BUSINESS_TYPES)[number]["value"]
