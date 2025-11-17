## Overview

3links is a small Next.js 16 application that turns 1-3 public Odoo quotation links into a polished HTML email ready for sales teams. A dedicated API route proxies the remote HTML, parses the commercial data with Cheerio, and feeds a set of Tailwind-driven React components plus exportable email templates.

## Key features

- **Next.js App Router + TypeScript** with modular components, hooks, and server actions.
- **Tailwind CSS v4** for the UI shell plus custom utilities for gradients and cards.
- **Server-side proxy** at `POST /api/fetch-quotation` that bypasses CORS, validates URLs, and parses totals with Cheerio.
- **Three reusable email templates** (cards, compact table, minimal) rendered live inside the app and exported as full HTML.
- **Client hook orchestration** (`useQuotationGenerator`) for validation, status handling, and HTML generation.

## Getting started

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to use the generator.

## Environment

No secrets are required because users paste signed Odoo quotation URLs manually. If you later need to inject headers or cookies, expose them to the API route through `.env.local` and read them inside `src/app/api/fetch-quotation/route.ts`.

## Development workflow

| Command        | Description                                   |
| -------------- | --------------------------------------------- |
| `npm run dev`  | Start the Next.js development server          |
| `npm run lint` | Run ESLint (includes Next.js core web vitals) |
| `npm run build`/`start` | Production build and serve          |

## API contract

```
POST /api/fetch-quotation
Body: { "urls": ["https://www.odoo.com/my/orders/..."] } // 1-3 entries
Response: { "plans": QuotationPlan[] }
```

Each plan contains the parsed totals, quantities, payment terms, savings breakdown, and the CTA URL that points back to the original quotation.

## Project structure

- `src/app/page.tsx` – Shell that renders the `QuotationGenerator`.
- `src/components/quotation/*` – Form controls, preview panel, and UI primitives.
- `src/components/email-templates/*` – Pure functions that build the different email layouts.
- `src/hooks/*` – Validation and orchestration logic.
- `src/lib/parsers/*` – HTML parsing utilities and type definitions.
- `legacy/` – Original static prototype retained for reference only.
