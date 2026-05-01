# Field Guide PWA — Implementation Plan

> **How to use this file:** When you're ready to build, paste this entire document into a fresh Claude conversation with the prompt: *"Build the Field Guide PWA according to this plan. Start with Phase 0 and check in with me after each phase before continuing."* The plan is self-contained — it includes the project context, tech decisions, and a phase-by-phase build sequence.

---

## Context

**The Talus Field** is a Yosemite editorial site at `thetalusfieldjournal.com`. The current repo is a static React-via-CDN prototype (see `index.html`, `page-guide.jsx`, etc.). The site sells one product: **The Field Guide**, a $29 trip-planning guide capped at **100 sales per month**. The cap is a real constraint, not marketing — the locations the guide reveals can't absorb more volume without becoming overcrowded.

**V1 ships as a PDF.** **V2 — what this plan covers — is a buyer-only Progressive Web App (PWA)** that replaces the PDF with an offline-capable mobile experience. Existing PDF buyers get a free upgrade.

### Why a PWA instead of PDF
- Tap-to-open GPS coordinates work natively on iOS/Android (PDF coord linking is unreliable).
- Embedded maps with **offline tiles** cached for Yosemite — critical because the park has hours-long dead cell zones.
- Push silent updates through the 2026 season without users re-downloading.
- Feels like an app via "Add to Home Screen", with zero App Store overhead.

### Why not a native app
App Store fees, review delays, and ongoing maintenance aren't justified for a single-product, low-volume (≤1,200/year) audience.

---

## Tech Decisions

| Concern | Choice | Rationale |
|---|---|---|
| Frontend | **Vite + React + TypeScript** | Same React mental model as the existing prototype; Vite gives instant dev server. |
| Styling | **Tailwind + custom CSS for typography** | Tailwind for utility; the editorial typographic chrome (rules, eyebrows, EB Garamond, Source Serif) ports from the prototype's `styles.css`. |
| Hosting | **Cloudflare Pages** | Free tier; generous bandwidth; Workers at the edge for auth. |
| Auth | **Magic links via Cloudflare Worker + KV** | No passwords. KV stores buyer email → access state. Avoids Supabase as a dependency for v1. |
| Payments | **Stripe Checkout (one-time)** | Hosted, PCI-easy, webhooks reliable. |
| Maps | **MapLibre GL + raster tiles** | Free; cache tiles for the Yosemite bounding box. Vector tiles later if needed. |
| Buyer list | **Cloudflare KV** | One key per buyer for v1. |
| Domain | `guide.thetalusfieldjournal.com` | Subdomain isolates the app from the editorial site. |
| Updates | **Service worker + cache-busting on deploy** | New content auto-downloads on next launch; banner prompt for refresh. |
| Email | **Resend** | Cheapest to set up; reliable; supports Cloudflare Workers. |

---

## Phase 0 — Repo & Scaffolding

1. In this repo, create `apps/guide/` (subfolder — keeps editorial site and PWA in one repo).
2. `npm create vite@latest apps/guide -- --template react-ts`
3. Install Tailwind: `npm i -D tailwindcss postcss autoprefixer && npx tailwindcss init -p`
4. Install runtime deps: `npm i maplibre-gl @stripe/stripe-js zod react-router-dom`
5. Install PWA tooling: `npm i -D vite-plugin-pwa workbox-window`
6. Create `workers/` directory for the Cloudflare Worker (auth + Stripe webhooks). `npm i -D wrangler` at repo root.
7. Add `wrangler.toml` with KV namespace binding `GUIDE_BUYERS`.
8. Set Cloudflare Worker secrets:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `MAGIC_LINK_SIGNING_SECRET` (random 32-byte hex)
   - `RESEND_API_KEY`
9. Create the KV namespace: `wrangler kv:namespace create GUIDE_BUYERS`.

**Verify:** `npm run dev` in `apps/guide` boots a Vite app at `localhost:5173`.

---

## Phase 1 — Auth Flow

### Sequence
1. Buyer clicks "Reserve a copy" on the editorial site → redirected to **Stripe Checkout** (mode: payment, $29 line item, metadata: `product=field_guide_2026`).
2. On `checkout.session.completed`, Stripe POSTs to the Worker at `/api/stripe/webhook`.
3. The Worker:
   - Verifies the Stripe signature.
   - Generates a 64-char `accessToken` (random hex) and a 6-digit `accessCode`.
   - Writes to KV: `buyer:{email_lowercased}` → `{ purchasedAt, accessToken, accessCode, expiresAt }`. Default `expiresAt = purchase + 18 months`.
   - Sends an email via Resend with the magic link `https://guide.thetalusfieldjournal.com/open?token={accessToken}` and the 6-digit code as fallback.
4. The app at `/open` reads the token from the URL → calls `POST /api/auth/exchange` → Worker validates → returns a JWT (HMAC-SHA256, 90-day TTL) → app stores in `localStorage` AND `Cookie` (HttpOnly via response header).
5. **New-device flow:** user goes to `/login`, enters email + 6-digit code → Worker validates → issues JWT.
6. **All content endpoints** require the JWT in `Authorization: Bearer …` header.

### Files
- `workers/src/index.ts` — entry, routing (use `hono` or `itty-router`).
- `workers/src/routes/stripe.ts` — webhook handler with signature verification.
- `workers/src/routes/auth.ts` — `exchange` and `login` endpoints.
- `workers/src/lib/jwt.ts` — sign/verify with `@tsndr/cloudflare-worker-jwt`.
- `workers/src/lib/email.ts` — Resend send wrapper.
- `apps/guide/src/auth/AuthGate.tsx` — React context that reads JWT, redirects to `/login` if missing/expired.

**Verify:** trigger a test Stripe payment (Stripe CLI: `stripe listen --forward-to localhost:8787/api/stripe/webhook`) → email arrives → magic link opens app and authenticates.

---

## Phase 2 — Content Model

The guide is structured around three trip lengths (1, 3, 5 days). The atomic unit is a **stop**.

### Schema (`apps/guide/src/content/schema.ts`)

```ts
import { z } from "zod";

export const Stop = z.object({
  id: z.string(),                    // "tunnel-view-sunset"
  title: z.string(),
  trip: z.enum(["1day", "3day", "5day"]),
  day: z.number(),                   // 1, 2, 3...
  order: z.number(),                 // sort within day
  kind: z.enum(["viewpoint", "trailhead", "parking", "lodging", "meal", "drive"]),
  coord: z.tuple([z.number(), z.number()]).optional(),  // [lng, lat]
  elevationFt: z.number().optional(),
  timeBudgetMin: z.number().optional(),
  body: z.string(),                  // markdown
  photos: z.array(z.object({
    src: z.string(),                 // "/photos/tunnel-view.jpg"
    caption: z.string().optional()
  })).default([]),
  swap: z.string().optional(),       // "If full, drive to Valley View"
});

export type StopT = z.infer<typeof Stop>;
```

### Authoring
- v1: **TypeScript-typed JSON** in `apps/guide/src/content/stops.ts`. Direct edits, type safety.
- Photos: `apps/guide/public/photos/{stop-id}.jpg` at 1600px wide, 80% JPEG quality.
- v2 (later, if content grows past ~200 stops): migrate to MDX + Contentlayer or Sanity.

### Migration from PDF
- Open the existing PDF source (whatever tool it was authored in).
- Extract each stop into a `Stop` object: title, GPS coord, elevation, time budget, body text, photo references.
- Render markdown body fields with `react-markdown`.

**Verify:** schema validates the entire content collection at build time (run `tsc --noEmit`).

---

## Phase 3 — App Shell & Routes

### Routes
- `/` — hub. "How long is your trip?" → 1 day / 3 days / 5 days cards.
- `/trip/:tripId` — overview of selected trip with all days listed.
- `/trip/:tripId/day/:dayN` — vertical scroll of stops for that day.
- `/stop/:stopId` — full detail view (linked from any card).
- `/map` — full-screen map of current day or full trip.
- `/search` — search across stop titles + bodies.
- `/login` — email + 6-digit code entry.
- `/open` — magic link landing.
- `/account` — view expiry, contact link, sign out.

### UI primitives
- `<StopCard>` — photo, title, eyebrow, GPS chip, elevation, time, body markdown, swap callout.
- `<MapsLink>` — tappable GPS coord (see code below).
- `<MapChip>` — small inline map preview (one or many points).
- `<FullMap>` — full-screen MapLibre with all stops as pins.
- `<DayBar>` — sticky day-of-trip indicator with progress dots.
- `<UpdatedStamp>` — "Last updated 2026-04-30" pulled from build metadata (`import.meta.env.VITE_BUILD_DATE`).

### Tappable GPS chip

```tsx
export function MapsLink({ coord, label }: { coord: [number, number]; label: string }) {
  const [lng, lat] = coord;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const url = isIOS
    ? `maps://?ll=${lat},${lng}&q=${encodeURIComponent(label)}`
    : `https://maps.google.com/?q=${lat},${lng}`;
  return (
    <a href={url} className="gps-chip">
      {lat.toFixed(5)}, {lng.toFixed(5)} →
    </a>
  );
}
```

**Verify:** build the 1-day trip with at least 3 stops → all GPS chips open the platform Maps app on a real iOS device, real Android device, and desktop Chrome.

---

## Phase 4 — Maps & Offline Tiles

1. Initialize MapLibre. For dev: `https://demotiles.maplibre.org/style.json`. For prod: a MapTiler or Stadia Maps style (free tier).
2. `<MapChip>` renders a static-tile preview PNG (fast load) — switches to interactive on tap.
3. `<FullMap>` renders interactive MapLibre with all stops as markers, `fitBounds` to show them all.
4. **Tile caching** in the service worker:
   - Bounding box for Yosemite: `[-119.886, 37.495, -119.197, 38.193]`.
   - Cache zoom levels 10–14 inside that bbox on first authenticated load.
   - Total cache size target: < 80 MB.
5. On app boot (after auth), prompt **once**: "Download offline maps (~50 MB)? Recommended before driving in." On accept → prefetch all tiles.

**Verify:** disable device network → trip pages render → maps render from cache.

---

## Phase 5 — PWA & Offline Shell

1. Configure `vite-plugin-pwa` in `vite.config.ts`:
   ```ts
   VitePWA({
     registerType: "prompt",
     workbox: {
       globPatterns: ["**/*.{js,css,html,woff2,svg,png}"],
       runtimeCaching: [
         { urlPattern: /\/api\/content\//, handler: "StaleWhileRevalidate" },
         { urlPattern: /\.(jpg|webp)$/, handler: "CacheFirst", options: { expiration: { maxAgeSeconds: 60*60*24*90 } } },
         { urlPattern: /tiles\..+\/\d+\/\d+\/\d+/, handler: "CacheFirst", options: { expiration: { maxAgeSeconds: 60*60*24*90 } } }
       ]
     }
   })
   ```
2. Web app manifest at `public/manifest.webmanifest`:
   - `name`: "The Field Guide"
   - `short_name`: "Field Guide"
   - `display`: `standalone`
   - Theme color matching the editorial palette.
   - Icons at 192/512px.
3. Add an `<InstallPrompt>` component that fires on `beforeinstallprompt` and shows a one-time CTA.
4. Update flow: new deploy → service worker detects → app shows top banner: "Updated. Tap to refresh." → user taps → `skipWaiting` + `clients.claim` + `location.reload()`.

**Verify:** Lighthouse PWA score ≥ 90. Add to Home Screen on iOS and Android. App launches in standalone mode (no browser chrome).

---

## Phase 6 — Deployment

1. **Cloudflare Pages**: connect to this repo. Build command: `cd apps/guide && npm install && npm run build`. Output dir: `apps/guide/dist`.
2. Custom domain: `guide.thetalusfieldjournal.com`.
3. **Cloudflare Worker** for auth/payments: deploy via `wrangler deploy` from `workers/`. Bind KV namespace `GUIDE_BUYERS`. Set secrets.
4. **Stripe**: configure webhook endpoint to the Worker URL (`https://api.thetalusfieldjournal.com/api/stripe/webhook`). Subscribe to `checkout.session.completed`.
5. DNS: add `guide` and `api` CNAME records.

**Verify:** end-to-end test from real Stripe Checkout → email → magic link → app login → airplane mode → offline use.

---

## Phase 7 — Migration & Launch

1. Export the existing PDF buyer list (CSV from Stripe or wherever v1 sold).
2. Run a one-off migration script (`scripts/migrate-pdf-buyers.ts`) that, for each PDF buyer:
   - Writes `buyer:{email}` to KV.
   - Sends a Resend email: "The Field Guide is now an app. Tap to open: {magic link}."
3. Update the editorial site's `page-guide.jsx`:
   - Buy button → Stripe Checkout (no longer PDF download).
   - Add a small "Buyers from before April 2026: check your email — your guide is now an app." line.
4. Newsletter announcement.

---

## Maintenance Through 2026

- Edit `stops.ts` → `git push` → Pages auto-deploys → service worker tells users on next launch.
- For larger updates (new trip, new section), bump a `MANIFEST_VERSION` constant and force-prompt all users to refresh.
- Keep `<UpdatedStamp>` accurate — it's the user's signal that the guide is alive, not abandoned.

---

## Open Questions To Resolve Before Building

1. **Refund mechanism:** the editorial site promises "refund if it doesn't earn its keep" — is that manual (email Cory) or automated within X days?
2. **Token expiry duration:** suggest 18 months — match it to how long free updates are committed for.
3. **Sales tax / VAT:** Stripe doesn't auto-handle international VAT. If international buyers > 5%, switch to **Lemon Squeezy** (Merchant of Record, handles all tax) — fee is higher (~5% + 50¢) but less compliance work.
4. **Photo licensing:** confirm Cory has rights to all photos in the guide (he took them or has explicit permission).
5. **Monthly cap enforcement:** the $29 Stripe product needs inventory limit. Two options:
   - Use Stripe's `limit` on a Payment Link.
   - Cloudflare Worker checks KV counter before issuing new Checkout sessions; rejects with a "back on the 1st" page when the cap is hit. **Preferred** — gives more control over the sold-out UX.

---

## Testing Checklist (run before launch)

- [ ] Stripe test payment → email arrives within 60s.
- [ ] Magic link opens app, authenticates, no flicker.
- [ ] 6-digit code login works on a fresh device.
- [ ] All GPS chips open native Maps on iOS Safari, Chrome Android, desktop Chrome.
- [ ] Airplane mode → full app + maps still render.
- [ ] Lighthouse PWA score ≥ 90.
- [ ] Service worker update flow: deploy a small change, see refresh prompt, refresh works.
- [ ] App launches standalone after Add to Home Screen (no browser chrome on iOS).
- [ ] Photos lazy-load and don't block first paint.
- [ ] Cache size after first full load < 80 MB on real devices.
- [ ] Monthly cap: when 100th buyer completes Checkout, the 101st sees the "back on the 1st" page.
- [ ] Cap resets on the 1st of the next month.

---

## Estimated Effort

Solo dev, ~3–4 weeks part-time (or ~1 week full-time):

- Phase 0–1 (auth, Stripe, scaffolding): 3 days
- Phase 2 (content model + migration tools): 2 days
- Phase 3 (app shell + 3-day trip rendered): 3 days
- Phase 4 (maps + offline tiles): 3 days
- Phase 5 (PWA polish + service worker): 2 days
- Phase 6–7 (deployment + buyer migration + launch): 2 days

---

## Deferred to v2.1

- Search across stops (nice but not blocking).
- User notes / checklist features (scope creep).
- Push notifications for trail closures (interesting; big scope).
- Social features ("share this trip plan") — probably never.
- Print-to-PDF export from the app (so users can still print if they prefer paper).
