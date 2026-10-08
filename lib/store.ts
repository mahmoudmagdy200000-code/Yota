// Store-wide settings shown in the header, footer, cart and checkout.
// Fill in the contact links before launch — any link left empty is shown as a plain icon.
export const store = {
  name: "YŌTA Candles",
  description: "YŌTA is a nature-inspired brand creating premium scents for calm living",
  currency: "EGP",
  deliveryFee: 70,
  freeDeliveryFrom: 1500,
  deliveryTime: "Delivery within 1–7 working days",
  contact: {
    phone: "", // e.g. "+201001234567"
    whatsapp: "", // e.g. "201001234567" (country code, no + or spaces)
    facebook: "", // full page URL
    instagram: "", // full profile URL
  },
};

export function deliveryFor(subtotal: number) {
  return subtotal >= store.freeDeliveryFrom ? 0 : store.deliveryFee;
}

export function formatPrice(value: number) {
  return value.toLocaleString("en-US");
}

export const contactLinks = {
  phone: store.contact.phone ? `tel:${store.contact.phone.replace(/\s+/g, "")}` : "",
  whatsapp: store.contact.whatsapp ? `https://wa.me/${store.contact.whatsapp.replace(/\D/g, "")}` : "",
  facebook: store.contact.facebook,
  instagram: store.contact.instagram,
};

export const governorates = [
  "Cairo", "Giza", "Alexandria", "Qalyubia", "Gharbia", "Dakahlia", "Sharqia", "Port Said", "Ismailia",
  "Suez", "Faiyum", "Beni Suef", "Minya", "Asyut", "Sohag", "Qena", "Luxor", "Aswan", "Red Sea", "Matrouh",
  "North Sinai", "South Sinai", "New Valley", "Monufia", "Beheira", "Kafr El Sheikh", "Damietta",
];
