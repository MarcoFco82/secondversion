# Changelog

## [2026-02-26] Sphere HUD — Full-Width Layout, Diagonal Rotation, Billboard Text

### Changed
- **Sphere HUD full-width**: Removed `max-width: 1200px` constraint. Moved `<SphereHUD>` out of `div.main-section` in `pages/index.js` so it renders edge-to-edge across the viewport. Removed `border-radius` and `box-shadow` from container.
- **Margin bottom**: Added `4rem` bottom margin to `.sphereWrapper` to separate Sphere HUD from next section.
- **Camera closer**: Camera position `[0, 0, 4.5]` → `[0, 0, 3.2]`, minDistance `3` → `2.5`. Sphere fills more of the viewport.
- **Diagonal rotation**: Wrapped entire 3D scene in `<group rotation={[0.35, 0, 0.15]}>` — sphere is tilted ~20 degrees so OrbitControls auto-rotate produces a diagonal orbit that enhances the 3D feel.
- **Particles spread further**: Particle shell radius `1.7-2.3` → `2.0-3.8` (nearly double max distance). Y-axis boundary `2.3` → `3.8`.
- **Project distribution**: Active project hexagons now evenly distributed across the sphere using `step = hexCount / projects.length` spacing. Previously clustered at the north pole (fibonacci indices 0, 1, 2...).
- **Billboard text labels**: Project name labels now use drei `<Billboard>` component — always face the camera regardless of sphere rotation. Previously text was unreadable when rotated away.

### Files Changed
- `components/SphereHUD/SphereHUD.module.css` — full-width, margin-bottom, no border-radius
- `components/SphereHUD/SphereScene.js` — camera closer, diagonal tilt group, even project distribution, bloom restored
- `components/SphereHUD/ParticleSystem.js` — wider particle spread
- `components/SphereHUD/ProjectFace.js` — Billboard import + wrapping Text in Billboard
- `pages/index.js` — SphereHUD moved outside main-section div

### Infrastructure
- 4 deploys to Cloudflare Pages production via `npm run deploy`

---

## [2026-02-22] Sphere HUD — Glow Estilizado + Admin Controls + Floating Hexagons

### Added
- **Sphere Config Admin Panel** (`/admin/sphere`): Full visual control panel with sliders and color pickers for all sphere parameters (hexCount, bloom, colors, opacities, emissive, background gradient)
- **sphere_config D1 table**: Migration 0006 — stores config as JSON blob, seeded with defaults
- **API endpoints**: `GET /api/sphere-config` (public), `POST /api/admin/sphere-config` (auth required)
- **useSphereConfig hook**: Fetches config from API with hardcoded fallback defaults
- **Floating hexagon animation**: All faces oscillate along their normal vector with sinusoidal motion — each face has unique phase/speed derived from position (organic water-surface feel)
- **AdminLayout nav**: Added "Sphere Config" link with ◎ icon

### Changed
- **Bloom aggressivo**: threshold 1.2→0.1, intensity 0.4→1.5, smoothing 0.3→0.5 — everything glows
- **Ghost sphere**: opacity 0.04→0.1 (wireframe contributes to bloom)
- **Particles**: opacity 0.6→0.8, size 0.008→0.01 (brighter, bigger)
- **Active emissive**: base 0.3→0.5, hover 0.6→1.2, selected 1.5→2.5
- **Inactive fill**: opacity 0.04→0.03
- **generateFaceGeometry**: Now accepts `totalFaces` param (was hardcoded 30), faceRadius scales with `sqrt(30/totalFaces)`
- **SphereScene**: Receives `sphereConfig` prop, passes bloom/color/opacity values to all children
- **ProjectFace**: Uses sphereConfig for all visual params; both active and inactive faces float
- **ParticleSystem**: Accepts color/size/opacity as props from config
- **GhostSphere**: Accepts color/opacity as props from config
- **SphereHUD**: Background gradient rendered inline from config

### Fixed
- **Admin color picker closing on click**: Changed from controlled `value` to uncontrolled `defaultValue` input. Uses native DOM `change` event (fires once on picker close) instead of React's synthetic `onChange` (fires continuously). Component wrapped in `React.memo` with custom comparator to prevent re-renders that destroy the picker.

### Files Created
- `migrations/0006_sphere_config.sql`
- `pages/api/sphere-config/index.js`
- `pages/api/admin/sphere-config/index.js`
- `components/SphereHUD/hooks/useSphereConfig.js`
- `pages/admin/sphere.js`
- `styles/AdminSphere.module.css`

### Files Modified
- `components/SphereHUD/SphereHUD.js`
- `components/SphereHUD/SphereScene.js`
- `components/SphereHUD/ProjectFace.js`
- `components/SphereHUD/ParticleSystem.js`
- `components/SphereHUD/GhostSphere.js`
- `components/SphereHUD/utils/generateFaceGeometry.js`
- `components/Admin/AdminLayout.js`

### Infrastructure
- Migration 0006 applied to production D1
- D1 config_json updated with aggressive glow defaults
- Deployed commits 5508f7f and 3ab9bea to production

---

## [2026-02-22] Sphere HUD — Lab Terminal Replacement

### Added
- **Sphere HUD (3D)**: Replaced 2D Lab Terminal with interactive Three.js holographic sphere visualization
- **14 new component files** in `components/SphereHUD/`:
  - `SphereHUD.js` — Orchestrator: data fetching, state management, layout
  - `SphereScene.js` — R3F Canvas with full 3D scene (lights, controls, post-processing)
  - `HolographicSphere.js` — Wireframe icosahedron (80 triangles) with cyan glow, slow self-rotation
  - `ProjectNode.js` — Interactive octahedron nodes per project with hover (scale 1.3), select (pulsing), and Html labels (code, alias, progress%)
  - `ParticleSystem.js` — 200 orbital particles with tangential velocity, additive blending
  - `ActivityRing.js` — Torus with 14 bar segments showing daily activity, slow rotation
  - `ProjectDetailPanel.js` — DOM overlay modal with project info (progress bar, tech stack, latest log)
  - `SphereIntro.js` — Heading section ("What I'm building right now")
  - `hooks/useProjectData.js` — Fetches `/api/projects`, `/api/logs`, `/api/activity` with parallel Promise.all
  - `hooks/useSphereInteraction.js` — Selected node, hover, filters, auto-rotate pause/resume (8s timeout)
  - `hooks/useMobileDetect.js` — Progressive quality degradation (mobile: no bloom/80 particles, tablet: bloom/120, desktop: full/200)
  - `utils/fibonacciSphere.js` — Golden angle distribution algorithm for uniform node placement
  - `SphereHUD.module.css`, `SphereIntro.module.css`, `ProjectDetailPanel.module.css`
- **5 new dependencies**: `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `postprocessing`

### Changed
- **`pages/index.js`**: Replaced `import LabTerminalHUD` with `dynamic(() => import('SphereHUD'), { ssr: false })` — prevents SSR hydration issues with Three.js
- **`<LabTerminalHUD lang={language} />`** → **`<SphereHUD lang={language} />`** at line ~500

### Preserved (NOT deleted)
- All files in `components/LabTerminal/` remain as backup (16 files)
- All APIs unchanged (`/api/projects`, `/api/logs`, `/api/activity`, `/api/media`)
- `styles/variables.css` untouched — SphereHUD references existing CSS custom properties

### Technical Details
- **Sphere geometry**: IcosahedronGeometry(1.5, 2) — 80 triangles, wireframe via Drei `<Wireframe>`
- **Node distribution**: Fibonacci/golden angle algorithm on radius 1.55
- **Lighting**: ambient(0.15) + pointLight cyan(#38bdf8) + pointLight orange(#ffa742)
- **Post-processing** (desktop only): Bloom(threshold 0.8), Noise(0.02), Vignette(0.8)
- **OrbitControls**: auto-rotate(0.5 speed), min/max distance 3-7, no pan, damping
- **Filters**: [All] [Build] [Ship] [Experiment] [Polish] — filter projects by category
- **Build verified**: `next build` ✓ (75.8kB page), `pages:build` ✓ (OpenNext bundle)

### Files Changed
- `pages/index.js` — dynamic import of SphereHUD, replaced LabTerminalHUD usage
- `package.json` — 5 new dependencies (three, R3F ecosystem)
- 14 new files in `components/SphereHUD/`

---

## [2026-02-22]

### Fixed
- **Progress bar showing wrong values**: `/api/logs` now returns `project_progress`, `project_tech_stack`, `project_category` directly from SQL JOIN. Client-side enrichment uses `log.project_progress` as primary source instead of relying on `projects.find()` match. Each log now displays its own project's progress correctly.
- **ProgressBar defensive defaults**: Added `progress = 0` default parameter and `typeof` guard to prevent NaN/undefined rendering.
- **CORS verified as resolved**: Confirmed R2 bucket `marcomotion-media` returns `Access-Control-Allow-Origin: *` on actual image files. Removed from Known Issues and In Progress.

### Changed
- **Slider speed**: Auto-rotate interval reduced from 8000ms to 4000ms, resume delay from 4000ms to 3000ms.
- **Favicon regenerated**: `favicon.ico` rebuilt from `mm.svg` with updated accent color (`#f93`).
- **CLAUDE.md**: Added mandatory workflow rules (session logs, no scope creep without approval). Updated sprint status.

### Infrastructure
- **Deployed to production**: Commits `1c37793` and `0ca428f` deployed via `npm run deploy`.

### Files Changed
- `pages/api/logs/index.js` — SQL JOIN now includes progress, tech_stack, category
- `components/LabTerminal/LabTerminalHUD.js` — enrichment uses log.project_progress, slider 4s
- `components/LabTerminal/LogDetailsPanel.js` — defensive ProgressBar
- `public/favicon.ico` — regenerated
- `CLAUDE.md` — workflow rules, sprint update
- `docs/changelog.md` — this entry
- `docs/decisions.md` — new entry

## [2026-02-21]

### Fixed
- **Lab Terminal log-driven flow restored**: `activeProject` was incorrectly prioritizing `activeProjectCode` over the active log. Reverted to pure log-driven derivation. Added `fallbackProject` for radar clicks on projects without logs.
- **Media fetch log-driven**: Media fetch now uses `activeLog?.projectId` as primary source with `fallbackProject?.id` as fallback, instead of deriving from `activeProject`.
- **Radar shows all projects**: `uniqueProjects` now maps all projects directly instead of filtering through logs (projects without logs were invisible).
- **Props cascade fixed**: MediaPreview, ProjectRadarExpanded, and ActivityPulse now use `activeLog` as primary data source with `fallbackProject` as secondary.

### Added
- **Favicon**: Generated `favicon.ico` (16, 32, 48px) from new `mm.svg` logo using sharp.
- **Logo SVG**: Added `public/mm.svg` (marcomotion logo from Adobe Illustrator).

### Files Changed
- `components/LabTerminal/LabTerminalHUD.js` — restored log-driven flow, added fallbackProject
- `public/favicon.ico` — regenerated from mm.svg
- `public/mm.svg` — new file

## [2026-02-20]

### Fixed
- **Admin "Create Project" returning 500**: The `projects` table in production D1 still had the original restrictive CHECK constraint `category IN ('saas', 'web', 'threejs', 'tool', 'motion', 'experiment')` from migration 0001. The admin form offers 40+ categories (added in code), but migration 0004 (which removes the constraint) was never fully executed on production — only the `tags` column had been added via ALTER TABLE.
- **Executed migration 0004 manually on production D1**: Recreated the `projects` table without the category CHECK constraint. Used `tags` column data (not `keywords`) during copy to preserve existing tag data. Removed obsolete `keywords` column.

### Migration Details
- Created `projects_new` table with `category TEXT NOT NULL` (no CHECK)
- Copied 2 existing projects preserving all data including `tags`
- Dropped old `projects` table, renamed `projects_new` → `projects`
- Recreated 4 indexes + `update_projects_timestamp` trigger

### Database State
- `projects` table: 2 rows (PRJ-Y2Y, PRJ-S9X), schema now matches migration 0004 spec
- `dev_logs` table: migration 0005 was already applied (entry_type constraint includes new types)
- No code changes — this was a production DB-only fix

## [2026-02-12]

### Fixed
- **Lab Terminal auto-rotate not updating image/progress**: Broke circular dependency between sync and notify `useEffect` hooks in `LogDetailsPanel.js`. Added `lastNotifiedProjectRef` to distinguish internal (auto-rotate) from external (radar click) project changes, preventing index resets that blocked parent state updates.
- **Missing effect dependencies**: Added `logs`, `index`, `goTo` to sync effect dependency array in `LogDetailsPanel.js` (were missing, causing stale closures).
- **React state mutation in MediaPreview**: Fixed `mediaHistory.sort()` mutating parent state array — changed to `[...mediaHistory].sort()` in `MediaPreview.js:255`.

### Infrastructure
- **Discovered GitHub auto-deploy failures**: All recent Cloudflare Pages auto-deploys from GitHub have been silently failing. Manual deploy via `npm run deploy` (`deploy.sh`) is required.
- **Manual deploy to production**: Successfully deployed fix (commits 8a8b37e → 686c2c9) via `deploy.sh`.

### Files Changed
- `components/LabTerminal/LogDetailsPanel.js` — ref-based sync guard, fixed deps
- `components/LabTerminal/MediaPreview.js` — immutable sort

## [2026-02-11]

### Fixed
- **Lab Terminal MediaPreview not updating on auto-rotate**: Fixed issue where media preview would only update on manual project selection but not during automatic log rotation
  - Modified `MediaPreview.js` to prioritize dynamic `mediaHistory` over static `featured_media_url`
  - Added `useEffect` in `LogDetailsPanel.js` to notify parent component when auto-rotate changes active log
  - Commits: 3b850df, 710bf84
- **Deployment pipeline reactivated**: Resumed automatic deployments in Cloudflare dashboard after confirming no Edge Runtime code in pending commits

### Infrastructure
- **Automatic deployments**: Successfully reactivated after verification that commits 639b64b and 57eb9e0 contained no problematic Edge Runtime declarations
- **Production deployment**: New commits deployed automatically (3b850df, 710bf84)

## [2026-02-10]

### Fixed
- **Media URLs in database**: Corrected broken proxy URLs (`marcomotion.com/api/media/[key]`) to direct R2 URLs (`pub-53d4a6f5b3144ad7aaceddf9c6415871.r2.dev/[key]`). Executed SQL migration to fix 2 media records giving 404 errors.
- **MediaPreview component not updating**: Added `key` prop to MediaPreview component in LabTerminalHUD.js to force React remount when switching projects. Previously, component kept displaying previous project's media.

### Added
- **Social Generator background textures**: Generated 8 procedural PNG textures (512x512) for social post overlays:
  - noise_light.png, noise_dark.png (383K each)
  - grid_subtle.png (2.7K)
  - dots_pattern.png (3.1K)
  - lines_diagonal.png (6.5K)
  - gradient_radial.png (38K)
  - tech_circuit.png (12K)
  - halftone.png (112K)
- **Database migration script**: Created `fix-media-urls.sql` for batch URL corrections in project_media table
- **Backup branch**: Created `backup-working-state-35b4348` to preserve last known working state

### Infrastructure
- **Deployment rollback**: Rolled back production to deployment `8e3c0868` (commit 35b4348) after failed build attempts with Edge Runtime configuration
- **Code restoration**: Reset codebase to commit 35b4348 and stashed broken Edge Runtime changes

### Blocked
- **Deployment pipeline broken**: Automatic deployments paused in Cloudflare. Build fails when adding `export const runtime = 'edge';` to API routes (required by @cloudflare/next-on-pages v1.13.16)
- **MediaPreview fix pending deployment**: Code fix committed (639b64b, 57eb9e0) but not deployed due to paused automatic deployments

### Known Issues
- Next.js 15.5.9 Pages Router API routes incompatible with Cloudflare Edge Runtime
- @cloudflare/next-on-pages v1.13.16 requires `export const runtime = 'edge';` but causes 500 errors on all API endpoints
- CORS issue in Social Generator for R2 images in canvas (original issue, still unresolved)
