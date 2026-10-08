import Link from "next/link";

type Crumb = { href: string; label: string };

export function PageHead({ trail, title }: { trail: Crumb[]; title?: string }) {
  return (
    <div className="page-head">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        {trail.map((crumb) => (
          <span key={crumb.href}>
            <Link href={crumb.href}>{crumb.label}</Link>
            <span className="breadcrumb-sep" aria-hidden="true"> /</span>{" "}
          </span>
        ))}
      </nav>
      {title && <h1 className="page-title">{title}</h1>}
    </div>
  );
}
