# YŌTA Candles Store

Next.js storefront for YŌTA Candles, styled to match the store's Sllr theme (header with centered logo, product grid with "2 Sizes / EGP 400 - 600" cards, Sale banner, Customer Reviews carousel, footer with contact icons and the floating chat button). It adds product pages, a cart, cash-on-delivery checkout and a server-side Google Sheets order handoff.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Pages

| Route | What it shows |
| --- | --- |
| `/` | Hero banner ("Our New Collection is Here!") and the Customer Reviews carousel |
| `/shop` | All products with product count, Filter by (price, size) and Sort by |
| `/sale` | Products marked `onSale`, under the black Sale banner |
| `/products/[id]` | Photo, size and quantity pickers, Add to cart / Buy it now |
| `/cart`, `/checkout` | Cart and cash-on-delivery checkout (posts to `/api/orders`) |
| `/info` | Delivery and payment details (the footer's "More info") |

## Editing the store

- **Products** — `lib/products.ts`. The live store lists 9 products; only the 4 whose photos and names were visible are included. Add the rest in the same shape and put their photos in `public/products/`. Set `onSale: true` to list a product on `/sale`.
- **Contact links** — `lib/store.ts` (`phone`, `whatsapp`, `facebook`, `instagram`). They power the footer icons and the chat button. Empty links show as plain icons.
- **Delivery** — `lib/store.ts`: flat `deliveryFee` (EGP 70), free from `freeDeliveryFrom` (EGP 1,500). The checkout and the order API both use these values.
- **Customer reviews** — `lib/reviews.ts`. Add real reviews (name, text, rating, optional photo). The carousel stays hidden while the list is empty.
- **Hero and Sale banner images** — `public/images/hero.jpg` and `public/images/sale-banner.jpg`. Replace them with higher-resolution originals if you have them.
- **Font** — Rubik, self-hosted from `public/fonts/rubik.woff` (SIL Open Font License, see `public/fonts/RUBIK-OFL.txt`).

## Connect Google Sheets

1. Create a Google Sheet and open **Extensions → Apps Script**.
2. Paste `google-apps-script/Code.gs` into `Code.gs` and save.
3. In Apps Script, open **Project Settings → Script Properties** and add `ORDER_SECRET` with a long random value.
4. Choose **Deploy → New deployment → Web app**. Execute as **Me** and allow access to **Anyone**. Authorize it, then copy the deployment URL ending in `/exec`.
5. In Vercel project settings, add `SHEETS_WEBHOOK_URL` (the `/exec` URL) and `SHEETS_WEBHOOK_SECRET` (the same value as `ORDER_SECRET`). Add them for Production and Preview as needed, then redeploy.

The Apps Script creates an `Orders` tab and adds its headings the first time an order arrives. The server route keeps the secret out of browser code. Do not place either secret in a `NEXT_PUBLIC_` variable.

## Deploy to Vercel

Import this repository in Vercel, keep the default Next.js build settings, add the two environment variables above, and deploy. The storefront can be reviewed before configuring the Sheets variables, but checkout returns an error until the order endpoint is connected.

## Before launch

- Add the remaining products and confirm sizes, prices and descriptions.
- Fill in the contact links in `lib/store.ts`.
- Add real customer reviews in `lib/reviews.ts` (or leave the list empty to hide the section).
- Place a test order after connecting the Sheet and verify it appears in the `Orders` tab.
