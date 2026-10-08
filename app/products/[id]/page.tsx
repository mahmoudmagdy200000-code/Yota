import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHead } from "@/components/Breadcrumb";
import { ProductDetail } from "@/components/ProductDetail";
import { getProduct, products } from "@/lib/products";

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProduct((await params).id);
  return product ? { title: product.name, description: product.description, openGraph: { images: [product.image] } } : {};
}

export default async function ProductPage({ params }: Props) {
  const product = getProduct((await params).id);
  if (!product) notFound();
  return (
    <>
      <PageHead
        trail={[
          { href: "/", label: "Home" },
          { href: "/shop", label: "Shop" },
        ]}
        title={product.name}
      />
      <ProductDetail product={product} />
    </>
  );
}
