# Session 004 - 2026-03-05

## What was done

### Fix: Media deletion from admin (Bug fix)
- **Frontend (`pages/admin/projects.js:301`):** `removeMedia()` only removed item from React state — never called DELETE API. Media reappeared on page reload.
  - Fix: Now calls `DELETE /api/admin/media?id=xxx` for existing media, with confirmation dialog and error handling.
- **Backend (`pages/api/admin/media/index.js:154`):** R2 key extraction was broken — checked for `'marcomotion-media'` in URL, but public R2 URLs use `pub-xxx.r2.dev/key` format. Files were **never deleted from R2 storage**.
  - Fix: Now splits on `.r2.dev/` to correctly extract the R2 object key.

### Commit & Deploy
- Commit `038c0b8`: `fix(media): delete media from D1 and R2 when removing from admin`
- Pushed to `origin/main`, deployed to Cloudflare Pages production.

## Plan for Next Session — Sphere HUD Upgrade (4 Phases)

### Phase 1: Toggle "Show in Sphere" in Admin
- Migration 0009: `ALTER TABLE projects ADD COLUMN show_in_sphere INTEGER DEFAULT 1`
- Admin form: Checkbox in Details tab (next to "Featured")
- API PUT/POST: Add `showInSphere` to fieldMap
- `useProjectData.js`: Filter `projects.filter(p => p.show_in_sphere)` for sphere only
- Files: `migrations/0009`, `pages/admin/projects.js`, `pages/api/admin/projects/index.js`, `pages/api/admin/projects/[id].js`, `hooks/useProjectData.js`

### Phase 2: Professional Logs linked to Projects
- Migration 0009 (same file): `ALTER TABLE professional_logs ADD COLUMN project_id TEXT`
- Admin professional-log: Project dropdown when creating/editing
- API: Add `project_id` to INSERT/UPDATE of professional-logs
- Public API: New query param `?projectId=xxx` to filter by project
- Files: `migrations/0009`, `pages/admin/professional-log.js`, `pages/api/admin/professional-logs/index.js`, `pages/api/professional-logs/index.js`

### Phase 3: Redesigned Modal over Sphere
**Problem:** Current ProjectDetailPanel crashes (client-side exception in useMemo) and breaks links when selecting a hexagon.

**Solution:** Full rewrite of ProjectDetailPanel as a modal overlay with backdrop blur.

**Desktop (>768px) — Horizontal layout:**
- Left: Media slideshow (images, videos, gifs, vimeo, youtube) with dot navigation
- Right: Project name, progress, dev logs, professional logs, tech stack
- Backdrop: Blurred sphere behind modal

**Mobile (<768px) — Vertical layout:**
- Top: Media slideshow gallery
- Bottom: Scrollable logs (dev + professional) and tech stack

**Color theme:** Neon orange (`#ff6b00` / `#ffa742`) — borders, accents, active dots, matching site brand.

**Data flow:**
- On hexagon click: fetch professional logs for that project via `GET /api/professional-logs?projectId=xxx`
- Dev logs already available from `useProjectData` hook
- Media already included in project object from `/api/projects`

**Files:** `components/SphereHUD/ProjectDetailPanel.js` (rewrite), `ProjectDetailPanel.module.css` (rewrite)

### Phase 4: Deploy & Migration
- Execute migration 0009 on production D1
- `npm run deploy`
- Verify in production

## Known Issue
- Client-side crash when clicking hexagon on sphere (screenshot captured: useMemo error in framework). Likely fixed by Phase 3 rewrite.

## Pending (unchanged)
- Test mobile responsiveness (375px, 768px, 1024px)
- Fine-tune bloom/glow via `/admin/sphere`
- Investigate GitHub auto-deploy failure
