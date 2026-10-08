import type { Metadata } from "next";
import { PageHead } from "@/components/Breadcrumb";
import { CartView } from "@/components/CartView";

export const metadata: Metadata = { title: "Cart" };

export default function CartPage() {
  return (
    <>
      <PageHead trail={[{ href: "/", label: "Home" }]} title="Cart" />
      <CartView />
    </>
  );
}
