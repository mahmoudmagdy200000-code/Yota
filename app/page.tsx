"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { products, type Product } from "@/lib/products";

type CartLine = { product: Product; size: string; price: number; qty: number };
const egp = (n: number) => `EGP ${n.toLocaleString("en-EG")}`;

export default function Home() {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [drawer, setDrawer] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [form, setForm] = useState({ name: "", phone: "", governorate: "", address: "", notes: "" });
  const [orderDone, setOrderDone] = useState(false);
  const count = cart.reduce((n, line) => n + line.qty, 0);
  const subtotal = cart.reduce((n, line) => n + line.price * line.qty, 0);
  const shipping = subtotal >= 1500 ? 0 : 70;
  const visibleProducts = useMemo(() => {
    const filtered = products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
    if (sort === "price-low") return [...filtered].sort((a,b) => a.prices[0].price - b.prices[0].price);
    if (sort === "name") return [...filtered].sort((a,b) => a.name.localeCompare(b.name));
    return filtered;
  }, [query, sort]);

  function add(product: Product, size: string, price: number) {
    setCart((current) => {
      const found = current.findIndex((line) => line.product.id === product.id && line.size === size);
      if (found < 0) return [...current, { product, size, price, qty: 1 }];
      return current.map((line, i) => i === found ? { ...line, qty: line.qty + 1 } : line);
    });
    setNotice("Added to your bag");
    window.setTimeout(() => setNotice(""), 1800);
  }
  function adjust(index: number, delta: number) {
    setCart((lines) => lines.map((line, i) => i === index ? { ...line, qty: line.qty + delta } : line).filter((line) => line.qty > 0));
  }
  async function submitOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!cart.length) return;
    setBusy(true); setNotice("");
    try {
      const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customer: form, items: cart.map(({ product, size, price, qty }) => ({ product: product.name, size, unitPrice: price, quantity: qty })), subtotal, shipping, total: subtotal + shipping }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "We couldn't save your order.");
      setOrderDone(true); setCart([]);
    } catch (err) { setNotice(err instanceof Error ? err.message : "Something went wrong. Please try again."); }
    finally { setBusy(false); }
  }

  return <main>
    <div className="announcement">A little light, a lot of comfort <span>✦</span> Free delivery on orders over EGP 1,500</div>
    <header className="header">
      <button className="icon-button menu-trigger" aria-label="Open menu" onClick={() => setMenu(!menu)}><span/><span/><span/></button>
      <a className="wordmark" href="#home" aria-label="Yota home"><i>·</i> YŌTA <i>·</i><small>C A N D L E S</small></a>
      <nav className="desktop-nav"><a href="#shop">Shop</a><a href="#story">Our story</a><a href="#footer">Contact</a></nav>
      <div className="header-actions"><button className="icon-button search-trigger" aria-label="Search" onClick={() => setSearch(!search)}><svg viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg></button><button className="bag-button" onClick={() => { setDrawer(true); setCheckout(false); }} aria-label={`Shopping bag, ${count} items`}><svg viewBox="0 0 24 24"><path d="M5 8h14l1.2 13H3.8L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg><span>{count}</span></button></div>
    </header>
    {search && <div className="searchbar"><input autoFocus value={query} onChange={(e) => {setQuery(e.target.value); document.getElementById("shop")?.scrollIntoView({behavior:"smooth"});}} placeholder="Search candles..."/><button onClick={() => {setSearch(false);setQuery("")}}>Close</button></div>}
    {menu && <nav className="mobile-menu"><a onClick={() => setMenu(false)} href="#shop">Shop all</a><a onClick={() => setMenu(false)} href="#story">Our story</a><a onClick={() => setMenu(false)} href="#footer">Contact us</a></nav>}
    <section className="hero" id="home">
      <div className="hero-image"><Image src="/products/strawberry-cheesecake.jpg" alt="Yota handcrafted scented candle" fill priority sizes="(max-width: 760px) 100vw, 55vw"/></div>
      <div className="hero-shade"/>
      <div className="hero-copy"><span className="eyebrow light">HAND-POURED · MADE WITH LOVE</span><h1>Make room<br/>for a softer<br/><em>kind of glow.</em></h1><p>Thoughtful scents for the little moments that make a home.</p><a className="button button-light" href="#shop">Shop the collection <span>↗</span></a></div>
      <div className="hero-stamp">YŌTA<br/><small>LIGHT YOUR MOMENT</small></div>
      <a className="scroll-note" href="#shop">SCROLL TO DISCOVER <span>↓</span></a>
    </section>
    <section className="intro-strip" id="story"><span>Small batch</span><b>✳</b><span>Natural wax</span><b>✳</b><span>Made in Egypt</span><b>✳</b><span>Made for your rituals</span></section>
    <section className="shop-section" id="shop">
      <div className="section-heading"><div><span className="eyebrow">THE YŌTA COLLECTION</span><h2>Find your <em>favorite.</em></h2><p>Scents to settle into, give away, and come home to.</p></div><a className="text-link" href="#products">Shop all <span>↘</span></a></div>
      <div className="shop-tools"><span>{visibleProducts.length} Products</span><label>Sort by <select value={sort} onChange={(e)=>setSort(e.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="name">Name</option></select></label></div>
      <div className="product-grid" id="products">{visibleProducts.map((product, index) => <ProductCard key={product.id} product={product} index={index} onAdd={add}/>)}</div>
      <div className="catalog-note">More little luxuries are on their way <span>✦</span></div>
    </section>
    <section className="ritual"><div className="ritual-photo"><Image src="/products/body-serum.jpg" alt="A glowing Yota massage candle" fill sizes="(max-width: 760px) 100vw, 50vw"/></div><div className="ritual-copy"><span className="eyebrow">A MOMENT, JUST FOR YOU</span><h2>Let the day<br/>melt <em>away.</em></h2><p>Light a candle. Take a breath. Make a little space for yourself.</p><a className="text-link" href="#shop">Find your ritual <span>↗</span></a></div></section>
    <section className="promise"><span className="eyebrow">A NOTE FROM YŌTA</span><p>Made slowly, so you can slow down too.</p><span className="signature">YŌTA</span></section>
    <footer id="footer"><div className="footer-top"><a className="wordmark footer-logo" href="#home"><i>·</i> YŌTA <i>·</i><small>C A N D L E S</small></a><p>Light up your everyday.</p><a className="text-link" href="https://instagram.com/" target="_blank" rel="noreferrer">Follow our little world on Instagram ↗</a></div><div className="footer-bottom"><span>© 2026 YŌTA Candles</span><span>Delivery within 1–7 working days</span><span>Cash on delivery available</span></div></footer>
    {notice && !drawer && <div className="toast" role="status">{notice}</div>}
    {drawer && <div className="overlay" onMouseDown={(e) => {if(e.target===e.currentTarget)setDrawer(false)}}><aside className="drawer"><div className="drawer-head"><div><span className="eyebrow">YOUR BAG</span><h2>{orderDone ? "Thank you" : checkout ? "Checkout" : "Your bag"}</h2></div><button className="close" onClick={()=>{setDrawer(false);setOrderDone(false)}} aria-label="Close">×</button></div>
      {orderDone ? <div className="success"><span>✦</span><h3>Your order is on its way to us.</h3><p>We’ll call you shortly to confirm delivery details. Thank you for choosing YŌTA.</p><button className="button button-dark" onClick={()=>{setDrawer(false);setOrderDone(false)}}>Back to the store</button></div> : checkout ? <form className="checkout-form" onSubmit={submitOrder}><p className="form-caption">Delivery details</p><input required minLength={2} placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><input required inputMode="tel" pattern="[+0-9 ()-]{8,}" placeholder="Phone number" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/><select required value={form.governorate} onChange={e=>setForm({...form,governorate:e.target.value})}><option value="">Choose governorate</option>{["Cairo","Giza","Alexandria","Qalyubia","Gharbia","Dakahlia","Sharqia","Port Said","Ismailia","Suez","Faiyum","Beni Suef","Minya","Asyut","Sohag","Qena","Luxor","Aswan","Red Sea","Matrouh","North Sinai","South Sinai","New Valley","Monufia","Beheira","Kafr El Sheikh","Damietta"].map(x=><option key={x}>{x}</option>)}</select><textarea required rows={3} placeholder="Full address" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/><textarea rows={2} placeholder="Order notes (optional)" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/><div className="payment-line"><span>Payment</span><strong>Cash on delivery</strong></div><Totals subtotal={subtotal} shipping={shipping}/>{notice&&<p className="error">{notice}</p>}<button className="button button-dark full" disabled={busy}>{busy ? "Placing your order…" : `Place order · ${egp(subtotal + shipping)}`}</button><button type="button" className="back-link" onClick={()=>setCheckout(false)}>← Back to bag</button></form> : <>{cart.length===0 ? <div className="empty"><p>Your bag is waiting for a little glow.</p><button className="button button-dark" onClick={()=>setDrawer(false)}>Explore candles</button></div> : <><div className="cart-list">{cart.map((line,index)=><div className="cart-line" key={`${line.product.id}-${line.size}`}><div className="cart-thumb"><Image src={line.product.image} alt="" fill sizes="84px"/></div><div className="cart-info"><strong>{line.product.name}</strong><span>{line.size} · {egp(line.price)}</span><div className="quantity"><button onClick={()=>adjust(index,-1)} aria-label="Decrease quantity">−</button><span>{line.qty}</span><button onClick={()=>adjust(index,1)} aria-label="Increase quantity">+</button></div></div><b>{egp(line.price*line.qty)}</b></div>)}</div><div className="cart-summary"><Totals subtotal={subtotal} shipping={shipping}/><button className="button button-dark full" onClick={()=>{setCheckout(true);setNotice("")}}>Continue to checkout · {egp(subtotal+shipping)}</button><p>Shipping is calculated at EGP 70 per order.</p></div></>}</>}
      </aside></div>}
  </main>;
}

function ProductCard({ product, index, onAdd }: { product: Product; index: number; onAdd: (p:Product,s:string,n:number)=>void }) {
  const [size, setSize] = useState(0);
  return <article className="product-card"><div className={`product-image image-${index}`}><Image src={product.image} alt={product.name} fill sizes="(max-width: 760px) 50vw, 25vw"/><span className="product-tag">{product.tag || "YŌTA ORIGINAL"}</span><button className="quick-add" onClick={()=>onAdd(product,product.prices[size].label,product.prices[size].price)} aria-label={`Add ${product.name} to bag`}>＋</button></div><div className="product-copy"><h3>{product.name}</h3><p className="product-note">{product.note}</p><div className="product-options"><span>Choose size</span><select aria-label={`Size for ${product.name}`} value={size} onChange={e=>setSize(Number(e.target.value))}>{product.prices.map((v,i)=><option value={i} key={v.label}>{v.label}</option>)}</select></div><div className="product-price">{egp(product.prices[0].price)} <span>—</span> {egp(product.prices[1].price)}</div><button className="mobile-add" onClick={()=>onAdd(product,product.prices[size].label,product.prices[size].price)}>Add to bag · {egp(product.prices[size].price)}</button></div></article>;
}
function Totals({subtotal,shipping}:{subtotal:number;shipping:number}){return <div className="totals"><div><span>Subtotal</span><span>{egp(subtotal)}</span></div><div><span>Delivery</span><span>{egp(shipping)}</span></div><div className="total"><strong>Total</strong><strong>{egp(subtotal+shipping)}</strong></div></div>}
