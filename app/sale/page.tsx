import type { Metadata } from "next";
import { CollectionPage } from "@/components/CollectionPage";
import { products } from "@/lib/products";

export const metadata: Metadata = { title: "Sale" };

export default function SalePage() {
  return (
    <CollectionPage
      title="Sale"
      products={products.filter((p) => p.onSale)}
      banner={{ image: "/images/sale-banner.jpg", title: "Sale", text: "Check all the products that are currently on sale." }}
    />
  );
}
