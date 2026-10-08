import { formatPrice } from "@/lib/store";

export function Price({ min, max, className }: { min: number; max?: number; className?: string }) {
  return (
    <p className={className ? `price ${className}` : "price"}>
      <span className="price-currency">EGP</span> {formatPrice(min)}
      {max !== undefined && max !== min ? ` - ${formatPrice(max)}` : null}
    </p>
  );
}
