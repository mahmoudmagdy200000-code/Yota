"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Review } from "@/lib/reviews";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, StarIcon } from "./icons";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function Stars({ rating }: { rating: number }) {
  return (
    <span className="review-stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon key={n} className={n <= rating ? "is-on" : undefined} />
      ))}
    </span>
  );
}

function Avatar({ review }: { review: Review }) {
  if (review.avatar) {
    return (
      <span className="review-avatar">
        <Image src={review.avatar} alt="" fill sizes="48px" />
      </span>
    );
  }
  const initials = review.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return <span className="review-avatar review-avatar-initials">{initials}</span>;
}

function ReviewText({ text, onMore }: { text: string; onMore: () => void }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [clamped, setClamped] = useState(false);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setClamped(el.scrollHeight > el.clientHeight + 1);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [text]);
  return (
    <div className="review-body">
      <p ref={ref} className="review-text">
        {text}
      </p>
      {clamped && (
        <button type="button" className="review-more" onClick={onMore}>
          More
        </button>
      )}
    </div>
  );
}

export function Reviews({ reviews }: { reviews: Review[] }) {
  const n = reviews.length;
  // The list is rendered three times so the carousel can loop in both directions.
  const [pos, setPos] = useState(n);
  const [animate, setAnimate] = useState(true);
  const [open, setOpen] = useState<Review | null>(null);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    if (animate) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
    return () => cancelAnimationFrame(id);
  }, [animate]);

  if (!n) return null;

  const active = ((pos % n) + n) % n;
  const items = n > 1 ? [...reviews, ...reviews, ...reviews] : reviews;
  const index = n > 1 ? pos : 0;

  function go(delta: number) {
    if (n > 1) setPos((p) => p + delta);
  }

  function settle() {
    if (pos < n || pos >= 2 * n) {
      setAnimate(false);
      setPos(n + active);
    }
  }

  return (
    <section className="reviews" aria-label="Customer reviews">
      <h2 className="reviews-title">Customer Reviews</h2>
      <div
        className="reviews-viewport"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        <div
          className="reviews-track"
          style={{ "--i": index, transition: animate ? undefined : "none" } as React.CSSProperties}
          onTransitionEnd={(e) => e.target === e.currentTarget && settle()}
        >
          {items.map((review, i) => (
            <article key={i} className="review-card" aria-hidden={n > 1 && i !== index ? true : undefined}>
              <ReviewText text={review.text} onMore={() => setOpen(review)} />
              <div className="review-author">
                <Avatar review={review} />
                <div>
                  <Stars rating={review.rating} />
                  <p className="review-name">{review.name}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      {n > 1 && (
        <div className="reviews-nav">
          <button type="button" aria-label="Previous review" onClick={() => go(-1)}>
            <ChevronLeftIcon />
          </button>
          <div className="reviews-dots">
            {reviews.map((_, i) => (
              <button
                key={i}
                type="button"
                className={i === active ? "is-active" : undefined}
                aria-label={`Show review ${i + 1}`}
                aria-current={i === active}
                onClick={() => setPos(n + i)}
              />
            ))}
          </div>
          <button type="button" aria-label="Next review" onClick={() => go(1)}>
            <ChevronRightIcon />
          </button>
        </div>
      )}

      {open && (
        <div className="overlay overlay-center" onClick={(e) => e.target === e.currentTarget && setOpen(null)}>
          <div className="review-dialog" role="dialog" aria-label={`Review by ${open.name}`}>
            <button type="button" className="review-dialog-close" aria-label="Close" onClick={() => setOpen(null)}>
              <CloseIcon />
            </button>
            <p>{open.text}</p>
            <div className="review-author">
              <Avatar review={open} />
              <div>
                <Stars rating={open.rating} />
                <p className="review-name">{open.name}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
