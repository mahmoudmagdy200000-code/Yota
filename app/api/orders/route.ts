import { NextResponse } from "next/server";
import { products } from "@/lib/products";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const webhook = process.env.SHEETS_WEBHOOK_URL;
  const secret = process.env.SHEETS_WEBHOOK_SECRET;
  if (!webhook || !secret) return NextResponse.json({ error: "Orders are not connected yet. Please try again later." }, { status: 503 });
  try {
    const payload = await request.json();
    const { customer, items, subtotal, shipping, total } = payload ?? {};
    if (!customer || typeof customer.name !== "string" || customer.name.trim().length < 2 || customer.name.length > 100) return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    if (typeof customer.phone !== "string" || !/^[+0-9 ()-]{8,}$/.test(customer.phone)) return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
    if (typeof customer.governorate !== "string" || !customer.governorate || typeof customer.address !== "string" || customer.address.trim().length < 5 || customer.address.length > 500 || !Array.isArray(items) || !items.length || items.length > 30) return NextResponse.json({ error: "Please complete your delivery details and add an item." }, { status: 400 });
    let sum = 0;
    for (const item of items) {
      if (!item || typeof item.product !== "string" || typeof item.size !== "string" || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20) return NextResponse.json({ error: "One of the items in your order is invalid." }, { status: 400 });
      const product = products.find((p) => p.name === item.product);
      const variant = product?.prices.find((v) => v.label === item.size && v.price === Number(item.unitPrice));
      if (!variant) return NextResponse.json({ error: "A product or price changed. Refresh the page and try again." }, { status: 400 });
      sum += variant.price * item.quantity;
    }
    const delivery = sum >= 1500 ? 0 : 70;
    if (sum !== Number(subtotal) || delivery !== Number(shipping) || Number(total) !== sum + delivery) return NextResponse.json({ error: "Order total could not be verified. Refresh and try again." }, { status: 400 });
    const response = await fetch(webhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ secret, orderId: `YOTA-${Date.now()}`, customer, items, subtotal: sum, shipping: delivery, total: sum + delivery, payment: "Cash on delivery", createdAt: new Date().toISOString() }), cache: "no-store", redirect: "follow" });
    if (!response.ok) throw new Error(`Sheets endpoint returned ${response.status}`);
    const result = await response.json().catch(() => ({}));
    if (result.ok !== true) throw new Error("Sheets endpoint rejected the order");
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Order submission failed", error);
    return NextResponse.json({ error: "We couldn't save your order. Please try again in a moment." }, { status: 502 });
  }
}
