import type { Metadata } from "next";
import { PageHead } from "@/components/Breadcrumb";
import { formatPrice, store } from "@/lib/store";

export const metadata: Metadata = { title: "Store info" };

export default function InfoPage() {
  return (
    <>
      <PageHead trail={[{ href: "/", label: "Home" }]} title="Store info" />
      <div className="info">
        <section>
          <h2>Delivery</h2>
          <p>{store.deliveryTime}.</p>
          <p>
            Delivery fee: EGP {formatPrice(store.deliveryFee)} per order — free on orders of EGP {formatPrice(store.freeDeliveryFrom)} or more.
          </p>
        </section>
        <section>
          <h2>Payment</h2>
          <p>Cash on delivery. You pay when your order arrives.</p>
        </section>
      </div>
    </>
  );
}
