# Changelog

## [2026-03-28] Session 010 — URL fix, category filters, Sphere HUD tooltip
- [fix]: External project URLs normalized — prepends `https://` if missing (ProjectCard, API create, API update)
- [fix]: Category filters show all 49 categories in 9 groups regardless of project count
- [feature]: Sphere HUD hover tooltip — full project name + progress bar/COMPLETED anchored to hexagon
- [refactor]: `language` prop passed through SphereHUD → SphereScene → ProjectFace for bilingual tooltip
- [deploy]: Built and deployed to Cloudflare Pages

## [2026-03-24] Session 009 — Mobile responsiveness overhaul (4 phases)
- [css]: Projects grid minmax reduced from 300px to 260px — works on 320px devices
- [css]: Particles container height `100dvh` with `100vh` fallback
- [css]: Tap targets min 44px on keyword tags, category buttons, reset button
- [css]: Slideshow dots enlarged to 8px (6px on 480px) for touch
- [css]: New 600px breakpoint — intermediate tablet portrait coverage
- [css]: New 320px breakpoint — smallest Android devices covered
- [css]: @480px expanded: project-info padding/fonts, description, badges, filter headers, grid gap, experience content
- [css]: @768px expanded: project-info, modal, keyword/category containers
- [sphere]: SphereHUD filter buttons 0.55rem→0.65rem at 480px (was unreadable)
- [sphere]: New 600px breakpoint: canvas 70vh, filterBtn 0.7rem + min-height 32px
- [sphere]: New 320px breakpoint: canvas 55vh, compact filter layout
- [sphere]: hudVersion hidden at 480px, projectCount repositioned
- [sphere]: Loading placeholder heights match canvas at all 4 breakpoints
- [cv]: New 600px breakpoint: header, timeline, skills, awards, activity all scaled
- [cv]: New 480px breakpoint: full section compact, download btn full-width
- [cv]: New 320px breakpoint: ultra compact — name 1.1rem, bullets 0.75rem, skill tags 0.6rem
- [deploy]: Built and deployed to Cloudflare Pages (commit 0c4a6e9)

## [2026-03-05] Session 008 — CV System implementation (5 phases)
- [migration]: 0010 applied to production D1 — `cv_sections` + `cv_meta` tables (9 total tables)
- [api]: Public `GET /api/cv?lang=en|es` — returns full CV grouped by section_type with parsed JSON bullets/items
- [api]: Admin CRUD — `POST /api/admin/cv/meta`, `GET|POST /api/admin/cv/sections`, `PUT|DELETE /api/admin/cv/sections/[id]`, `POST /api/admin/cv/reorder` (batch with db.batch)
- [admin]: `/admin/cv` — 6-tab admin page (Personal Info, Experience, Freelance, Education, Skills, Awards)
- [admin]: EN/ES language toggle, Seed Data button (loads full CV in both languages), bullets editor, tags editor, up/down reorder
- [admin]: CV Generator link enabled in AdminLayout sidebar (removed `disabled: true`)
- [public]: Professional Experience section rewritten from hardcoded `translations.js` to API-driven (`/api/cv`)
- [public]: CV header (name, title, contact, bio), experience timeline with expand/collapse, freelance list, skills grid (2 cols), education, awards with diamond icons, recent activity (last 5 professional logs)
- [public]: Auto re-fetch CV when language switches (if section is unlocked)
- [public]: Fallback to hardcoded data if API hasn't loaded
- [pdf]: ATS-friendly PDF generator (jspdf client-side) — single column, plain text, standard headers, downloadable via "DOWNLOAD CV" button
- [style]: ~250 lines CSS in globals.css — dark theme, orange accents, timeline dots, skill tags, responsive (single col on mobile)
- [seed]: Full CV data seeded to production D1 via API — EN + ES: 2 meta, 16 experience, 8 freelance, 4 education, 8 skill groups, 8 awards
- [seed]: Updated data vs original PDF: added marcomotion.com as current freelance, added React/Next.js/TypeScript/Cloudflare to skills, updated bio with AI/creative tech
- [deploy]: Wrangler OAuth re-authenticated + deployed to Cloudflare Pages
- [infra]: CV_LABELS constant for bilingual section headers (experience, freelance, education, skills, awards, recent activity, download)

## [2026-03-05] Session 007 — CV System planning
- [docs]: Full implementation spec created (`docs/cv-implementation-spec.md`)
- [docs]: CV data extracted from Marco's PDF resume (8 positions, 3 freelance, 4 skill groups, 4 awards, 2 education)
- [plan]: 5-phase architecture: migration 0010, admin `/admin/cv`, public section redesign, ATS-friendly PDF generator, seed + deploy
- [plan]: Two new D1 tables designed: `cv_sections` (typed entries) + `cv_meta` (personal info)
- [plan]: ATS-friendly PDF spec: single-column, plain text, standard headers, parseable by AI recruiters
- [plan]: Professional Log integrated as "Recent Activity" complement to formal CV
- No code changes — planning session only

## [2026-03-05] Session 006 — Hexagon modal fix + UX upgrade
- [bugfix]: React hooks violation — `useMemo` hooks were after conditional `return null`, causing crash on hexagon click (React #310). Moved all hooks before early return.
- [data-fix]: SAA-NAV `featured_media_url` was a browser blob URL (non-persistent) — replaced with actual R2 video URL in D1
- [data-fix]: SAA-NAV `tech_stack` had asterisk prefixes (`"* Next.js 16"`) — cleaned to plain strings
- [feature]: Modal resized — 92vw x 88vh on desktop (was 860px x 80vh)
- [feature]: Modal open/close animations — slide left-to-right entry (ease-out), slide right-to-left exit (ease-in), overlay fade-in/out with blur transition
- [feature]: Media navigation replaced — dots replaced by diamond/rhombus indicators with honey glow (#ffc878), prev/next SVG chevron arrows (36px), all with hover glow effects
- [style]: Typography scaled up for larger modal — project name 1.6rem, code 0.95rem, tech tags 0.7rem, log text 0.85rem
- [style]: Info section now scrollable, padding increased
- [style]: Mobile: bottom-up/top-down animation instead of lateral slide
- Wrangler OAuth re-authenticated (token had expired)
- 4 production deploys via `npm run deploy`

## [2026-03-05] Session 005 — Sphere HUD Upgrade (4 phases)
- Phase 1: `show_in_sphere` toggle — migration 0009, admin checkbox, API POST/PUT, SphereHUD filters by `sphereProjects`
- Phase 2: Professional Logs linked to projects — `project_id` column, admin dropdown, public API `?projectId=xxx` filter
- Phase 3: ProjectDetailPanel rewritten — modal with backdrop blur, horizontal desktop / vertical mobile, neon orange theme, dev+professional logs display, fixes useMemo crash
- Phase 4: Migration 0009 applied to production D1, deployed to Cloudflare Pages
- Created `docs/professional_logs.md` — strategic direction log (mandatory update every session)
- Commit `3652a6c`, deployed to production

## [2026-03-05] Session 004 — Media delete fix
- Fix: Admin "Remove" media button now actually deletes from D1 and R2 (was UI-only before)
- Fix: R2 key extraction corrected — was checking wrong URL pattern, files never deleted from storage
- Commit `038c0b8`, deployed to production

## [2026-03-05] Session 003 — Project codes
- Project codes refactored: replaced random `PRJ-XXX` codes with alias-based initials (e.g. `SAA-NAV`, `APA-RTA`, `JAR-PER`)
- New `generateProjectCode(alias)` function derives readable codes from project name
- Admin form: added editable "Code" field with auto-uppercase, max 10 chars
- API PUT endpoint: `code` field now updateable via fieldMap
- D1 production: updated 3 existing project codes
- Deploy to production (Cloudflare Pages)
