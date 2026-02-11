# Architecture Decisions Log

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
