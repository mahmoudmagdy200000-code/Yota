import Image from "next/image";
import Link from "next/link";
import { Reviews } from "@/components/Reviews";
import { reviews } from "@/lib/reviews";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <Image src="/images/hero.jpg" alt="" fill priority sizes="100vw" />
        <div className="hero-copy">
          <h1>Our New Collection is Here!</h1>
          <p>Don’t miss out on our new collection. Shop our latest products and get the best offers.</p>
          <Link href="/shop" className="hero-button">
            Shop Now
          </Link>
        </div>
      </section>
      <Reviews reviews={reviews} />
    </>
  );
}
