# Changelog

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
