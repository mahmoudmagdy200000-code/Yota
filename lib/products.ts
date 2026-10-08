export type Variant = { label: string; price: number };
export type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
  prices: Variant[];
  /** Listed on the Sale page. */
  onSale?: boolean;
};

// The live store lists 9 products; only these 4 were readable in the screenshots.
// Add the remaining products here (same shape) and drop their photos in /public/products.
export const products: Product[] = [
  {
    id: "strawberry-cheesecake",
    name: "Strawberry Cheese Cake Scented Candle",
    description: "Sweet, creamy and made for slow evenings. Hand-poured with natural wax.",
    image: "/products/strawberry-cheesecake.jpg",
    prices: [{ label: "Small", price: 400 }, { label: "Large", price: 600 }],
    onSale: true,
  },
  {
    id: "berry-kiss",
    name: "Berry Kiss Scented Candle",
    description: "A soft berry blend with a fresh, bright finish. Hand-poured with natural wax.",
    image: "/products/berry-kiss.jpg",
    prices: [{ label: "Small", price: 400 }, { label: "Large", price: 600 }],
    onSale: true,
  },
  {
    id: "body-serum",
    name: "Body Serum Candle - Massage Candle",
    description: "A warm, skin-loving massage candle with coconut butter, shea butter and almond oil.",
    image: "/products/body-serum.jpg",
    prices: [{ label: "Small", price: 400 }, { label: "Large", price: 600 }],
    onSale: true,
  },
  {
    id: "sandalwood-vanilla",
    name: "Sandalwood Vanilla Scented Candle",
    description: "A cozy wood and vanilla scent for your home. Hand-poured with natural wax.",
    image: "/products/sandalwood-vanilla.jpg",
    prices: [{ label: "Small", price: 400 }, { label: "Large", price: 600 }],
    onSale: true,
  },
];

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}

export function priceRange(product: Product) {
  const values = product.prices.map((v) => v.price);
  return { min: Math.min(...values), max: Math.max(...values) };
}
