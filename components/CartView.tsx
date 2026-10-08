"use client";

import Image from "next/image";
import Link from "next/link";
import { deliveryFor, formatPrice, store } from "@/lib/store";
import { useCart } from "./CartProvider";
import { MinusIcon, PlusIcon, TrashIcon } from "./icons";

export function Totals({ subtotal }: { subtotal: number }) {
  const delivery = deliveryFor(subtotal);
  return (
    <dl className="totals">
      <div>
        <dt>Subtotal</dt>
        <dd>EGP {formatPrice(subtotal)}</dd>
      </div>
      <div>
        <dt>Delivery</dt>
        <dd>{delivery ? `EGP ${formatPrice(delivery)}` : "Free"}</dd>
      </div>
      <div className="totals-total">
        <dt>Total</dt>
        <dd>EGP {formatPrice(subtotal + delivery)}</dd>
      </div>
    </dl>
  );
}

export function CartView() {
  const { lines, subtotal, setQty, remove, ready } = useCart();

  if (!ready) return <div className="cart-placeholder" />;

  if (!lines.length) {
    return (
      <div className="empty-state">
        <p>Your cart is empty.</p>
        <Link href="/shop" className="button button-dark">
          Continue shopping
        </Link>
      </div>
    );
  }

  const toFree = store.freeDeliveryFrom - subtotal;

  return (
    <div className="cart">
      <ul className="cart-lines">
        {lines.map((line) => (
          <li key={`${line.id}-${line.size}`} className="cart-line">
            <Link href={`/products/${line.id}`} className="cart-thumb">
              <Image src={line.product.image} alt={line.product.name} fill sizes="88px" />
            </Link>
            <div className="cart-line-info">
              <Link href={`/products/${line.id}`} className="cart-line-name">
                {line.product.name}
              </Link>
              <p className="cart-line-size">{line.size}</p>
              <p className="price price-sm">
                <span className="price-currency">EGP</span> {formatPrice(line.price)}
              </p>
              <div className="cart-line-controls">
                <div className="stepper stepper-sm">
                  <button type="button" aria-label="Decrease quantity" onClick={() => setQty(line.id, line.size, line.qty - 1)}>
                    <MinusIcon />
                  </button>
                  <span>{line.qty}</span>
                  <button type="button" aria-label="Increase quantity" disabled={line.qty >= 20} onClick={() => setQty(line.id, line.size, line.qty + 1)}>
                    <PlusIcon />
                  </button>
                </div>
                <button type="button" className="icon-button" aria-label={`Remove ${line.product.name}`} onClick={() => remove(line.id, line.size)}>
                  <TrashIcon />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="cart-summary">
        {toFree > 0 && <p className="cart-hint">Add EGP {formatPrice(toFree)} more for free delivery.</p>}
        <Totals subtotal={subtotal} />
        <Link href="/checkout" className="button button-dark button-block">
          Checkout
        </Link>
        <Link href="/shop" className="text-link">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
