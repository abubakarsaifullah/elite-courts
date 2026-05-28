# Elite Courts website

Premium Next.js App Router website for Elite Courts Lahore. The project keeps the existing website behavior while improving maintainability, slider performance, package management, video handling, testimonials readiness, SEO, accessibility, light/dark mode, and responsive UI.

## Tech stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS v4
- Motion for subtle page and reveal transitions
- Nodemailer with Resend SMTP support
- Zod validation for the contact API

## Typography

The site uses **Manrope** as the main interface font and **Sora** for display headings. Manrope keeps package, pricing, and contact text easy to read. Sora gives hero and section headings a sharper premium sports feel without loading too many font families. Both fonts are loaded through `next/font/google` in `app/layout.tsx` with `display: "swap"`.

## Quick start

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run start
```

## Where to edit normal website content

Most editable page text lives in:

```txt
data/siteContent.ts
```

Use this file for:

- Business name, phone, WhatsApp, email, address, and social links
- Navigation labels
- SEO titles, descriptions, and keywords
- Homepage hero text
- Sports descriptions
- Amenities
- Homepage, sports, pricing, memberships, highlights, contact, privacy, and terms copy
- Contact form labels and placeholders
- Footer text

## Where to update package prices

Package prices live in one simple constants file:

```txt
data/packagePrices.ts
```

Update only the numbers when prices change. The package cards, homepage pricing highlights, memberships, savings labels, and schema price range use these constants.

## Where to edit package details

Package titles, features, availability, WhatsApp messages, badges, promotion labels, and section grouping live in:

```txt
data/packages.ts
```

To add a new package:

1. Add a new price constant in `data/packagePrices.ts`.
2. Copy an existing package object in `data/packages.ts`.
3. Give the package a unique `id`.
4. Use the relevant price constant.
5. Add that package `id` to the correct `packageSections` group.

To remove a package, delete the package object and remove its `id` from `packageSections`.

## Announcement marquee and new packages

The announcement marquee appears below the header on every page. Its fallback text and behavior are managed in:

```txt
data/announcements.ts
```

The marquee automatically reads visible packages from `data/packages.ts` and can show short messages for:

- Newly added packages marked with `badge: "New"`
- Discounted packages with an original price and discounted price
- Popular, Best Value, and Recommended packages

New package cards are also highlighted on the homepage automatically. To mark a package as newly added, set this in the package object:

```ts
badge: "New"
```

The public label displays as **Just Added** so it feels more polished for customers while keeping the package data simple.


## Homepage slider images

Optimized slider images are stored in:

```txt
public/images/slider/
```

Slider items are configured in:

```txt
data/sliderImages.ts
```

Recommended slider image guidelines:

- Best size: 1920 x 1080 px
- Minimum size: 1600 x 900 px
- Aspect ratio: 16:9
- Format: WebP preferred, JPG acceptable
- Keep each image optimized, ideally below 500 KB to 800 KB
- Use real, clear, high-quality Elite Courts sports or facility photos

High-resolution source images should be optimized into WebP files for the live slider. Large original files can be kept outside `public/` in `media-source/slider-originals/` so they are not deployed as live website assets.

## Highlights / videos page

Video entries are managed in:

```txt
data/videos.ts
```

The page supports:

- Local MP4 videos
- YouTube videos and Shorts
- TikTok videos
- Instagram embeds
- External video links

Video files should be placed in:

```txt
public/videos/
```

Video thumbnails should be placed in:

```txt
public/videos/thumbnails/
```

Videos do not autoplay. A video player loads only after the visitor clicks a card. When a second video is opened, the previous player is removed, which stops the previous video and keeps the page lighter. TikTok videos use a click-to-load embed with an "Open original" fallback because TikTok controls embed reliability across browsers.

Recommended video guidance:

- Local format: MP4
- Recommended resolution: 1080p
- Compress videos for web performance
- Recommended thumbnail size: 1280 x 720 px
- WebP thumbnails preferred, JPG acceptable

## Logo and favicon

The header and footer use:

```txt
public/brand/elite-courts-logo.webp
```

The original uploaded logo remains in the same folder for reference. The favicon is circular SVG:

```txt
app/favicon.svg
app/icon.svg
public/favicon.svg
```

Recommended replacement logo:

- Square canvas, minimum 512 x 512 px
- PNG or WebP
- Clear mark in the center
- Enough padding for a circular frame
- Avoid tiny text that becomes unreadable in the header

## Testimonials and Google reviews

Testimonials are handled in:

```txt
data/testimonials.ts
components/testimonials-section.tsx
lib/google-reviews.ts
```

The safest implementation is integration-ready:

- If `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID` are configured, the homepage fetches available reviews from the official Google Places API on the server.
- If API credentials are not configured, the site does not show fake reviews. It shows a clean setup card and a Google Maps link.
- Manual testimonials can be added to `data/testimonials.ts`, but only real approved customer comments should be added.

Google review environment variables:

```txt
GOOGLE_PLACES_API_KEY=
GOOGLE_PLACE_ID=
```

Google Maps attribution is shown when live Google review content is displayed.

## Contact form and Resend SMTP setup

The contact form posts to:

```txt
app/api/contact/route.ts
```

It validates name, email, phone, subject, and message with Zod, includes a hidden honeypot field, and applies a small in-memory rate limit.

Environment variables:

```txt
NEXT_PUBLIC_SITE_URL=https://elitecourts.com.pk
RESEND_API_KEY=
RESEND_SMTP_PORT=465
CONTACT_RECEIVER_EMAIL=elitecourtspadel@gmail.com
CONTACT_SENDER_EMAIL="Elite Courts <noreply@elitecourts.com.pk>"
```

How to configure Resend:

1. Create or log in to a Resend account.
2. Add and verify the sender domain you want to use.
3. Create an API key in Resend.
4. Copy `.env.example` to `.env.local`.
5. Add the API key to `RESEND_API_KEY`.
6. Set `CONTACT_RECEIVER_EMAIL` to the business inbox.
7. Set `CONTACT_SENDER_EMAIL` to an email address on the verified sender domain.
8. Restart the dev server and submit a test message from `/contact`.

Recommended improvement: add Cloudflare Turnstile or reCAPTCHA before launch if spam increases.

## SEO notes

The project includes:

- Per-page metadata through `buildMetadata`
- Open Graph and Twitter/X card metadata
- Canonical URLs
- Sitemap at `/sitemap.xml`
- Robots file at `/robots.txt`
- Local business JSON-LD on the homepage
- Natural local SEO keywords for Elite Courts, padel in Lahore, pickleball in Lahore, cricket bowling machine Lahore, badminton Lahore, and table tennis Lahore
- Image alt text and semantic section headings

## Testing checklist

Before deployment, run:

```bash
npm run lint
npm run build
```

Then verify:

- Homepage slider transitions, arrows, dots, touch/swipe, and CTA buttons
- Header phone, WhatsApp, mobile menu, logo, and theme toggle
- Sports cards and pricing links
- Pricing package sections and WhatsApp messages
- Membership cards
- Highlights page filters, click-to-play behavior, and TikTok fallback links
- Only one video player stays active at a time
- Testimonials section with and without Google API credentials
- Contact form validation and email delivery
- Privacy Policy and Terms pages
- Footer social links and icons
- Mobile layout at common phone widths
- Tablet, laptop, desktop, and large screen layouts
- Sitemap and robots URLs

## Deployment notes

- Use Node.js 20.9 or newer.
- Set all production environment variables in your hosting platform.
- Verify the Resend sender domain before using a custom sender email.
- Add Google Places API credentials only on the server if live reviews are desired.
- Replace or refresh media with optimized real facility photos and videos before final public launch.

## Booking chatbot and admin portal

The website includes a rule-based booking chatbot and an admin portal at:

```txt
/portal
```

The chatbot creates pending booking requests in Google Calendar. The admin portal lets the owner view requests and update booking status.

Setup instructions are documented in:

```txt
BOOKING_SETUP.md
```

Important booking files:

```txt
data/chatbotMessages.ts
data/sports.ts
data/bookingDurations.ts
data/bookingStatuses.ts
data/businessHours.ts
lib/regex.ts
lib/googleCalendar.ts
lib/portalAuth.ts
```

Required environment variables are listed in `.env.example`.

## Booking chatbot and admin portal

The project includes a rule-based booking chatbot and `/portal` admin area backed by Google Calendar API. See `BOOKING_SETUP.md` for complete setup, environment variables, admin password hash generation, Google Calendar sharing, business hours, cookies, and production testing notes.

## Booking system documents

For booking and admin portal behavior, see:

- `BOOKING_SETUP.md` — Google Calendar, environment variables, and setup.
- `BOOKING_LOGIC.md` — slot generation, prices, sports, timings, and WhatsApp notification template.
- `ADMIN_PORTAL.md` — admin login/session limits, refresh behavior, and create/edit/delete rules.
