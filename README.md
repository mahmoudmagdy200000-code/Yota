# YŌTA Candles Store

Mobile-first candle shop prepared for Vercel. The store includes a product catalogue, size selection, shopping bag, cash-on-delivery checkout and a server-side Google Sheets order handoff.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

The four products in `lib/products.ts` are the ones whose names and photos were readable in the supplied screenshots. Update their names, weights and prices against the seller's final catalogue before taking live orders. Add the other products to this same file. Delivery is currently a flat EGP 70 and is set in `app/page.tsx`.

## Connect Google Sheets

1. Create a Google Sheet and open **Extensions → Apps Script**.
2. Paste `google-apps-script/Code.gs` into `Code.gs` and save.
3. In Apps Script, open **Project Settings → Script Properties** and add `ORDER_SECRET` with a long random value.
4. Choose **Deploy → New deployment → Web app**. Execute as **Me** and allow access to **Anyone**. Authorize it, then copy the deployment URL ending in `/exec`.
5. In Vercel project settings, add `SHEETS_WEBHOOK_URL` (the `/exec` URL) and `SHEETS_WEBHOOK_SECRET` (the same value as `ORDER_SECRET`). Add them for Production and Preview as needed, then redeploy.

The Apps Script creates an `Orders` tab and adds its headings the first time an order arrives. The server route keeps the secret out of browser code. Do not place either secret in a `NEXT_PUBLIC_` variable.

## Deploy to Vercel

Push this folder to the Git repository, import that repository in Vercel, keep the default Next.js build settings, add the two environment variables above, and deploy. The storefront can be reviewed before configuring the Sheets variables, but checkout intentionally remains unavailable until the order endpoint is connected.

## Before launch

- Confirm product catalogue, sizes, prices, scent descriptions and delivery fees.
- Replace the Instagram profile URL in `app/page.tsx` with the store's account.
- Place a test order after connecting the Sheet and verify it appears in the `Orders` tab.
