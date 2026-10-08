import type { Metadata } from "next";
import { CollectionPage } from "@/components/CollectionPage";
import { products } from "@/lib/products";

export const metadata: Metadata = { title: "Shop" };

export default function ShopPage() {
  return <CollectionPage title="Shop" products={products} />;
}
