import Image from "next/image";
import type { Product } from "@/lib/products";
import { PageHead } from "./Breadcrumb";
import { ProductGrid } from "./ProductGrid";

type Banner = { image: string; title: string; text: string };

export function CollectionPage({ title, products, banner }: { title: string; products: Product[]; banner?: Banner }) {
  return (
    <>
      <PageHead trail={[{ href: "/", label: "Home" }]} title={title} />
      {banner && (
        <section className="collection-banner">
          <Image src={banner.image} alt="" fill priority sizes="100vw" />
          <div className="collection-banner-copy">
            <h2>{banner.title}</h2>
            <p>{banner.text}</p>
          </div>
        </section>
      )}
      <ProductGrid products={products} />
    </>
  );
}
