# Session 003 - 2026-03-05

## What was done
- Refactored project code generation system
  - Old: random `PRJ-` + greek letter + number + letter (e.g. `PRJ-S9X`)
  - New: derived from alias, first 2-3 chars of first two words (e.g. `SAA-NAV`)
- Added editable "Code" field in admin project form
  - Auto-uppercase, max 10 chars
  - Placeholder indicates auto-generation if left empty
- Updated API PUT endpoint to accept `code` in fieldMap (both D1 and in-memory paths)
- Updated 3 existing project codes in production D1:
  - `PRJ-Y2Y` -> `SAA-NAV` (SaaS-NavCon25-NextJS)
  - `PRJ-S9X` -> `APA-RTA` (ApartaLa)
  - `PRJ-Y5V` -> `JAR-PER` (JardinPerdido)
- Deployed to Cloudflare Pages production

## Decisions
- Codes are auto-generated from alias but fully editable by user
- Format: 3-letter prefix + hyphen + 3-letter suffix (from first two words)

## Pending
- Test mobile responsiveness (375px, 768px, 1024px)
- Fine-tune bloom/glow via `/admin/sphere`
- Investigate GitHub auto-deploy failure
