# How the Mikaelson Initiative site was redesigned

This is the design and engineering record of the 2026 redesign of
mikaelsoninitiative.org: what we set out to do, the ideas we tried and
dropped, the design system we ended up with, how the motion works, and how
to extend it without breaking it. Read it before you change a page.

---

## 1. The brief, and the one idea that shaped everything

The Mikaelson Initiative is a **youth and community development
non-profit** based in Lagos. It works with secondary-school and university
students through four parts of one ecosystem:

| Part | What it is | Where it lives |
| --- | --- | --- |
| Mikaelson School Club | Student-led clubs inside schools | club.mikaelsoninitiative.org |
| Mikaelson Labs | The innovation hub where student ideas become projects | `/labs` |
| Partnership & Growth Network | Mentors, organisations and partners beside young leaders | `/contact` |
| Mikaelson Institute | Pan-African research institute (history, society, culture, thought) | institute.mikaelsoninitiative.org |

The first redesign attempt looked like a tech product: habit grids,
dashboards, trackers. It was rejected in one sentence: **"it's a
non-profit's page, not a tech website."** Every decision after that
follows from it:

- The site should feel **human, warm and mission-led**. It talks about
  people and what changes for them.
- **Only `/labs` may feel technical** (it is the innovation hub; it keeps a
  "blueprint" look).
- It borrows from its sibling sites, so the family reads as one: the
  **Institute** (deep teal, calm type, its footer) and the **School Club**
  (big confident type, a chunky "shadow step" button).
- **Never invent** people, quotes, numbers, partners or links. Existing
  copy is kept; where a design needed new words (e.g. the short titles on
  the ecosystem cards), they were written strictly from existing text.

## 2. How we worked (the process)

1. **A private lab first.** Every page was rebuilt at
   `/redesign-lab/<page>-test` next to the live page, local only and never
   committed, so the real site was untouched while ideas were tried. Forms
   in the lab used a fake sender so nothing reached a real inbox.
2. **One direction document.** A short design direction (subject, tokens,
   voice, page shape, motion rules, a signature moment per page) was
   written before building, and every page was built against it.
3. **Build, look, correct.** Each change was checked in a real browser
   (headless Chrome driven over the DevTools protocol) at 1440px and 375px,
   in light and dark mode, with screenshots, because a preview pane that is
   hidden pauses animation and gives false results.
4. **Snapshots before every big change.** The lab was never in git, so
   before each significant change it was tarred into
   `.claude/redesign-lab-backups/` so any step could be undone exactly.
5. **Port to the real routes.** When the pages were approved, the lab was
   moved onto the real routes (section 9), the lab and its test tooling were
   deleted, and the dead code the old pages left behind was removed.

## 3. Design tokens

All colours come from the existing brand; nothing new was introduced.

| Role | Value | Use and contrast rules |
| --- | --- | --- |
| Turquoise (accent) | `#5CE1E6` | The scroll line, highlights, primary buttons with **black** text (13.4:1). Never as text on white (1.57:1). |
| Deep teal | `#003E45` | Headings on light, the dark bands, secondary buttons. White on teal is 11.8:1. |
| Teal | `#0097A7` | Small labels on light, focus rings, large text only (3.5:1 with white). |
| Near-black | `#050A0A` | Dark-mode background; at most one dark band per page in light mode. |
| Paper / tints | `#FFFFFF`, `#EEFCFC`, `#E8F7F8` | Page background and quiet bands. |
| Ink | `#111111` headings, `#555555` body | Body text is 7.5:1 on white. |
| Gold (sparingly) | `#C9A84C` | Only the big numbers on the ecosystem cards. |

**Type:** Poppins everywhere. Display h1 60px (38px on phones), extrabold,
tracking -0.025em, leading 1.05. Section h2 40px (28px), bold. Body
16–18px, leading 1.7, a measure of about 60–68ch. Small labels are 13px
semibold in sentence case (no tracked all-caps eyebrows, except the small
"Point 1 of 4" kicker on the ecosystem cards).

**Shape:** cards `rounded-2xl`, large cards `rounded-3xl`, buttons
`rounded-full`. **Spacing:** sections breathe (`py-24` to `py-32`).

**Dark mode** works everywhere through Tailwind's `dark:` variant
(`next-themes` puts `.dark` on `<html>`). The home hero is intentionally
white in both modes.

## 4. Page shape and voice

The non-profit pattern every page follows, top to bottom:

hero with one clear sentence → who it's for and why it matters → what we
do, in plain words → proof told through people → **ways to help**
(volunteer, sponsor, partner) → stories → one warm closing invitation.

Voice: warm, plain, direct, addressed to real people ("you"). Short
sentences. Heroes are **centred** (the She Code Africa reference) on Home,
Sponsor, Team, Volunteer and the new Help/FAQ/Legal pages.

**Images.** Home has no photos at all (the user's call). Team keeps each
person's real portrait. Volunteer keeps one real session photo ("Why people
volunteer with us"). Sponsor shows icons instead of photos (money, a
workshop board, a handshake) and keeps the supporters' logos. Contact has
no photo. Stock images are never presented as the Initiative's own people.

## 5. The signature: one turquoise line

Every redesigned page (not Labs) is wrapped in `ScrollLine`
(`src/components/site/scroll-line.tsx`). It draws one hand-drawn turquoise
line down the left of the page **as you scroll**, and undraws it as you
scroll back up. It is the thread that ties the site together, echoing the
Institute's drawn lines and the idea of "walking together".

How it works:

- **Stops.** The line ties a small cursive loop beside each stop and ends
  by underlining the last one. Stops are the elements marked `data-stop`;
  **if none are marked, every visible `h1`/`h2` is a stop.** Marking even
  one element with `data-stop` switches the automatic mode off, so mark all
  the headings you want, or none.
- **Geometry.** The path is built from layout positions
  (`offsetLeft`/`offsetTop`, never `getBoundingClientRect`, so transforms
  don't move it) and rebuilt by a `ResizeObserver` and a
  `MutationObserver` (so tab switches and search filters re-flow it). A
  rebuild that produces the same geometry is ignored, which is what stops
  the observer from looping on the line's own re-render.
- **Drawing.** The path is sampled into monotonic (length, y) pairs. On
  scroll (passive listener, one `requestAnimationFrame` per frame) a binary
  search finds how much of the line lies above the "tip", 62% down the
  viewport, and writes `strokeDashoffset` directly (no React render per
  frame).
- **Reduced motion:** the whole line is shown, still.

It also has four ways to interact with content. All are opt-in with data
attributes, so pages stay declarative:

| Attribute | What the line does | Used on |
| --- | --- | --- |
| `data-branch` (on a stop) | Sends a short branch into the element as it passes and sets `data-reached` / `data-current` on it | Home, Our Ecosystem cards |
| `data-wrap` group + `data-wrap-item` children | Leaves the lane and **wraps around each item in turn** (800ms each, `WRAP_SEG`), setting `data-reached` on the group | Home "Walk with us", Sponsor give buttons, Legal hub |
| `data-circle` | Draws a **loop around each item, one after another as you scroll** (left to right within a row); the latest gets `data-current` | Team members, Volunteer reasons, Code of Conduct values |
| `data-line-ink="#hex"` (on a section) | Draws the line in another colour over that section, via a gradient | (used when the hero was turquoise) |

The CSS that makes items **come forward** when touched lives next to the
line:

- `src/components/site/wrap.module.css`: waiting items sit tilted back
  (`translate3d(0,24px,-200px) rotateX(14deg)`, faded, slightly blurred);
  when the loop closes around one it swings forward and grows
  (`scale(1.08)`), then settles. Mark the group `.stage` and each item
  `.item` with `--i` (its order).
- `src/components/site/circle.module.css`: waiting items are a little back
  and faded; the current one lifts (`scale: var(--lift, 1.08)`, raised,
  drop shadow). Wide rows set a gentler `--lift` (e.g. `1.025`) so text
  stays inside its loop. It uses the `scale`/`translate` properties, not
  `transform`, so it never fights a card's own flip.
- The Our Ecosystem cards (`pages/home/ecosystem-points.module.css`) use a
  3D stage (`perspective: 1400px`): waiting cards lie tilted back into the
  page; the one the line is on is lifted toward the screen with a
  turquoise edge. Settled states are 2D so text re-rasterises sharp.

Waiting styles only apply under `[data-line-ready]` (set once the line is
live), so without JavaScript every card simply shows as it is.

## 6. Motion rules

- **Curves:** strong ease-out `cubic-bezier(0.23,1,0.32,1)` for things
  arriving, strong ease-in-out `cubic-bezier(0.77,0,0.175,1)` for things
  travelling (the line, branches, wraps), a small overshoot
  `cubic-bezier(0.34,1.4,0.5,1)` only for "coming forward".
- **Durations:** 150–300ms for UI feedback, 700–900ms for drawn lines,
  never longer than needed. Press feedback is `scale(0.97)`.
- **Only transform and opacity** (plus stroke-dashoffset and filter) are
  animated. Nothing animates layout.
- **Sequences run on timers, not animation events** (`animationend` is
  unreliable when a tab is hidden).
- **Entrances** use `Reveal` / `StaggerGroup` (`src/components/site/motion`):
  CSS transitions triggered by an `IntersectionObserver`, visible without
  JS, stagger clamped to 30–80ms. Use `immediate` above the fold.
- **Reduced motion is always honoured:** lines show finished, cards don't
  tilt, entrances become fades or nothing.
- **No perpetual motion** and no counters ticking up: everything that
  moves does so because of a scroll, a click or a page load.

Object metaphors carry the delight budget for rare, meaningful actions:
the Contact form **folds into an envelope** that flies off
(`EnvelopeSend`), blog cards **unfold into the reader**, team cards **turn
over**, and the Sponsor options get a hand-drawn circle.

## 7. Page by page

**Home (`/`).** A white, centred campaign hero: "Building the /
**Habits, Knowledge, Communities, and Capacity** / Behind the People Who
Will Build What Africa Becomes." (the middle line in deep teal, large), the
institution sentence, and two buttons ("Explore our ecosystem", a chunky
deep-teal School Club-style button, and "Walk with us"). Around the edges
is **Uli art**: the Igbo tradition of flowing line painting, drawn in code
in turquoise (spirals, crescents, curves and dot clusters that draw
themselves in). Then the original **Our Ecosystem** tabs (with the
Institute added as a fourth), whose four point cards are touched by the
line and come forward in 3D; **Who we serve**; **Walk with us**
(Volunteer, Sponsor, Partner, wrapped by the line in turn); **Our latest
stories**, one per ecosystem from Sanity (Communities → School Club,
Innovation → Labs, Leadership → Network; the Institute shows "coming soon"
until it has posts); and a teal closing band.

**Labs (`/labs`).** The one technical page: a blueprint concept (dashed
plans, a process track). No scroll line.

**Team (`/team`).** Centred hero, no pictures. Portrait cards grouped as
Board & Advisory, Leading the team, and the team (Operations, Tech,
Design), each turns over for role, country and a line of bio, with a
search. The line circles each person as you scroll; the current one lifts.
Nine people were removed at the Initiative's request (see
`pages/team/team-data.ts`), so the page shows 21; `src/constants` still
holds the full list.

**Blog (`/blog`).** A story magazine: the newest post as the opening
spread, then cards. Posts open **in place** in a full-screen reader
(`?post=<slug>`), which is why there is no `/blog/[slug]` route. The
article body is loaded on first open to keep the index light.

**Sponsor (`/sponsor`).** Centred hero; the two give buttons are wrapped by
the line and come forward. "What your support makes possible" shows three
options with icons and a hand-drawn circle on the chosen one; one dialog
shows both Paystack and bank transfer. How to partner, then supporters'
logos.

**Volunteer (`/volunteer`).** Centred hero; "Why people volunteer with us"
with its real photo and four reasons the line circles in turn; an apply
band that opens the Initiative's own **Google Form** (the site has no form
backend); FAQs.

**Contact (`/contact`).** A letter: message first, signature (name and
email) last. Sending folds the letter into the envelope and **opens the
visitor's email app with the letter written out**, addressed to
`partnership@mikaelsoninitiative.org`. The confirmation says exactly that;
it never claims we received it. To send from the page instead, add an API
route and call it in `ContactForm`'s `onSubmit`.

**About Us (`/about-us`).** Centred hero, no photos: "Building a better
Africa, one student at a time" (from the founder's story) and the
organisation sentence. Then **Who we are, and why we exist** (the
organisation, its independence, the note that it isn't linked to other
"Mikaelson" bodies, and mission, vision and values as three calm cards);
**Our story** as a reading column; **What we do**, the four parts of the
ecosystem with their real links; **The global goals we work towards**, the
five SDGs with their small official icons, which the line circles one by
one; **Meet our team**, the Board and team lead portraits from
`pages/team/team-data.ts` with a link to `/team`; and a teal closing band
(Volunteer, Sponsor, Contact).

**Help Center, FAQ, Legal, Terms, Privacy, Code of Conduct.** Redesigned in
the same system: see section 8.

**Footer (every page).** Modelled on the Institute's footer: deep teal
panel, logo, name and a one-line description on the left with socials, a
two-column link list on the right, and a bottom bar crediting the four
parts of the ecosystem. The old footer's dead links and non-functional
newsletter form were dropped.

## 8. The support and legal pages

These were redesigned last, directly on the real routes, in the same
system: centred heroes, no photos, the scroll line, gentle entrances.

- **Help Center (`/help`)** and **FAQ (`/faq`)**: all existing questions,
  answers and categories kept; searchable/grouped, accessible accordions,
  and a "still need help?" band to Contact.
- **Legal (`/legal`)**: a new, calm hub introducing Terms, Privacy and the
  Code of Conduct, whose three cards the line wraps in turn.
- **Terms (`/terms`)** and **Privacy (`/privacy`)**: readable legal
  documents (68ch measure, 17px, leading 1.75) with a sticky table of
  contents that highlights the section you're in. Legal text is kept word
  for word in meaning.
- **Code of Conduct (`/code-of-conduct`)**: core values as cards the line
  circles one by one, expected and unacceptable behaviour side by side, and
  a clear "report a concern" band with an honest email action.

## 9. Where things live

```
src/
├── app/(website)/            real routes: page.tsx files hold metadata and compose sections
│   ├── layout.tsx             header + SiteFooter
│   ├── page.tsx               home
│   ├── labs, team, blog, sponsor, volunteer, contact/
│   ├── help, faq, legal, terms, privacy, code-of-conduct/
│   └── about-us/              about (redesigned; components in pages/about)
├── components/site/           the redesign's shared building blocks
│   ├── scroll-line.tsx        the signature line (stops, branches, wraps, circles, ink)
│   ├── wrap.module.css        "come forward" for wrapped items
│   ├── circle.module.css      "come forward" for circled items
│   ├── site-footer.tsx        Institute-style footer
│   ├── envelope-send.tsx      the envelope submit
│   ├── clipped-tabs.tsx       tabs with a clipped sliding highlight
│   └── motion/                Reveal, StaggerGroup, useInViewOnce
├── features/website/pages/<page>/   one folder of components per redesigned page
├── features/website/components/     header and other shared pieces
├── components/client-page/data.ts   "who we serve" data used by home
└── constants/index.ts               team list and filters
```

**Adding a section to a page:** build it in `features/website/pages/<page>/`
with the tokens above, give its heading an `h2` (the line will find it), and
if its cards should interact with the line, add `data-wrap` or
`data-circle` plus the matching CSS module.

## 10. What we tried and dropped (so you don't repeat it)

| Tried | Why it was dropped |
| --- | --- |
| A "habit grid" tech look | A non-profit, not a tech product |
| A text-only hero | Needed a visual, like the sibling sites |
| A dotted Africa map, then with the ecosystem as a guided tour | The tour went in the wrong place (the cards below were meant) |
| Woven canvas threads behind the hero | Not liked |
| A turquoise hero, then pale turquoise | White with turquoise art chosen |
| Nine code-drawn African art styles (mudcloth, kente, Ndebele, Adinkra, Kuba, Maasai beads, Ankara, Uli, Amazigh) behind a switcher | Uli was chosen; the rest and the switcher were removed |
| A painted illustration / animated video for the hero | The image service was unavailable and the video model needs a higher plan |

## 11. Making the site lighter

- **Removed pages:** `/waitlist`, `/blog/[slug]`, `/product`, and earlier
  auth/admin/dashboard/community/focus-areas pages.
- **Removed dead code:** every file unreachable from a route, layout, the
  sitemap or the Sanity/Next config was deleted (221 → about 120 source
  files), including the old page components, 41 unused shadcn/ui
  components, unused icons and hooks.
- **Removed unused packages:** Clerk, axios, swr, date-fns, gsap, recharts,
  xlsx, jspdf, embla, cmdk, vaul, input-otp, react-day-picker,
  react-resizable-panels, @tanstack/react-table and 20 unused Radix
  primitives.
- **Removed unused public files:** about 42MB of images and placeholders no
  code referenced (public/ went from 99MB to 57MB).
- **Faster pages:** heavy parts load when needed (the blog reader body,
  the Labs projects and process), the line writes styles directly instead
  of re-rendering React, and animations only touch transform and opacity.
- **Dev caching fix:** `next.config.ts` only sends "cache forever" headers
  in production. In development, file names don't change between edits,
  so the old rule left browsers running stale code after every change.

To find dead files again, list everything reachable from
`src/app/**/{page,layout}.tsx`, `sitemap.ts`, `robots.ts`, `globals.css`
and the Sanity/Next configs, following `@/` and relative imports; anything
not reached can go.

## 12. Gotchas

- **One `data-stop` switches the line to manual stops** (section 5).
- **Hidden preview panes pause animation.** If the line or a reveal looks
  stuck in an embedded preview, check in a real, visible browser.
- **Don't use `transform` on elements that already use the circle/wrap
  states** without checking: circle uses `scale`/`translate`, wrap uses
  `transform` in its keyframes.
- **Forms have no backend.** Contact uses `mailto:`, Volunteer uses the
  Google Form, Sponsor uses Paystack and bank details. Don't show "sent"
  for anything the site didn't actually send.
- **Titles** use the root layout's template `"%s | Mikaelson Initiative"`,
  so page titles should not repeat the name (use `title: { absolute }`
  when they must).
