# Architecture Decisions Log

## [2026-02-22] Decision: Replace Lab Terminal with 3D Sphere HUD (Three.js)

**Context:**
The Lab Terminal (2D panel-based UI) accumulated bugs and incomplete features over multiple sessions: auto-rotate sync issues, progress bar mismatches, media preview timing problems, circular useEffect dependencies. Each fix introduced complexity to an already tightly-coupled component tree (LabTerminalHUD → LogDetailsPanel → MediaPreview → ProjectRadarExpanded → ActivityPulse).

**Decision:**
Replace the entire Lab Terminal with a new 3D holographic sphere visualization using Three.js / React Three Fiber. Reuse the same API data layer (no backend changes). Keep all old Lab Terminal files as backup.

**Rationale:**
- Fresh architecture: clean separation of concerns (data hooks, interaction hooks, 3D scene, DOM overlays)
- Simpler data flow: `useProjectData` hook fetches all data, `useSphereInteraction` manages UI state — no circular dependencies
- Better visual impact: 3D sphere with project nodes is more engaging for a portfolio than a terminal panel
- Progressive degradation: `useMobileDetect` hook adapts quality per device tier (mobile/tablet/desktop)
- SSR-safe: `dynamic(() => import(...), { ssr: false })` prevents Three.js hydration issues

**Architecture:**
```
SphereHUD (orchestrator)
├── useProjectData()          → fetch /api/projects, /api/logs, /api/activity
├── useSphereInteraction()    → selected node, filters, auto-rotate
├── useMobileDetect()         → performance tier
├── SphereIntro               → heading (DOM)
├── SphereScene (R3F Canvas)
│   ├── HolographicSphere     → wireframe icosahedron
│   ├── ProjectNode[]         → octahedron per project (fibonacci distribution)
│   ├── ParticleSystem        → orbital particles
│   ├── ActivityRing          → 14-day torus
│   └── EffectComposer        → bloom, noise, vignette
├── HUD overlay (DOM)         → filters, live indicator
└── ProjectDetailPanel (DOM)  → modal on node click
```

**Key Technical Decisions:**
- Fibonacci sphere distribution instead of random placement (uniform visual density)
- `ssr: false` dynamic import (Three.js cannot run server-side)
- `e.stopPropagation()` on node clicks (prevents OrbitControls from consuming the event)
- Auto-rotate pauses 8s on interaction, then resumes
- Html labels via Drei `<Html>` (DOM elements anchored to 3D positions)

**Risks:**
- WebGL not available on some devices → Canvas `fallback` prop can be added
- Bundle size increase (~60 packages added) — mitigated by dynamic import (not in initial load)
- Performance on low-end devices → mitigated by `useMobileDetect` tier system

**Status:** Implemented, builds verified (next build + pages:build). Not yet deployed to production. Lab Terminal files preserved as backup.

---

## [2026-02-22] Decision: Progress Data from SQL JOIN Instead of Client-Side Lookup

**Context:**
Lab Terminal ProgressBar was displaying incorrect progress values. The `enrichedLogs` in LabTerminalHUD relied on `projects.find(p => p.id === log.project_id)` to get each log's project progress. This client-side lookup could fail or produce stale results due to timing, React batching, or data inconsistencies.

**Decision:**
Move progress (and other project fields) into the `/api/logs` SQL JOIN query, so each log arrives from the API with its project's progress already attached. Client-side enrichment uses `log.project_progress` as primary source with `project?.progress` as fallback.

**Rationale:**
- Single source of truth: D1 JOIN guarantees correct project-to-log association
- Eliminates race condition between projects and logs fetch
- Reduces dependency on client-side `projects.find()` matching
- Minimal API response size increase (3 extra fields per log)

**Implementation:**
- `/api/logs` SQL: added `p.progress as project_progress`, `p.tech_stack as project_tech_stack`, `p.category as project_category`
- `enrichedLogs`: `progress: log.project_progress ?? project?.progress ?? 0`

**Status:** Implemented (commit 0ca428f), deployed

---

## [2026-02-21] Decision: Log-Driven Flow with Fallback for No-Log Projects

**Context:**
LabTerminalHUD's `activeProject` was modified to prioritize `activeProjectCode` (from radar clicks) over the active log's project. This broke the core data flow: auto-rotate would change logs but `activeProject` stayed pinned to whatever was last clicked in radar, disconnecting the slider, progress bar, and media viewer.

**Decision:**
Restore `activeProject` as purely log-driven. Introduce a separate `fallbackProject` memo that only activates when the radar selects a project that has zero logs.

**Rationale:**
- The Lab Terminal is fundamentally log-driven: logs rotate → project derives → media loads
- Projects without logs still need to be viewable from radar (show their image)
- Mixing both concerns into one `activeProject` creates coupling that breaks auto-rotate
- Separating into `activeProject` (log-driven) + `fallbackProject` (radar-only, no-log projects) keeps concerns clean

**Implementation:**
- `activeProject` = `projects.find(p => p.id === activeLog.projectId)` — pure log derivation
- `fallbackProject` = only set when `activeProjectCode` has no matching logs in `filteredLogs`
- Media fetch: `activeLog?.projectId || fallbackProject?.id`
- All props: `activeLog?.X || fallbackProject?.X` pattern

**Status:** Implemented (commit e20f21e), deployed

---

## [2026-02-20] Decision: Execute Migration 0004 Manually (Preserve Tags Over Keywords)

**Context:**
Admin panel "Create Project" was returning 500 errors. Investigation revealed migration 0004 was never fully executed on production D1. The table had the original CHECK constraint `category IN ('saas', 'web', 'threejs', 'tool', 'motion', 'experiment')` blocking any of the 40+ new categories added in the frontend. Additionally, someone had run `ALTER TABLE ADD COLUMN tags` independently, leaving both `keywords` (cid 16) and `tags` (cid 21) in the table.

**Decision:**
Execute migration 0004 with a modification: copy `tags` column data (not `keywords`) when rebuilding the table, since `tags` had real data and `keywords` was null for all rows.

**Rationale:**
- Original migration 0004 copies `keywords` → `tags`, which would overwrite existing tag data with null
- Both projects had populated `tags` arrays but null `keywords`
- Safest approach: verify data before each step, use `tags` as source

**Steps Executed:**
1. `PRAGMA table_info(projects)` — confirmed both `keywords` and `tags` exist
2. `SELECT ... FROM projects` — confirmed `keywords` is null, `tags` has data
3. `CREATE TABLE projects_new` — schema from migration 0004
4. `INSERT INTO projects_new SELECT ... tags ...` — used `tags` not `keywords`
5. Verified data in `projects_new`
6. `DROP TABLE projects`
7. `ALTER TABLE projects_new RENAME TO projects`
8. Recreated indexes and trigger
9. Verified final schema with `sqlite_master`

**Status:** Completed

---

## [2026-02-12] Decision: Unidirectional Data Flow for Auto-Rotate Sync

**Context:**
LogDetailsPanel and LabTerminalHUD had a bidirectional sync for the active project:
1. Auto-rotate fires → notify effect tells parent → parent sets `activeProjectCode`
2. Parent passes `activeProjectCode` back as prop → sync effect resets LogDetailsPanel index to first log of that project

This circular dependency caused the auto-rotate index to reset every time a new project was reached, preventing the parent's `activeLog`, `activeProject`, and MediaPreview from updating.

**Decision:**
Use a `useRef` (`lastNotifiedProjectRef`) to track which project the auto-rotate last communicated to the parent. The sync effect only fires when `activeProjectCode` differs from the ref (i.e., when an external source like ProjectRadar changes the project), not when the change originated from auto-rotate itself.

**Rationale:**
- Eliminates the circular dependency without removing the sync capability
- Radar clicks still sync LogDetailsPanel to the selected project
- Auto-rotate flows one-way: child → parent, no echo back
- Minimal code change (1 ref + 2 guard checks)

**Implementation:**
- `LogDetailsPanel.js`: Added `lastNotifiedProjectRef = useRef(null)`
- Notify effect sets `lastNotifiedProjectRef.current = activeLog.projectCode` before calling `onLogSelect`
- Sync effect checks `activeProjectCode !== lastNotifiedProjectRef.current` before calling `goTo`

**Status:** Implemented (commit 8a8b37e), deployed manually

---

## [2026-02-12] Decision: Manual Deploy Required (GitHub Auto-Deploy Broken)

**Context:**
Cloudflare Pages GitHub auto-deploy has been silently failing for all recent commits. Builds succeed locally but fail on Cloudflare's build servers (likely due to OpenNext/Cloudflare adapter differences).

**Decision:**
Use `npm run deploy` (local `deploy.sh`) for all deployments until auto-deploy is fixed.

**Rationale:**
- Local build + `wrangler pages deploy` works reliably
- Auto-deploy failure is in Cloudflare's build environment, not our code
- Investigating root cause is lower priority than shipping fixes

**Consequences:**
- Must run `npm run deploy` manually after each commit
- Cannot rely on push-to-deploy workflow
- Should investigate Cloudflare build logs when time permits

**Status:** Active workaround

---

## [2026-02-11] Decision: Prioritize Dynamic mediaHistory Over Static featured_media_url

**Context:**
MediaPreview component was receiving two sources of media data:
1. `mediaHistory` - dynamically loaded per project via API call (`/api/media?projectId=X`)
2. `featured_media_url` - static field from project record in database

The component was prioritizing `featured_media_url` first, causing it to display stale or incorrect media when switching between projects, especially during auto-rotation.

**Decision:**
Invert the priority: use `mediaHistory[0]` as primary source, fallback to `featured_media_url` only when mediaHistory is empty.

**Rationale:**
- `mediaHistory` is fetched dynamically each time project changes (via useEffect in LabTerminalHUD)
- Always reflects current project's actual uploaded media
- `featured_media_url` is static and may be outdated or not set for all projects
- Dynamic data should take precedence over static fallbacks

**Implementation:**
Changed in `MediaPreview.js:360-361`:
```js
// Before
const displayUrl = mediaUrl || allMedia[0]?.url;

// After
const displayUrl = allMedia[0]?.url || mediaUrl;
```

**Consequences:**
- Lab Terminal now correctly displays media for each project during auto-rotation
- MediaPreview updates properly when switching projects (both manual and automatic)
- `featured_media_url` still serves as fallback for projects without uploaded media
- More reliable UX as it always shows latest uploaded media

**Status:** Implemented (commit 3b850df)

---

## [2026-02-10] Decision: Direct R2 URLs vs API Proxy for Media

**Context:**
Media files were being served through two different URL patterns:
1. Direct R2: `https://pub-53d4a6f5b3144ad7aaceddf9c6415871.r2.dev/[key]`
2. API Proxy: `https://marcomotion.com/api/media/[key]`

The proxy approach was causing 404 errors because files didn't exist with the transformed keys.

**Decision:**
Use direct R2 URLs for all media storage. Removed URL transformation logic from API endpoints.

**Rationale:**
- Direct R2 URLs work reliably
- No transformation overhead
- Simpler architecture
- R2 bucket already configured with public access
- CORS can be configured at bucket level if needed

**Consequences:**
- All existing media URLs in database needed migration (completed via SQL script)
- `/api/media/[key]` endpoint still exists but not used for new uploads
- Future CORS issues for canvas/Social Generator will need bucket-level CORS configuration

**Status:** Implemented

---

## [2026-02-10] Decision: Preserve Pages Router Despite Edge Runtime Issues

**Context:**
Next.js 15.5.9 with Pages Router API routes cannot deploy to Cloudflare Pages without `export const runtime = 'edge';`, but adding this declaration causes all API endpoints to return 500 errors. The alternative would be migrating to App Router.

**Decision:**
Temporarily pause new deployments and preserve working deployment (35b4348) until tooling issue is resolved. Do not migrate to App Router at this time.

**Rationale:**
- Working deployment exists and is stable
- Migration to App Router is significant effort (rewrite all API routes)
- Issue may be resolved by Next.js or Cloudflare tooling updates
- Database changes (like URL fixes) persist independently of code deployments
- User can continue working on database-level fixes while deployment is paused

**Consequences:**
- Code changes cannot be deployed until issue resolved
- Development workflow requires database migrations rather than code deploys
- Next features blocked: MediaPreview fix, navigation controls, CORS resolution
- Need to monitor for fixes in:
  - @cloudflare/next-on-pages updates
  - Next.js 15.x updates
  - Alternative: downgrade to known working version

**Status:** Temporary - awaiting tooling fix

**Alternatives Considered:**
1. Migrate to App Router - rejected due to time investment
2. Downgrade @cloudflare/next-on-pages - not possible (not installed, using npx)
3. Use direct Cloudflare Workers without Next.js - too much rewrite
