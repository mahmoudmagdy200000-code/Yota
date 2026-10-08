"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { priceRange, type Product } from "@/lib/products";
import { store } from "@/lib/store";
import { useCart } from "./CartProvider";
import { CheckIcon, MinusIcon, PlusIcon } from "./icons";
import { Price } from "./Price";

export function ProductDetail({ product }: { product: Product }) {
  const { add } = useCart();
  const router = useRouter();
  const [size, setSize] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const variant = product.prices[size];
  const { min, max } = priceRange(product);

  useEffect(() => {
    if (!added) return;
    const id = window.setTimeout(() => setAdded(false), 2500);
    return () => window.clearTimeout(id);
  }, [added]);

  return (
    <div className="product-detail">
      <div className="product-detail-media">
        <Image src={product.image} alt={product.name} fill priority sizes="(min-width: 768px) 50vw, 100vw" />
      </div>
      <div className="product-detail-info">
        <Price min={variant ? variant.price : min} max={variant ? undefined : max} className="price-lg" />

        {product.prices.length > 1 && (
          <fieldset className="option-group">
            <legend>
              Size: <strong>{variant.label}</strong>
            </legend>
            <div className="chip-row">
              {product.prices.map((v, i) => (
                <button key={v.label} type="button" className={i === size ? "chip is-selected" : "chip"} aria-pressed={i === size} onClick={() => setSize(i)}>
                  {v.label}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <div className="option-group">
          <span className="option-label">Quantity</span>
          <div className="stepper">
            <button type="button" aria-label="Decrease quantity" disabled={qty <= 1} onClick={() => setQty((q) => Math.max(1, q - 1))}>
              <MinusIcon />
            </button>
            <span aria-live="polite">{qty}</span>
            <button type="button" aria-label="Increase quantity" disabled={qty >= 20} onClick={() => setQty((q) => Math.min(20, q + 1))}>
              <PlusIcon />
            </button>
          </div>
        </div>

        <div className="product-detail-actions">
          <button
            type="button"
            className="button button-dark"
            onClick={() => {
              add(product.id, variant.label, qty);
              setAdded(true);
            }}
          >
            Add to cart
          </button>
          <button
            type="button"
            className="button button-outline"
            onClick={() => {
              add(product.id, variant.label, qty);
              router.push("/checkout");
            }}
          >
            Buy it now
          </button>
        </div>

        {added && (
          <p className="added-note" role="status">
            <CheckIcon /> Added to cart · <Link href="/cart">View cart</Link>
          </p>
        )}

        <p className="product-detail-description">{product.description}</p>
        <p className="product-detail-meta">
          {store.deliveryTime} · Cash on delivery
        </p>
      </div>
    </div>
  );
}
