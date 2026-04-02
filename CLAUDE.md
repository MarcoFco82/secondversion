# marcomotionv2 - Project Context for Claude

## REGLAS DE TRABAJO (OBLIGATORIAS)

### 1. Documentación de sesión — SIEMPRE al cerrar
- Al finalizar cada sesión, crear archivo inmutable: `sesion-XX.md` (secuencial)
- Ubicación: `/marcomotion_docs/daily_progress/`
- Contenido: fecha, qué se hizo, decisiones tomadas, pendientes
- Estos archivos NUNCA se editan — son registro histórico permanente
- Son independientes de CLAUDE.md y MEMORY.md

### 2. NUNCA auto-imponer scope — SIEMPRE consultar
- Si durante un fix se descubre un bug o problema nuevo → PARAR y preguntar al usuario
- NO agregar metas, pasos o fixes adicionales sin aprobación explícita
- NO expandir el alcance del trabajo por cuenta propia
- Presentar hallazgo → esperar decisión del usuario → proceder solo si aprueba
- El usuario decide qué, cuándo y en qué orden

---

## Project Overview
Next.js 15.5.9 portfolio and project management site deployed to Cloudflare Pages. Features a 3D Sphere HUD (Three.js) showing live project development, admin panel for content management, and social media post generator.

## Tech Stack
- **Frontend:** Next.js 15.5.9 (Pages Router), React 19, Framer Motion, Three.js / React Three Fiber
- **Backend:** Cloudflare Pages, Workers, D1 (SQLite), R2 (Object Storage)
- **Deployment:** Auto-deploy from GitHub via Cloudflare Pages integration
- **Build Tool:** @opennextjs/cloudflare for Next.js → Cloudflare adaptation

## Repository
- **GitHub:** https://github.com/MarcoFco82/secondversion
- **Production:** marcomotion.com, marcomotion.pages.dev
- **Current Deployment:** Manual deploy via `npm run deploy` (commit 0ca428f). GitHub auto-deploy is broken.
- **Working Branch:** main

## Current Sprint

### Completed ✅
- Fixed media URL 404 errors via database migration
- Generated 8 background textures for Social Generator
- Identified and documented deployment pipeline issue
- **[2026-02-11]** Reactivated automatic deployments
- **[2026-02-11]** Fixed Lab Terminal MediaPreview not updating on auto-rotate
- **[2026-02-11]** Deployed MediaPreview fixes to production (commits 3b850df, 710bf84)
- **[2026-02-12]** Fixed auto-rotate not updating image/progress (circular useEffect dependency)
- **[2026-02-12]** Fixed `.sort()` mutating React state in MediaPreview
- **[2026-02-12]** Deployed fixes manually (commits 8a8b37e → 686c2c9)
- **[2026-02-20]** Fixed admin "Create Project" 500 error — executed migration 0004 on production D1 (removed restrictive category CHECK constraint, cleaned up keywords→tags column)
- **[2026-02-22]** Fixed progress bar — `/api/logs` now returns progress from SQL JOIN, no client-side lookup needed
- **[2026-02-22]** Slider speed reduced to 4s, favicon regenerated with updated colors
- **[2026-02-22]** Verified and closed CORS issue — R2 bucket already configured correctly
- **[2026-02-22]** Deployed all pending commits to production (0ca428f)
- **[2026-02-22]** Replaced Lab Terminal with Sphere HUD (Three.js/R3F) — 14 new files, builds verified
- **[2026-02-22]** Sphere HUD glow estilizado — bloom threshold 0.1, intensity 1.5, todo el entorno brilla
- **[2026-02-22]** Admin panel `/admin/sphere` — sliders y color pickers para config visual completa
- **[2026-02-22]** Hexágonos flotantes — movimiento sinusoidal orgánico sobre la superficie de la esfera
- **[2026-02-22]** Fix color picker admin — input descontrolado + evento nativo change (ya no se cierra al drag)
- **[2026-02-22]** Migration 0006 (sphere_config table) aplicada a producción D1
- **[2026-02-22]** Deployed commits 5508f7f, 3ab9bea to production
- **[2026-02-26]** Sphere HUD full-width — removed max-width, moved out of main-section container
- **[2026-02-26]** Camera closer (4.5→3.2), diagonal rotation via tilted group
- **[2026-02-26]** Particles spread wider (radius 2.0-3.8), no longer hugging sphere
- **[2026-02-26]** Active projects distributed evenly across sphere (no longer clustered at north pole)
- **[2026-02-26]** Billboard text — project labels always face camera
- **[2026-02-26]** 4 production deploys via npm run deploy
- **[2026-02-27]** Terminología creativa: filtros, SphereIntro, ENTRY_TYPES, categorías (50→6), labels admin, traducciones EN+ES
- **[2026-02-27]** Video en Sphere HUD: ProjectDetailPanel muestra media (image/video/gif/vimeo/youtube) con dot navigation
- **[2026-02-27]** Professional Log: tabla, API CRUD, admin page, PDF generation con jspdf
- **[2026-02-27]** Migraciones 0007 (terminología) y 0008 (professional_logs) aplicadas a producción D1
- **[2026-02-27]** Deploy a producción con todas las fases
- **[2026-03-04]** Restored 49 granular categories in admin (9 optgroups) — replaced hardcoded 6
- **[2026-03-04]** Category filter on public page — colored buttons by group, derived from real projects
- **[2026-03-04]** ProjectCard component with auto-slideshow, pause on hover, dot navigation
- **[2026-03-04]** Slideshow interval configurable from admin sphere panel (1-15s)
- **[2026-03-04]** Set as Cover button in admin media tab — video/image cover support
- **[2026-03-04]** Deploy a producción (commit d241b25)
- **[2026-03-05]** Refactored project codes: random `PRJ-XXX` replaced with alias-based initials (e.g. `SAA-NAV`)
- **[2026-03-05]** Admin: editable Code field in project form (auto-uppercase, max 10 chars)
- **[2026-03-05]** Updated 3 existing codes in D1 + deployed to production
- **[2026-03-05]** Fix: Admin media delete now calls API + deletes from R2 (was UI-only, R2 key extraction broken)
- **[2026-03-05]** Deploy to production (commit 038c0b8)
- **[2026-03-05]** Sphere HUD Upgrade — 4-phase implementation (show_in_sphere, project_id, modal rewrite, deploy)
- **[2026-03-05]** Migration 0009 applied: `projects.show_in_sphere` + `professional_logs.project_id`
- **[2026-03-05]** ProjectDetailPanel rewritten: modal with backdrop blur, neon orange, horizontal/vertical responsive
- **[2026-03-05]** Professional Logs linked to projects (dropdown in admin, `?projectId` filter in API)
- **[2026-03-05]** Created `docs/professional_logs.md` — strategic direction log (mandatory on /done)
- **[2026-03-05]** Deploy to production (commit 3652a6c)
- **[2026-03-05]** Fix: React hooks violation — useMemo after conditional return caused crash on hexagon click
- **[2026-03-05]** Fix: SAA-NAV blob URL in D1 replaced with real R2 video URL
- **[2026-03-05]** Fix: SAA-NAV tech_stack asterisk prefixes cleaned
- **[2026-03-05]** Modal UX upgrade — 92vw x 88vh, slide animations (in/out), overlay blur transition
- **[2026-03-05]** Media nav: diamond indicators with honey glow + SVG chevron arrows (replaces tiny dots)
- **[2026-03-05]** Typography scaled for larger modal, info section scrollable
- **[2026-03-05]** 4 production deploys
- **[2026-03-05]** CV System spec documented (`docs/cv-implementation-spec.md`) — 5-phase plan, DB schema, API design, ATS PDF format
- **[2026-03-05]** CV System implemented — migration 0010 (cv_sections + cv_meta), 6 API endpoints, admin `/admin/cv` with 6 tabs + EN/ES toggle
- **[2026-03-05]** Public CV section — API-driven (timeline, freelance, skills grid, education, awards, recent activity, PDF download)
- **[2026-03-05]** ATS-friendly PDF generator — jspdf client-side, single-column, parseable by ATS
- **[2026-03-05]** CV data seeded EN + ES — 8 experience, 4 freelance, 2 education, 4 skill groups, 4 awards per language
- **[2026-03-05]** Deploy to production (migration 0010 + full CV system)
- **[2026-03-24]** Mobile responsiveness overhaul — 4 breakpoints (768/600/480/320) across all public pages
- **[2026-03-24]** Projects grid minmax 300→260px, tap targets 44px, slideshow dots enlarged
- **[2026-03-24]** SphereHUD filter buttons legible at all sizes, progressive canvas height scaling
- **[2026-03-24]** CV section fully responsive — 600px, 480px, 320px breakpoints added
- **[2026-03-24]** Particles 100dvh with fallback, hudVersion hidden on mobile
- **[2026-03-24]** Deployed to Cloudflare Pages + pushed to GitHub (commit 0c4a6e9)
- **[2026-03-28]** Fix: External project URLs normalized — `https://` prepended if missing (3 points: ProjectCard, API create, API update)
- **[2026-03-28]** Fix: Category filters now show all 49 categories in 9 groups (was dynamic, only showing categories with projects)
- **[2026-03-28]** Feature: Sphere HUD hover tooltip — full project name + progress bar/COMPLETED, anchored to hexagon with Billboard
- **[2026-03-28]** Deployed to Cloudflare Pages

### Resolved 🟢
- ~~Deployment pipeline broken~~ → Reactivated (but auto-deploy still failing, use manual)
- ~~MediaPreview fix pending deployment~~ → Deployed and working
- ~~Auto-rotate not syncing image/progress~~ → Fixed via ref-based unidirectional flow
- ~~Admin Create Project returning 500~~ → Migration 0004 applied to production D1
- ~~CORS for Social Generator canvas~~ → R2 bucket responds with `Access-Control-Allow-Origin: *`, verified 2026-02-22
- ~~Progress bar wrong values~~ → Fixed via SQL JOIN in /api/logs (2026-02-22)
- ~~Lab Terminal bugs~~ → Replaced entirely with Sphere HUD (2026-02-22)
- ~~Sphere HUD needs deploy~~ → Deployed with glow + admin controls (2026-02-22)
- ~~Dev terminology in portfolio~~ → Replaced with creative terminology (2026-02-27)
- ~~No video in Sphere HUD~~ → ProjectDetailPanel now shows media with autoplay (2026-02-27)
- ~~Admin limited to 6 categories~~ → Restored 49 categories in 9 optgroups (2026-03-04)
- ~~No category filter on public page~~ → Colored filter buttons by group (2026-03-04)
- ~~Static project card images~~ → Auto-slideshow with configurable interval (2026-03-04)
- ~~No video cover support~~ → Set as Cover button + video autoplay in cards (2026-03-04)
- ~~Random project codes (PRJ-XXX)~~ → Alias-based initials + editable field (2026-03-05)
- ~~Admin media delete not working~~ → Frontend calls DELETE API + backend R2 key extraction fixed (2026-03-05)
- ~~Sphere HUD Upgrade~~ → 4-phase implementation complete (2026-03-05): show_in_sphere, project_id, modal rewrite, migration 0009
- ~~ProjectDetailPanel crashes~~ → Full rewrite as modal with backdrop blur (2026-03-05)
- ~~Hexagon click crashes site (React #310)~~ → Hooks violation fixed: useMemo moved before early return (2026-03-05)
- ~~SAA-NAV blob URL in D1~~ → Replaced with actual R2 video URL (2026-03-05)
- ~~Modal tiny and abrupt~~ → 92vw x 88vh with slide + blur animations (2026-03-05)
- ~~Media dots too small~~ → Diamond indicators with honey glow + chevron arrows (2026-03-05)
- ~~CV System~~ → Full implementation: migration 0010, admin CRUD, public section, PDF generator, seed EN+ES, deployed (2026-03-05)
- ~~Professional Experience hardcoded~~ → API-driven from D1, with fallback to translations.js (2026-03-05)
- ~~Mobile responsiveness deferred~~ → 4 breakpoints (768/600/480/320) across all public pages (2026-03-24)
- ~~External URLs broken (relative path)~~ → Normalized with `https://` in frontend + API (2026-03-28)
- ~~Category filters showing only 2 categories~~ → All 49 categories visible always (2026-03-28)
- ~~Sphere HUD hover lacks info~~ → Tooltip with full name + progress bar (2026-03-28)

### In Progress 🔄
- Investigate why GitHub auto-deploy fails on Cloudflare Pages

### Next Steps
1. **Test on real devices** — verify responsive changes on physical iPhone/Android, not just DevTools
2. **Add content** — portfolio has 4 projects, needs more to justify the infrastructure
3. **CV polish** — test PDF in ATS simulators, test language switching on mobile
4. **Admin mobile responsive** — admin pages only have partial 768px coverage, needs 480px+
5. **Backlog:** Investigate and fix Cloudflare Pages auto-deploy from GitHub
6. **Backlog:** WebGL fallback for devices without GPU support
7. **Backlog:** Production error monitoring (Sentry or similar)
8. **Backlog:** R2 storage audit — reconcile D1 records vs actual R2 objects

## Key Files
- `/components/ProjectCard.js` - Project card with auto-slideshow, video cover, pause on hover
- `/components/SphereHUD/` - 3D Sphere HUD (active, replaces Lab Terminal)
- `/components/SphereHUD/hooks/useSphereConfig.js` - Fetches sphere visual config from API
- `/components/SphereHUD/ProjectDetailPanel.js` - Shows media (video/image/embed) + project details
- `/pages/admin/sphere.js` - Admin panel for sphere visual controls
- `/pages/admin/professional-log.js` - Professional Log admin (CRUD + PDF)
- `/pages/api/sphere-config/` - Public GET for sphere config
- `/pages/api/admin/sphere-config/` - Auth POST for saving sphere config
- `/pages/api/professional-logs/` - Public GET for professional logs
- `/pages/api/admin/professional-logs/` - Auth CRUD for professional logs
- `/components/LabTerminal/` - Legacy Terminal UI (preserved as backup, not imported)
- `/pages/api/**/*.js` - API routes
- `/data/projects.js` - Static project data + ENTRY_TYPES (6 creative + legacy)
- `/docs/professional_logs.md` - Strategic direction log (updated every session)
- `/pages/admin/cv.js` - Admin CV management (6 tabs, EN/ES toggle, seed, CRUD, reorder)
- `/styles/AdminCV.module.css` - Admin CV styling
- `/pages/api/cv/index.js` - Public GET for full CV data (meta + sections by type)
- `/pages/api/admin/cv/meta.js` - Auth POST for CV personal info
- `/pages/api/admin/cv/sections/index.js` - Auth GET/POST for CV sections
- `/pages/api/admin/cv/sections/[id].js` - Auth PUT/DELETE for CV section by ID
- `/pages/api/admin/cv/reorder.js` - Auth POST for bulk sort_order update
- `/docs/cv-implementation-spec.md` - CV System spec (5 phases, DB schema, API, PDF format)
- `/migrations/*.sql` - D1 database migrations (0001-0010)

## Database Schema
- **projects** - Project metadata (D1) — categories: interactive, commercial, tools, experimental, storytelling, videogame
- **project_media** - Media files linked to projects (D1 + R2)
- **dev_logs** - Creative log entries (D1) — entry_types: interactive, commercial, tools, experimental, storytelling, videogame + legacy
- **professional_logs** - Personal diary entries (D1, migration 0008) — category, mood, energy, media
- **admin_users** - Admin authentication (D1)
- **sphere_config** - Sphere HUD visual config as JSON blob (D1, migration 0006)
- **cv_meta** - CV personal info per language (D1, migration 0010)
- **cv_sections** - CV entries by type: experience, freelance, education, skill_group, award (D1, migration 0010)

## Known Issues
1. **Edge Runtime (Monitoring):** Keep watch for any Edge Runtime incompatibility issues with future Next.js/Cloudflare updates

## Backup & Recovery
- **Backup Branch:** `backup-working-state-35b4348` (last known good state)
- **Stashed Changes:** `WIP: attempted edge runtime fixes - broken`
- **Working Deployment ID:** 8e3c0868-180e-48c2-a7fa-5f18c49b90c6

## Deployment
- **ALWAYS use `npm run deploy`** (runs `deploy.sh` with OpenNext build + wrangler pages deploy)
- GitHub auto-deploy is currently broken (builds fail on Cloudflare servers)
- Never rely on push-to-deploy; always verify with manual deploy

## Important Notes
- Media URLs in database fixed on 2026-02-10 (persists across deployments)
- Do NOT add `export const runtime = 'edge';` to API routes (causes production failures)
- GitHub auto-deployments are BROKEN as of 2026-02-12 — use `npm run deploy`
- MediaPreview now prioritizes dynamic mediaHistory over static featured_media_url
- LogDetailsPanel uses `lastNotifiedProjectRef` to prevent circular sync — do not remove
- SphereHUD uses `dynamic(() => import(...), { ssr: false })` — Three.js cannot render server-side
- Lab Terminal files preserved in `components/LabTerminal/` as backup — not imported anywhere
