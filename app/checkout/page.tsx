import type { Metadata } from "next";
import { PageHead } from "@/components/Breadcrumb";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <>
      <PageHead
        trail={[
          { href: "/", label: "Home" },
          { href: "/cart", label: "Cart" },
        ]}
        title="Checkout"
      />
      <CheckoutForm />
    </>
  );
}
