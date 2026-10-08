import Image from "next/image";
import Link from "next/link";
import { priceRange, type Product } from "@/lib/products";
import { Price } from "./Price";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { min, max } = priceRange(product);
  return (
    <Link href={`/products/${product.id}`} className="product-card">
      <div className="product-card-media">
        <Image src={product.image} alt={product.name} fill priority={priority} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" />
      </div>
      <h3 className="product-card-name">{product.name}</h3>
      {product.prices.length > 1 && <p className="product-card-sizes">{product.prices.length} Sizes</p>}
      <Price min={min} max={max} />
    </Link>
  );
}
