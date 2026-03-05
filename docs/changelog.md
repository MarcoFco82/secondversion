# Changelog

## [2026-03-05] Session 004 — Media delete fix
- Fix: Admin "Remove" media button now actually deletes from D1 and R2 (was UI-only before)
- Fix: R2 key extraction corrected — was checking wrong URL pattern, files never deleted from storage
- Commit `038c0b8`, deployed to production

## [2026-03-05] Session 003 — Project codes
- Project codes refactored: replaced random `PRJ-XXX` codes with alias-based initials (e.g. `SAA-NAV`, `APA-RTA`, `JAR-PER`)
- New `generateProjectCode(alias)` function derives readable codes from project name
- Admin form: added editable "Code" field with auto-uppercase, max 10 chars
- API PUT endpoint: `code` field now updateable via fieldMap
- D1 production: updated 3 existing project codes
- Deploy to production (Cloudflare Pages)
