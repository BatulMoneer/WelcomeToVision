# ToVision Angular landing page

Angular 20, plain CSS, lazy-loaded HomeModule, separate HeaderModule and FooterModule, and a Node/Express SMTP backend.

## Setup

Use Node 22.12+ or Node 24.

```bash
npm install
```

Copy `.env.example` to `.env` and enter your mail provider's real SMTP host, username, password, port and verified sender. Keep `.env` on the server only. Never put SMTP credentials in Angular files. The notification recipient is fixed in server/app.mjs to info@tovision.sa. The visitor is set as Reply-To, never From.

Start the backend:

```bash
npm run server
```

In a second terminal:

```bash
npm start
```

Open http://localhost:4200. The Angular development proxy forwards /api requests to localhost:3000.

## Production

```bash
npm run build
npm run server
```

The Node server serves both the production Angular build and /api/interest on port 3000. Deploy behind HTTPS. This version requires a Node server; static-only hosting cannot send notifications. If using a trusted reverse proxy, set TRUST_PROXY_HOPS to the exact trusted hop count so rate limiting identifies visitors correctly. The included limiter is per process; use a shared store for multiple instances.

For port 465 use SMTP_SECURE=true; for port 587 use SMTP_SECURE=false (STARTTLS required). SMTP_FROM must be a sender your provider permits. Set PORT as needed.

## Form behavior

Clicking Contact us or pressing Enter validates the address and POSTs it to /api/interest. Merely typing does not submit. The server sends a plain-text interest notification to info@tovision.sa and returns success only after SMTP accepts that recipient. SMTP acceptance does not guarantee inbox delivery. Missing credentials, rejected messages and SMTP errors return failure. There is no mailto fallback and no lead database.

The endpoint includes server-side email validation, a small request body limit, a bot honeypot, and a five-attempts-per-15-minutes IP limit. The button disables while sending and exposes status feedback. Tests use mocked email transport and do not send real messages.

## Fonts and design

The source PDF was inspected for font names and text usage. Local @font-face declarations load Montserrat Arabic Light (300) and Bold (700), plus Expo Arabic Light (300), Book (400), Medium (500), and Bold (700). Montserrat is used for the hero and English footer; Expo is used for the introduction and resource labels. No external font service is required. Other supplied families appear within the original logo/profile artwork, which remains preserved as PDF crops; they are not downloaded unnecessarily as web fonts.

The logo links to https://tovision.sa/ in the same tab. Original resource and social destinations remain from the PDF. Text is editable HTML. The About section keeps English and Arabic side by side at every width. Its two semantic articles share five CSS subgrid rows (label, heading, and three paragraphs), so corresponding text starts together even when one translation wraps onto more lines. Resource cards and footer blocks still stack on mobile. Requires a browser with CSS subgrid support (current Chrome, Edge, Firefox, and Safari).

## Files

- src/app/home/: HomeModule, hero, contact form, introduction, resource cards.
- src/app/header/: HeaderModule and company logo link.
- src/app/footer/: FooterModule, contact and social links.
- src/styles.css: font declarations and global CSS.
- public/fonts/: supplied fonts used in live text.
- public/assets/: original artwork crops.
- server/: backend, SMTP configuration, and API tests.
- .env.example: SMTP setup template.

## Validation

Run `npm run build` and `npm run test:server`. Real email delivery requires your SMTP credentials and has not been tested. Browser visual checks were unavailable in the execution environment.
