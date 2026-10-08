"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProduct, type Product } from "@/lib/products";

type StoredLine = { id: string; size: string; qty: number };
export type CartLine = StoredLine & { product: Product; price: number };

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  ready: boolean;
  add: (id: string, size: string, qty?: number) => void;
  setQty: (id: string, size: string, qty: number) => void;
  remove: (id: string, size: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "yota-cart";
const MAX_QTY = 20;
const CartContext = createContext<CartContextValue | null>(null);

// Keep only lines whose product and size still exist in the catalogue.
function resolve(stored: StoredLine[]): CartLine[] {
  const lines: CartLine[] = [];
  for (const line of stored) {
    const product = getProduct(line.id);
    const variant = product?.prices.find((v) => v.label === line.size);
    if (!product || !variant || !Number.isInteger(line.qty) || line.qty < 1) continue;
    lines.push({ ...line, qty: Math.min(line.qty, MAX_QTY), product, price: variant.price });
  }
  return lines;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [stored, setStored] = useState<StoredLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setStored(resolve(parsed).map(({ id, size, qty }) => ({ id, size, qty })));
      }
    } catch {
      // Storage can be unavailable (private mode); the cart then lives in memory only.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      // Ignore storage failures.
    }
  }, [stored, ready]);

  const add = useCallback((id: string, size: string, qty = 1) => {
    setStored((current) => {
      const index = current.findIndex((l) => l.id === id && l.size === size);
      if (index < 0) return [...current, { id, size, qty: Math.min(qty, MAX_QTY) }];
      return current.map((l, i) => (i === index ? { ...l, qty: Math.min(l.qty + qty, MAX_QTY) } : l));
    });
  }, []);

  const setQty = useCallback((id: string, size: string, qty: number) => {
    setStored((current) =>
      current
        .map((l) => (l.id === id && l.size === size ? { ...l, qty: Math.min(Math.max(qty, 0), MAX_QTY) } : l))
        .filter((l) => l.qty > 0),
    );
  }, []);

  const remove = useCallback((id: string, size: string) => {
    setStored((current) => current.filter((l) => !(l.id === id && l.size === size)));
  }, []);

  const clear = useCallback(() => setStored([]), []);

  const value = useMemo<CartContextValue>(() => {
    const lines = resolve(stored);
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.price * l.qty, 0),
      ready,
      add,
      setQty,
      remove,
      clear,
    };
  }, [stored, ready, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside <CartProvider>");
  return value;
}
