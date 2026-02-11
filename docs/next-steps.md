# Next Steps & Unfinished Work

## Immediate Actions Required

### 1. Reactivate Automatic Deployments (BLOCKER)
**Priority:** CRITICAL
**Owner:** Marco
**Status:** Waiting for manual action

**Steps:**
1. Go to Cloudflare Dashboard: https://dash.cloudflare.com/af6afcc9d7e51a33924fcecd94280af0/pages/view/marcomotion
2. Navigate to Settings → Builds & deployments
3. Click "Resume automatic deployments"
4. Verify commit 57eb9e0 auto-deploys

**Why:** Currently all code changes are blocked from deploying

---

## Pending Code Fixes (Ready to Deploy)

### 2. MediaPreview Component Update
**Priority:** HIGH
**Status:** Code committed, awaiting deployment
**Commits:** 639b64b, 57eb9e0

**What:** Added `key` prop to force React remount when switching projects

**Expected Outcome:**
- Lab Terminal will show correct media for each project
- No more "stuck" on previous project's image

**Testing:**
1. Deploy the commits
2. Open Lab Terminal
3. Switch between projects (Aparta La Fecha ↔ NavidadCon)
4. Verify media updates correctly

---

## Unresolved Issues

### 3. CORS for Social Generator
**Priority:** MEDIUM
**Status:** Not started
**Original Issue:** R2 images blocked when used in HTML5 canvas

**Root Cause:**
- R2 bucket doesn't send `Access-Control-Allow-Origin` header
- Canvas requires CORS for external images

**Attempted Solutions (Failed):**
- ❌ URL proxy through `/api/media/[key]` - caused 404s
- ❌ CORS headers in API endpoint - doesn't help (images from R2, not API)

**Correct Solution:**
Configure CORS at R2 bucket level using Wrangler:

```bash
# Create cors.json with:
{
  "cors": [{
    "origins": ["https://marcomotion.com", "https://marcomotion.pages.dev"],
    "methods": ["GET"],
    "allowedHeaders": ["*"],
    "exposedHeaders": ["ETag"],
    "maxAge": 3600
  }]
}

# Apply to bucket:
wrangler r2 bucket update marcomotion-media --cors-config cors.json
```

**Testing:**
1. Apply CORS config
2. Open Social Generator
3. Select project with image
4. Select background texture
5. Verify image loads in canvas preview
6. Test "Download" functionality

---

### 4. Deployment Pipeline Issue
**Priority:** HIGH (prevents all deployments)
**Status:** Investigating
**Issue:** Build requires `export const runtime = 'edge';` but causes 500 errors

**Current Workaround:**
- Using deployment 8e3c0868 (stable)
- Making database-level changes only

**Potential Solutions:**

**Option A: Wait for Tooling Fix**
- Monitor @cloudflare/next-on-pages releases
- Monitor Next.js 15.x updates
- May resolve automatically

**Option B: Install Specific Version**
```bash
npm install -D @cloudflare/next-on-pages@1.12.0
```
Then try deploy again (older version may not require Edge Runtime)

**Option C: Migrate to App Router**
- Rewrite all Pages Router API routes to App Router format
- Time investment: ~4-6 hours
- Future-proof solution
- Better Edge Runtime support

**Option D: Use Cloudflare Workers Directly**
- Remove Next.js API routes
- Create separate Workers for each endpoint
- Most work but most control

**Recommended:** Try Option B first, then A, then consider C if problem persists

---

## Tech Debt

### 5. Project Navigation Controls
**Priority:** LOW
**Status:** Previously implemented, lost in rollback

**What Was Done:**
- Added arrow controls to navigate between projects
- Added project counter (e.g., "2 / 5")
- Compact 32x32px design with hover effects

**Location:** `components/LabTerminal/LabTerminalHUD.js`

**Recovery:**
Code exists in stash: `WIP: attempted edge runtime fixes - broken`

Can be recovered selectively:
```bash
git stash show -p | grep -A50 "navigation"
```

---

## Database Maintenance

### 6. Media URL Audit
**Priority:** LOW
**Status:** Not started

**Goal:** Verify all media URLs in database point to valid R2 files

**Query:**
```sql
-- Check for any remaining proxy URLs
SELECT id, media_url
FROM project_media
WHERE media_url LIKE '%marcomotion.com/api/media/%';

-- Check for broken R2 URLs
SELECT id, media_url
FROM project_media
WHERE media_url LIKE '%pub-53d4a6f5b3144ad7aaceddf9c6415871.r2.dev/%';
```

**Action:** For each broken URL, determine if file should be:
- Re-uploaded to R2
- URL corrected
- Record deleted (if file lost)

---

## Future Enhancements

### 7. Media Upload Improvements
**Priority:** LOW
**Ideas:**
- Preview before upload
- Automatic image optimization
- Video thumbnail generation
- Drag-and-drop interface
- Bulk upload support

### 8. Lab Terminal Enhancements
**Priority:** LOW
**Ideas:**
- Keyboard shortcuts for project navigation
- Filter logs by type (build/challenge/note)
- Search functionality
- Export logs as JSON/CSV

---

## Testing Checklist (After Deployments Resume)

- [ ] Lab Terminal displays projects correctly
- [ ] MediaPreview updates when switching projects
- [ ] Admin panel media upload works
- [ ] Admin panel media delete works
- [ ] Media displays on front page
- [ ] Social Generator loads background textures
- [ ] Social Generator loads project images (after CORS fix)
- [ ] All API endpoints return 200 (not 500)
- [ ] Database queries perform well
