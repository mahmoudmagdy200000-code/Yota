import Link from "next/link";

export default function NotFound() {
  return (
    <div className="empty-state empty-state-page">
      <h1>Page not found</h1>
      <p>The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/shop" className="button button-dark">
        Go to shop
      </Link>
    </div>
  );
}
