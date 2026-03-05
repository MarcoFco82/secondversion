# Changelog

## [2026-03-05]
- Project codes refactored: replaced random `PRJ-XXX` codes with alias-based initials (e.g. `SAA-NAV`, `APA-RTA`, `JAR-PER`)
- New `generateProjectCode(alias)` function derives readable codes from project name
- Admin form: added editable "Code" field with auto-uppercase, max 10 chars
- API PUT endpoint: `code` field now updateable via fieldMap
- D1 production: updated 3 existing project codes
- Deploy to production (Cloudflare Pages)
