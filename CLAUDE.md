# marcomotionv2 - Project Context for Claude

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
- **Current Deployment:** 8e3c0868 (commit 35b4348)
- **Working Branch:** main

## Current Sprint

### Completed ✅
- Fixed media URL 404 errors via database migration
- Generated 8 background textures for Social Generator
- Identified and documented deployment pipeline issue

### Blocked 🚫
- **Critical:** Deployment pipeline broken - automatic deployments paused
  - Cause: Edge Runtime incompatibility with Next.js 15.5.9 Pages Router API routes
  - Impact: Cannot deploy new code changes
  - Workaround: Database-level changes work (persist across deployments)

### In Progress 🔄
- MediaPreview fix (code ready, deployment blocked)
- CORS resolution for Social Generator canvas (blocked by deployment)

### Next Steps
1. **Immediate:** Reactivate automatic deployments in Cloudflare dashboard
2. **Short-term:** Monitor for @cloudflare/next-on-pages or Next.js fixes
3. **Medium-term:** Consider App Router migration if issue persists
4. **Backlog:** Implement CORS solution for Social Generator

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
1. **Deployment Pipeline:** Edge Runtime requirement breaks all API routes with 500 errors
2. **CORS:** R2 images blocked in canvas (Social Generator) - needs bucket-level CORS
3. **MediaPreview:** Component doesn't remount on project change (fix ready but not deployed)

## Backup & Recovery
- **Backup Branch:** `backup-working-state-35b4348` (last known good state)
- **Stashed Changes:** `WIP: attempted edge runtime fixes - broken`
- **Working Deployment ID:** 8e3c0868-180e-48c2-a7fa-5f18c49b90c6

## Important Notes
- Media URLs in database fixed on 2026-02-10 (persists across deployments)
- Do NOT add `export const runtime = 'edge';` to API routes (causes production failures)
- Auto-deployments currently paused - manual resume required
