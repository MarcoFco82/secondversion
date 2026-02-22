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
Next.js 15.5.9 portfolio and project management site deployed to Cloudflare Pages. Features a Lab Terminal interface showing live project development logs, admin panel for content management, and social media post generator.

## Tech Stack
- **Frontend:** Next.js 15.5.9 (Pages Router), React 19, Framer Motion
- **Backend:** Cloudflare Pages, Workers, D1 (SQLite), R2 (Object Storage)
- **Deployment:** Auto-deploy from GitHub via Cloudflare Pages integration
- **Build Tool:** @opennextjs/cloudflare for Next.js → Cloudflare adaptation

## Repository
- **GitHub:** https://github.com/MarcoFco82/secondversion
- **Production:** marcomotion.com, marcomotion.pages.dev
- **Current Deployment:** Manual deploy via `npm run deploy` (commit 686c2c9). GitHub auto-deploy is broken.
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

### Resolved 🟢
- ~~Deployment pipeline broken~~ → Reactivated (but auto-deploy still failing, use manual)
- ~~MediaPreview fix pending deployment~~ → Deployed and working
- ~~Auto-rotate not syncing image/progress~~ → Fixed via ref-based unidirectional flow
- ~~Admin Create Project returning 500~~ → Migration 0004 applied to production D1
- ~~CORS for Social Generator canvas~~ → R2 bucket responds with `Access-Control-Allow-Origin: *`, verified 2026-02-22

### In Progress 🔄
- Investigate why GitHub auto-deploy fails on Cloudflare Pages

### Next Steps
1. **Short-term:** Investigate and fix Cloudflare Pages auto-deploy from GitHub
2. **Medium-term:** Consider App Router migration if Edge Runtime issues return
3. **Backlog:** Add navigation controls to Lab Terminal (lost in rollback, code in stash)

## Key Files
- `/pages/api/**/*.js` - API routes (currently blocking deployments)
- `/components/LabTerminal/` - Terminal UI components
- `/data/projects.js` - Static project data
- `/migrations/*.sql` - D1 database migrations
- `fix-media-urls.sql` - Emergency media URL fix (executed 2026-02-10)

## Database Schema
- **projects** - Project metadata (D1)
- **project_media** - Media files linked to projects (D1 + R2)
- **dev_logs** - Development log entries (D1)
- **admin_users** - Admin authentication (D1)

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
