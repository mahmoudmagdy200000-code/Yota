import Link from "next/link";
import { contactLinks, store } from "@/lib/store";
import { FacebookIcon, InstagramIcon, PhoneIcon, WhatsAppIcon } from "./icons";

const social = [
  { key: "phone", label: "Call us", href: contactLinks.phone, Icon: PhoneIcon },
  { key: "whatsapp", label: "WhatsApp", href: contactLinks.whatsapp, Icon: WhatsAppIcon },
  { key: "facebook", label: "Facebook", href: contactLinks.facebook, Icon: FacebookIcon },
  { key: "instagram", label: "Instagram", href: contactLinks.instagram, Icon: InstagramIcon },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-social">
        {social.map(({ key, label, href, Icon }) =>
          href ? (
            <a key={key} href={href} aria-label={label} target={key === "phone" ? undefined : "_blank"} rel="noreferrer">
              <Icon />
            </a>
          ) : (
            <span key={key} aria-label={label} role="img">
              <Icon />
            </span>
          ),
        )}
      </div>
      <p className="footer-delivery">
        {store.deliveryTime} • <Link href="/info">More info</Link>
      </p>
      <div className="footer-bottom">
        <div className="footer-payments" aria-label="Payment methods">
          <span className="payment-cash">CASH</span>
        </div>
        <div className="footer-meta">
          <span>© {new Date().getFullYear()}, {store.name}</span>
        </div>
      </div>
    </footer>
  );
}
