# Next Steps & Unfinished Work

## Immediate Actions Required

### 1. Fix GitHub Auto-Deploy on Cloudflare Pages
**Priority:** HIGH
**Owner:** Marco
**Status:** Investigating

All recent GitHub auto-deploys fail on Cloudflare's build servers. Local builds work fine.

**Workaround:** Always use `npm run deploy` for manual deployment.

**Investigation steps:**
1. Check Cloudflare Pages build logs for the failing deployments
2. Compare Cloudflare's Node.js version vs local (v23.3.0)
3. Check if `@opennextjs/cloudflare` build works in Cloudflare's environment
4. Consider adding a `build` command override in Cloudflare Pages settings

---

## Unresolved Issues

### 2. CORS for Social Generator
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

## Tech Debt

### 3. Project Navigation Controls
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

### 4. Media URL Audit
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

### 5. Media Upload Improvements
**Priority:** LOW
**Ideas:**
- Preview before upload
- Automatic image optimization
- Video thumbnail generation
- Drag-and-drop interface
- Bulk upload support

### 6. Lab Terminal Enhancements
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
