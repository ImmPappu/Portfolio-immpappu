# Pappu Kumar — Portfolio

A premium, production-grade personal portfolio for Pappu Kumar — built with TanStack Start, React 19, Tailwind CSS v4, and Motion.

## Stack

- **Framework**: TanStack Start (React SSR) + TanStack Router (file-based)
- **Styling**: Tailwind CSS v4 + custom design tokens (dark, brand-green / brand-cyan / brand-blue palette)
- **Animations**: Motion (Framer Motion v12) + Lenis smooth scroll
- **UI components**: Radix UI (via shadcn/ui) + Lucide icons
- **Contact**: EmailJS (`@emailjs/browser`)
- **Build**: Vite 8 + `@lovable.dev/vite-tanstack-config`
- **Dev server**: port 5000, host 0.0.0.0 (configured for Replit preview)

## Running

```bash
npm run dev        # Start dev server on http://localhost:5000
npm run build      # Build for production (Cloudflare / Vercel)
npm run lint       # ESLint
npm run format     # Prettier
```

## Key files

- `src/routes/index.tsx` — entire portfolio page (hero, about, skills, projects, timeline, certifications, coding dashboard, contact)
- `src/routes/__root.tsx` — root layout, SEO meta tags, JSON-LD
- `vite.config.ts` — Vite config (port 5000 override for Replit)
- `public/Pappu_Kumar_Resume.pdf` — resume download
- `src/assets/pappu-kumar.jpg.asset.json` — hero profile photo (Lovable asset, with PK initials fallback)

## Environment variables

| Variable                   | Purpose             |
| -------------------------- | ------------------- |
| `VITE_EMAILJS_SERVICE_ID`  | EmailJS service ID  |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template ID |
| `VITE_EMAILJS_PUBLIC_KEY`  | EmailJS public key  |

Set in Replit Secrets. All three must be present for the contact form to send emails; if missing, a `mailto:` fallback is used and a console warning is shown.

## Production

Deployed at **https://portfolio-immpappu.vercel.app**

## User preferences

- Do not change the dark color palette or branding
- Do not alter portfolio content, projects, or resume
- Keep animations that improve UX
- Avoid unnecessary dependencies — explain before adding any
- Code quality should match Vercel / Stripe / Linear standards
