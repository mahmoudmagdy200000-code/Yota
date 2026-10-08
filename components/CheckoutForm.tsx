"use client";

import Link from "next/link";
import { useState } from "react";
import { deliveryFor, formatPrice, governorates } from "@/lib/store";
import { useCart } from "./CartProvider";
import { Totals } from "./CartView";
import { CheckIcon } from "./icons";

const emptyForm = { name: "", phone: "", governorate: "", address: "", notes: "" };

export function CheckoutForm() {
  const { lines, subtotal, clear, ready } = useCart();
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ orderId?: string } | null>(null);

  if (done) {
    return (
      <div className="empty-state">
        <span className="success-mark">
          <CheckIcon />
        </span>
        <h2>Thank you for your order!</h2>
        <p>
          {done.orderId ? (
            <>
              Your order number is <strong>{done.orderId}</strong>.{" "}
            </>
          ) : null}
          We&apos;ll call you to confirm the delivery details.
        </p>
        <Link href="/shop" className="button button-dark">
          Continue shopping
        </Link>
      </div>
    );
  }

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

  const shipping = deliveryFor(subtotal);
  const field = (key: keyof typeof emptyForm) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm({ ...form, [key]: e.target.value }),
  });

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          items: lines.map((l) => ({ product: l.product.name, size: l.size, unitPrice: l.price, quantity: l.qty })),
          subtotal,
          shipping,
          total: subtotal + shipping,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "We couldn't place your order. Please try again.");
      setDone({ orderId: typeof data.orderId === "string" ? data.orderId : undefined });
      clear();
      window.scrollTo({ top: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="checkout" onSubmit={submit}>
      <section className="checkout-section">
        <h2>Delivery details</h2>
        <label className="field">
          <span>Full name</span>
          <input required minLength={2} maxLength={100} autoComplete="name" {...field("name")} />
        </label>
        <label className="field">
          <span>Phone number</span>
          <input required type="tel" inputMode="tel" pattern="[+0-9 \(\)\-]{8,}" autoComplete="tel" {...field("phone")} />
        </label>
        <label className="field">
          <span>Governorate</span>
          <select required {...field("governorate")}>
            <option value="">Choose governorate</option>
            {governorates.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Full address</span>
          <textarea required minLength={5} maxLength={500} rows={3} autoComplete="street-address" {...field("address")} />
        </label>
        <label className="field">
          <span>Order notes (optional)</span>
          <textarea rows={2} maxLength={500} {...field("notes")} />
        </label>
      </section>

      <section className="checkout-section">
        <h2>Payment method</h2>
        <label className="payment-option">
          <input type="radio" name="payment" defaultChecked readOnly />
          <span>Cash on delivery</span>
          <span className="payment-cash">CASH</span>
        </label>
      </section>

      <section className="checkout-section">
        <h2>Order summary</h2>
        <ul className="summary-lines">
          {lines.map((l) => (
            <li key={`${l.id}-${l.size}`}>
              <span>
                {l.product.name} <small>{l.size} × {l.qty}</small>
              </span>
              <span>EGP {formatPrice(l.price * l.qty)}</span>
            </li>
          ))}
        </ul>
        <Totals subtotal={subtotal} />
      </section>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button className="button button-dark button-block" disabled={busy}>
        {busy ? "Placing your order…" : `Place order · EGP ${formatPrice(subtotal + shipping)}`}
      </button>
    </form>
  );
}
