# Architecture Decisions

## [2026-03-05] Sphere HUD modal redesign — planned for next session
- **Context:** Clicking hexagon crashes (useMemo client exception). Links break. Current detail panel is a simple DOM overlay, not a proper modal.
- **Decision:** Full rewrite of ProjectDetailPanel as blurred backdrop modal. Desktop: horizontal (left media slideshow, right logs). Mobile: vertical stack. Neon orange theme.
- **Additional:** Add `show_in_sphere` toggle to projects, link `professional_logs` to projects via `project_id` column.
- **Migration 0009:** Two ALTERs — `projects.show_in_sphere INTEGER DEFAULT 1`, `professional_logs.project_id TEXT`
- **Status:** Planned, not yet implemented. See `docs/session_004.md` for full 4-phase plan.

## [2026-03-05] Media delete fix — R2 key extraction was broken
- **Context:** Admin "Remove" button on media only removed from React state, never called API. Backend had wrong URL pattern check (`marcomotion-media` vs `.r2.dev/`), so even if called, R2 files were never deleted.
- **Decision:** Frontend now calls `DELETE /api/admin/media?id=xxx` with confirmation. Backend splits on `.r2.dev/` to extract correct R2 key.

## [2026-03-05] Project code generation — alias-based initials
- **Context:** Random codes like `PRJ-S9X` gave no reference to the actual project
- **Decision:** Generate codes from project alias using first 2-3 chars of first two words, separated by hyphen (e.g. `"SaaS-NavCon25-NextJS"` -> `SAA-NAV`)
- **Editable:** Admin can override auto-generated code via text input (max 10 chars)
- **Fallback:** If alias is empty, falls back to random `PRJ-XXX`
- **Files changed:** `pages/api/admin/projects/index.js`, `pages/api/admin/projects/[id].js`, `pages/admin/projects.js`
