"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { products, priceRange } from "@/lib/products";
import { useCart } from "./CartProvider";
import { BagIcon, CloseIcon, MenuIcon, SearchIcon } from "./icons";
import { Logo } from "./Logo";
import { Price } from "./Price";

const menuLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/sale", label: "Sale" },
  { href: "/info", label: "Store info" },
];

export function Header() {
  const { count } = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setQuery("");
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    if (!menuOpen && !searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, searchOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? products.filter((p) => p.name.toLowerCase().includes(q)) : [];
  }, [query]);

  return (
    <>
      <header className="site-header">
        <button className="header-menu" type="button" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>
          <MenuIcon />
        </button>
        <Link href="/" className="header-logo" aria-label="YŌTA Candles home">
          <Logo />
        </Link>
        <div className="header-actions">
          <Link href="/cart" className="header-cart" aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}>
            <BagIcon />
            <span className="header-count">{count}</span>
          </Link>
          <button className="header-search" type="button" aria-label="Search" aria-expanded={searchOpen} onClick={() => setSearchOpen((open) => !open)}>
            <SearchIcon />
          </button>
        </div>
      </header>

      {searchOpen && (
        <div className="search-panel" role="search">
          <div className="search-field">
            <SearchIcon />
            <input autoFocus type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products" aria-label="Search products" />
            <button type="button" aria-label="Close search" onClick={() => setSearchOpen(false)}>
              <CloseIcon />
            </button>
          </div>
          {query.trim() && (
            <ul className="search-results">
              {results.length === 0 && <li className="search-empty">No products found</li>}
              {results.map((p) => {
                const { min, max } = priceRange(p);
                return (
                  <li key={p.id}>
                    <Link href={`/products/${p.id}`}>
                      <span className="search-thumb">
                        <Image src={p.image} alt="" fill sizes="48px" />
                      </span>
                      <span className="search-info">
                        <span className="search-name">{p.name}</span>
                        <Price min={min} max={max} className="price-sm" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {menuOpen && (
        <div className="overlay" onClick={(e) => e.target === e.currentTarget && setMenuOpen(false)}>
          <nav className="menu-drawer" aria-label="Main menu">
            <div className="menu-drawer-head">
              <Logo className="menu-logo" />
              <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
                <CloseIcon />
              </button>
            </div>
            <ul>
              {menuLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={pathname === link.href ? "is-active" : undefined} onClick={() => setMenuOpen(false)}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
