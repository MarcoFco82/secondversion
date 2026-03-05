# Architecture Decisions

## [2026-03-05] Project code generation — alias-based initials
- **Context:** Random codes like `PRJ-S9X` gave no reference to the actual project
- **Decision:** Generate codes from project alias using first 2-3 chars of first two words, separated by hyphen (e.g. `"SaaS-NavCon25-NextJS"` -> `SAA-NAV`)
- **Editable:** Admin can override auto-generated code via text input (max 10 chars)
- **Fallback:** If alias is empty, falls back to random `PRJ-XXX`
- **Files changed:** `pages/api/admin/projects/index.js`, `pages/api/admin/projects/[id].js`, `pages/admin/projects.js`
