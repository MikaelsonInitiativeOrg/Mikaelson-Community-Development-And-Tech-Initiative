# Mikaelson Initiative website

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-Private-red)

**Building the habits, knowledge, communities and capacity behind the people who will build what Africa becomes.**

[mikaelsoninitiative.org](https://mikaelsoninitiative.org) • [Report a bug](https://github.com/Mikaelson-1/Mikaelson-Innovation-and-Community-Development-Initiative/issues)

</div>

---

The public website of the **Mikaelson Initiative**, a youth and community
development non-profit in Lagos, Nigeria. It is the home of four parts of
one ecosystem: the **Mikaelson School Club**, **Mikaelson Labs**, the
**Partnership & Growth Network** and the **Mikaelson Institute**.

> **Redesign:** the site was redesigned in 2026. Before you change a page,
> read **[docs/REDESIGN.md](docs/REDESIGN.md)**: the design system,
> colours, type, the signature scroll line, motion rules, every page's
> design and why, and what was tried and dropped.

## Contents

- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Pages](#pages)
- [Project structure](#project-structure)
- [Design system in brief](#design-system-in-brief)
- [Content: the blog](#content-the-blog)
- [Forms and payments](#forms-and-payments)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack), [React 19](https://react.dev/), TypeScript 5 |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/), CSS modules for motion, `tailwind-merge`, `class-variance-authority` |
| Motion | [Motion](https://motion.dev/) (`motion/react`) and plain CSS transitions/keyframes |
| UI | [Radix UI](https://www.radix-ui.com/) (accordion, dialog, dropdown), [Lucide](https://lucide.dev/) icons, [Sonner](https://sonner.emilkowal.ski/) toasts, `react-country-flag` |
| Content | In-house Editorial Studio (`/studio`) backed by [Neon Postgres](https://neon.tech/) |
| Forms | React Hook Form + Zod |
| Theme | `next-themes` (light and dark) |

## Getting started

**Prerequisites:** Node.js 20+ and npm.

```bash
git clone https://github.com/Mikaelson-1/Mikaelson-Innovation-and-Community-Development-Initiative.git
cd Mikaelson-Innovation-and-Community-Development-Initiative
npm install
```

Create `.env.local` in the project root (it is gitignored):

```env
# database: Neon Postgres connection string (auto-injected on Vercel)
DATABASE_URL=postgres://user:password@ep-example.region.neon.tech/neondb?sslmode=require
# studio admin access passkey (defaults to mikaelson2026 if unset)
STUDIO_ADMIN_PASSKEY=your_passkey_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# server only: organisation payments (use an sk_test_ key locally)
PAYSTACK_SECRET_KEY=sk_test_xxx
# transactional emails
RESEND_API_KEY=re_xxx
# optional
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
```

Run it:

```bash
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint
npx tsc --noEmit # type check
```

## Pages

| Route | What it is |
| --- | --- |
| `/` | Home: centred hero with Uli line art, Our Ecosystem, Who we serve, Walk with us, latest stories |
| `/about-us` | Mission, story, SDGs and team summary |
| `/labs` | Mikaelson Labs, the innovation hub (the one technical-looking page) |
| `/team` | The team as portrait cards that turn over, with search |
| `/blog` | Stories hub; posts open in place (`/blog?post=<slug>`) with full dedicated article view |
| `/studio` | In-house Editorial Studio for publishing stories, featuring pop-ups, and managing drafts |
| `/sponsor` | Ways to give (bank transfer for individuals, Paystack for organisations), how to partner, supporters |
| `/sponsor/thank-you` | Where Paystack returns organisations; verifies the payment (not indexed) |
| `/volunteer` | Why people volunteer, the application (Google Form), FAQs |
| `/contact` | A letter-style contact form that opens your email app |
| `/help` | Help Center |
| `/faq` | Frequently asked questions |
| `/legal` | Legal hub linking the documents below |
| `/terms` | Terms of Service |
| `/privacy` | Privacy Policy |
| `/code-of-conduct` | Code of Conduct and how to report a concern |

## Project structure

```
src/
├── app/
│   ├── layout.tsx               root layout (fonts, theme, metadata template)
│   ├── globals.css              Tailwind and global styles
│   ├── sitemap.ts, robots.ts
│   ├── studio/                  Editorial studio application (/studio)
│   ├── api/studio/              Studio API routes (auth, CRUD posts)
│   └── (website)/               the public routes (see Pages)
│       └── layout.tsx           header + footer
├── components/
│   ├── site/                    shared redesign blocks: scroll line, footer,
│   │                            envelope submit, clipped tabs, motion helpers
│   ├── ui/                      the few shadcn/ui primitives still used
│   └── client-page/data.ts      "who we serve" data
├── features/website/
│   ├── pages/<page>/            components for each redesigned page
│   └── components/              header, About page sections, shared pieces
├── constants/index.ts           team members and filters
└── lib/, types/                 utilities, database (Neon), and shared types
docs/REDESIGN.md                 the design and engineering record
```

## Design system in brief

Full detail is in [docs/REDESIGN.md](docs/REDESIGN.md). In short:

- **Colours:** turquoise `#5CE1E6` (accent, never as text on white), deep
  teal `#003E45` (headings, dark bands), teal `#0097A7` (labels, focus),
  near-black `#050A0A`, tints `#EEFCFC`/`#E8F7F8`, ink `#111`/`#555`.
- **Type:** Poppins; h1 60/38px extrabold, h2 40/28px bold, body 16–18px
  at 1.7 leading.
- **The scroll line:** wrap a page in `<ScrollLine>` from
  `@/components/site/scroll-line`. It draws a turquoise line down the page
  as you scroll, looping beside each `h1`/`h2`. Opt-in extras:
  `data-wrap`/`data-wrap-item` (the line wraps around items in turn),
  `data-circle` (it loops around each item as you scroll), `data-branch`
  (it branches into a card). Items touched by the line come forward toward
  the screen.
- **Motion:** strong ease-out curves, 150–300ms for UI, transform and
  opacity only, sequences on timers, and `prefers-reduced-motion` always
  honoured. Use `Reveal` and `StaggerGroup` from `@/components/site/motion`.
- **Voice:** warm, plain, about people. Never invent people, quotes,
  numbers or links.

## Content: the blog

Stories are managed through our in-house Editorial Studio at `/studio`, protected by a team passkey in `STUDIO_ADMIN_PASSKEY` (required; there is no default, so without it the Studio stays locked). The session cookie holds a token derived from the passkey, never the passkey itself (`src/lib/studio-auth.ts`).

All articles are stored in Neon Postgres (`src/lib/blog.ts`). The connection string is read from `DATABASE_URL`, `POSTGRES_URL`, or Vercel's prefixed `STORAGE_DATABASE_URL` / `STORAGE_POSTGRES_URL`. On the live site, saving without a database is refused with a clear error; locally, with no database, posts are kept in memory so the Studio can be tried out.

The first time the site connects to the database it creates its tables and imports the three original stories from Sanity once (`src/lib/sanity-import.ts`, tracked in the `blog_meta` table, so deleted stories never come back).
Publishing a story automatically updates:
- The main blog hub (`/blog`) and individual article pages (`/blog/[slug]`)
- The homepage "Our latest stories" (`BlogPreview`) and the pop-up (`BlogAnnouncementPopup`): the story marked "show as pop-up", otherwise the latest published one. It appears on every visit; closing it hides it for that visit only.
- The RSS feed (`/feed.xml`) and dynamic sitemap (`/sitemap.xml`)

Each story shows how many people have **seen** it (opened it) and **read** it (reached the end after spending at least 40% of its reading time on it, 10 to 90 seconds), with **like / dislike** buttons. Each visitor counts once per story, via an anonymous random ID in the `mk_vid` cookie; no names, emails or IP addresses are stored, and bots are ignored (`src/lib/blog-stats.ts`, `/api/blog/[slug]/stats`). The dislike count is shown only to the team in the Studio, which lists all four numbers per story; set `PUBLIC_DISLIKES` in the route to show it publicly.

Analytics: the GA4 tag (`G-2XRR90XDZ8`) loads from `src/app/layout.tsx`.

Categories map to the ecosystem on the home page: Communities → School Club, Innovation → Labs, Leadership → Partnership & Growth Network.

## Forms and payments

Transactional emails are dispatched via the [Resend](https://resend.com) REST API (`src/lib/email.ts`):

- **Contact** (`/contact`): posts to `/api/contact`, which dispatches an alert email to the team (`partnership@mikaelsoninitiative.org`) and sends an automated receipt confirmation back to the visitor. If sending fails or offline, provides an email client fallback.
- **Sponsor**:
  - **Individuals** give by bank transfer to First Bank or GTBank. Donors can submit their transfer notice directly in-app, which notifies the finance team and sends an immediate receipt confirmation to the donor (`/api/sponsor/transfer-notice`).
  - **Organisations** pay online with Paystack (`/api/paystack/initialize`). When Paystack verifies the transaction on `/sponsor/thank-you` (or via `/api/paystack/webhook`), an official donation receipt is automatically emailed to the organization, and a sponsorship alert is dispatched to the team.
- **Code of Conduct** (`/code-of-conduct`): offers an in-app confidential report form posting to `/api/conduct/report`, dispatching secure alerts to `conduct@mikaelsoninitiative.org` and an optional acknowledgment receipt to the reporter.
- **Volunteer** applications continue through the Initiative's official Google Form.

Set `RESEND_API_KEY` in `.env.local` or your production hosting environment. In development, if omitted, emails are simulated and logged to the server console.

## Contributing

1. Branch from `main` (`feature/…` or `fix/…`).
2. Read [docs/REDESIGN.md](docs/REDESIGN.md) and follow its tokens,
   voice and motion rules. New sections go in
   `src/features/website/pages/<page>/`.
3. Check your change in a real browser at 1440px and 375px, in light and
   dark mode, with reduced motion on and off.
4. Run `npm run lint` and `npx tsc --noEmit` before you push.
5. Commit with [Conventional Commits](https://www.conventionalcommits.org/)
   (`feat(team): …`, `fix(blog): …`) and open a pull request.

**Keep it light:** don't add a dependency for something a few lines of CSS
can do, and delete components when you stop using them.

## Troubleshooting

- **Changes don't show up in the browser.** Make sure `next.config.ts`
  only sends long cache headers in production (it does). If your browser
  cached old files before that, empty its cache once (Chrome: DevTools
  open, right-click reload, "Empty Cache and Hard Reload"; Safari:
  Option+Cmd+E).
- **The scroll line doesn't appear or looks stuck.** Check in a visible
  browser tab; embedded or hidden previews pause animation frames.
- **Blog is empty locally.** The application automatically initializes built-in seed stories and falls back seamlessly in-memory if `DATABASE_URL` is omitted in local development. For production or persistent changes, ensure `DATABASE_URL` is configured in `.env.local` or Vercel.
- **Stale build output.** `rm -rf .next && npm run dev`.

## Contact

Mikaelson Initiative, Lagos, Nigeria ·
[hello@mikaelsoninitiative.org](mailto:hello@mikaelsoninitiative.org) ·
[@mcdti_org](https://x.com/mcdti_org)

This project is private and proprietary. All rights reserved.
