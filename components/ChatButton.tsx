"use client";

import { useEffect, useState } from "react";
import { contactLinks } from "@/lib/store";
import { ChatIcon, CloseIcon, FacebookIcon, InstagramIcon, PhoneIcon, WhatsAppIcon } from "./icons";

const channels = [
  { key: "whatsapp", label: "Chat on WhatsApp", href: contactLinks.whatsapp, Icon: WhatsAppIcon },
  { key: "phone", label: "Call us", href: contactLinks.phone, Icon: PhoneIcon },
  { key: "instagram", label: "Message us on Instagram", href: contactLinks.instagram, Icon: InstagramIcon },
  { key: "facebook", label: "Message us on Facebook", href: contactLinks.facebook, Icon: FacebookIcon },
].filter((c) => c.href);

export function ChatButton() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {open && (
        <div className="chat-panel" role="dialog" aria-label="Contact us">
          <div className="chat-panel-head">
            <strong>Contact us</strong>
            <button type="button" aria-label="Close" onClick={() => setOpen(false)}>
              <CloseIcon />
            </button>
          </div>
          {channels.length ? (
            <ul>
              {channels.map(({ key, label, href, Icon }) => (
                <li key={key}>
                  <a href={href} target={key === "phone" ? undefined : "_blank"} rel="noreferrer">
                    <Icon />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>We&apos;ll add our contact details here soon.</p>
          )}
        </div>
      )}
      <button className="chat-button" type="button" aria-label={open ? "Close contact options" : "Contact us"} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <ChatIcon />
      </button>
    </>
  );
}
