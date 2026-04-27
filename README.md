# Elite Courts website

Premium Next.js App Router website for Elite Courts Lahore, using centralized content, centralized package data, a configurable homepage slider, a future-ready videos page, light/dark theme support, page transitions, local SEO metadata, and a secure server-side contact form.

## Tech stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS v4
- Motion for subtle page and reveal transitions
- Nodemailer with Resend SMTP support
- Zod validation for the contact API


## Typography

The site uses Manrope as the main interface font and Sora as the display font for headings. Manrope keeps long pricing, package, and contact text easy to read, while Sora gives hero and section headings a sharper premium sports feel without slowing the site down with too many font families. Both fonts are loaded through `next/font/google` in `app/layout.tsx` with `display: "swap"`.

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

Most editable text lives in:

```txt
data/siteContent.ts
```

Use this file for:

- Business name, phone, WhatsApp, email, address, and social links
- Navigation labels
- SEO titles, descriptions, and keywords
- Homepage hero text and slider configuration
- Sports descriptions
- Amenities
- Homepage, sports, pricing, memberships, videos, contact, privacy, and terms copy
- Contact form labels and placeholders
- Footer text

## Where to edit packages, prices, discounts, and memberships

All package and pricing data lives in:

```txt
data/packages.ts
```

Each package supports:

- `id`
- `sport`
- `packageType`
- `title`
- `subtitle`
- `description`
- `originalPrice`
- `discountedPrice`
- `currency`
- `priceSuffix`
- `duration`
- `availability`
- `promotionLabel`
- `badge`
- `isPopular`
- `isRecommended`
- `features`
- `terms`
- `whatsappMessage`

To add a new package, add it to `packages`, then add the package `id` to the correct section in `packageSections`.

## Homepage slider images

Slider files are stored in:

```txt
public/images/slider/
```

Slider items are configured in:

```txt
data/siteContent.ts -> siteContent.hero.slides
```

Recommended slider image guidelines:

- Best size: 1920 x 1080 px
- Minimum size: 1600 x 900 px
- Aspect ratio: 16:9
- Format: WebP preferred, JPG acceptable
- Keep each image optimized, ideally under 500 KB where possible
- Use real, high-quality Elite Courts sports or facility photos

## Videos page

Video files should be placed in:

```txt
public/videos/
```

Video thumbnails should be placed in:

```txt
public/videos/thumbnails/
```

Video entries are managed in:

```txt
data/videos.ts
```

Recommended video guidance:

- Format: MP4
- Recommended resolution: 1080p
- Use compressed files for web performance
- Recommended thumbnail size: 1280 x 720 px
- WebP thumbnails preferred, JPG acceptable

The Videos page appears in the main navigation and will show an empty state until real video entries are added.

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

## Media replacement notes

The current project includes organized SVG sports visuals and slider placeholders. Replace them with real optimized Elite Courts photos when available. Keep the same paths or update `data/siteContent.ts`.

## Testing checklist

Before deployment, run:

```bash
npm run lint
npm run build
```

Then verify:

- Homepage slider transitions, arrows, and dots
- Header phone, WhatsApp, mobile menu, and theme toggle
- Sports cards and pricing links
- Pricing package sections and WhatsApp messages
- Membership cards
- Videos page empty state or added videos
- Contact form validation and email delivery
- Privacy Policy and Terms pages
- Mobile layout at common phone widths
- Sitemap and robots URLs

## Deployment notes

- Use Node.js 20.9 or newer.
- Set all production environment variables in your hosting platform.
- Verify the Resend sender domain before using a custom sender email.
- Replace placeholder media with optimized real facility photos and videos before final public launch.
