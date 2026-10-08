"use client";

import { useEffect, useMemo, useState } from "react";
import { priceRange, type Product } from "@/lib/products";
import { ChevronDownIcon, CloseIcon, FilterIcon } from "./icons";
import { ProductCard } from "./ProductCard";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
];

type Filters = { min: string; max: string; sizes: string[] };
const noFilters: Filters = { min: "", max: "", sizes: [] };

export function ProductGrid({ products }: { products: Product[] }) {
  const [sort, setSort] = useState("featured");
  const [filters, setFilters] = useState<Filters>(noFilters);
  const [draft, setDraft] = useState<Filters>(noFilters);
  const [sheetOpen, setSheetOpen] = useState(false);

  const sizes = useMemo(() => Array.from(new Set(products.flatMap((p) => p.prices.map((v) => v.label)))), [products]);
  const activeCount = (filters.min || filters.max ? 1 : 0) + filters.sizes.length;

  const visible = useMemo(() => {
    const min = filters.min ? Number(filters.min) : -Infinity;
    const max = filters.max ? Number(filters.max) : Infinity;
    const list = products.filter((p) => {
      const variants = filters.sizes.length ? p.prices.filter((v) => filters.sizes.includes(v.label)) : p.prices;
      return variants.some((v) => v.price >= min && v.price <= max);
    });
    const byPrice = (p: Product) => priceRange(p).min;
    if (sort === "price-asc") return [...list].sort((a, b) => byPrice(a) - byPrice(b));
    if (sort === "price-desc") return [...list].sort((a, b) => byPrice(b) - byPrice(a));
    if (sort === "name-asc") return [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "name-desc") return [...list].sort((a, b) => b.name.localeCompare(a.name));
    return list;
  }, [products, filters, sort]);

  useEffect(() => {
    document.body.style.overflow = sheetOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheetOpen]);

  function openSheet() {
    setDraft(filters);
    setSheetOpen(true);
  }

  return (
    <section className="collection">
      <div className="collection-toolbar">
        <p className="collection-count">
          {visible.length} {visible.length === 1 ? "Product" : "Products"}
        </p>
        <div className="collection-actions">
          <button type="button" className="toolbar-button" onClick={openSheet}>
            Filter by{activeCount ? ` (${activeCount})` : ""} <FilterIcon className="filter-icon" />
          </button>
          <label className="toolbar-button sort-control">
            Sort by <ChevronDownIcon className="sort-icon" />
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort by">
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {visible.length ? (
        <div className="product-grid">
          {visible.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 4} />
          ))}
        </div>
      ) : (
        <div className="collection-empty">
          <p>No products match these filters.</p>
          <button type="button" className="button button-outline" onClick={() => setFilters(noFilters)}>
            Clear filters
          </button>
        </div>
      )}

      {sheetOpen && (
        <div className="overlay overlay-bottom" onClick={(e) => e.target === e.currentTarget && setSheetOpen(false)}>
          <div className="sheet" role="dialog" aria-label="Filter products">
            <div className="sheet-head">
              <strong>Filter by</strong>
              <button type="button" aria-label="Close" onClick={() => setSheetOpen(false)}>
                <CloseIcon />
              </button>
            </div>
            <fieldset className="sheet-group">
              <legend>Price (EGP)</legend>
              <div className="price-inputs">
                <input type="number" inputMode="numeric" min={0} placeholder="From" value={draft.min} onChange={(e) => setDraft({ ...draft, min: e.target.value })} />
                <span>-</span>
                <input type="number" inputMode="numeric" min={0} placeholder="To" value={draft.max} onChange={(e) => setDraft({ ...draft, max: e.target.value })} />
              </div>
            </fieldset>
            {sizes.length > 1 && (
              <fieldset className="sheet-group">
                <legend>Size</legend>
                <div className="chip-row">
                  {sizes.map((size) => {
                    const on = draft.sizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        className={on ? "chip is-selected" : "chip"}
                        aria-pressed={on}
                        onClick={() => setDraft({ ...draft, sizes: on ? draft.sizes.filter((s) => s !== size) : [...draft.sizes, size] })}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}
            <div className="sheet-actions">
              <button type="button" className="button button-outline" onClick={() => setDraft(noFilters)}>
                Clear
              </button>
              <button
                type="button"
                className="button button-dark"
                onClick={() => {
                  setFilters(draft);
                  setSheetOpen(false);
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
