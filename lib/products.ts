export type Product = { id: string; name: string; note: string; image: string; prices: { label: string; price: number }[]; tag?: string };

// Add the remaining products here when their names, photos and prices are confirmed.
export const products: Product[] = [
  { id: "strawberry-cheesecake", name: "Strawberry Cheese Cake Scented Candle", note: "Sweet, creamy and made for slow evenings.", image: "/products/strawberry-cheesecake.jpg", prices: [{ label: "Small", price: 400 }, { label: "Large", price: 600 }], tag: "BEST SELLER" },
  { id: "berry-kiss", name: "Berry Kiss Scented Candle", note: "A soft berry blend with a fresh, bright finish.", image: "/products/berry-kiss.jpg", prices: [{ label: "Small", price: 400 }, { label: "Large", price: 600 }] },
  { id: "body-serum", name: "Body Serum Candle · Massage Candle", note: "A warm, skin-loving candle for a little self-care.", image: "/products/body-serum.jpg", prices: [{ label: "Small", price: 400 }, { label: "Large", price: 600 }], tag: "SELF CARE" },
  { id: "sandalwood-vanilla", name: "Sandalwood Vanilla Scented Candle", note: "A cozy wood and vanilla scent for your home.", image: "/products/sandalwood-vanilla.jpg", prices: [{ label: "Small", price: 400 }, { label: "Large", price: 600 }] },
];
