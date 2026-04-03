# Architecture Decisions

## [2026-04-02] Creative Logs vs Professional Logs — separation of concerns
- **Context:** Confusion arose about the difference between Creative Logs (`dev_logs`) and Professional Logs (`professional_logs`). The admin sidebar had a broken link to `/admin/logs` that was never implemented.
- **Decision:** Keep them separate. Creative Logs are project-scoped dev activity (managed inline in `/admin/projects`). Professional Logs are personal/strategic diary entries (managed at `/admin/professional-log`). The broken `/admin/logs` sidebar link was removed since creative logs are already manageable within each project.
- **Rationale:** Creative logs are lightweight and project-bound. Professional logs are standalone reflections with media, mood, and energy tracking. They serve different purposes and audiences.

## [2026-04-02] Log media interaction — professional logs only
- **Context:** Marco wanted logs in ProjectDetailPanel to be selectable and show media. Creative logs have no media fields, professional logs have `media_url`/`media_type`.
- **Decision:** Only professional logs with media are clickable in the modal. Creative logs remain static text. No migration needed.
- **Trade-off:** Creative logs can't show media. If needed later, migration 0011 would add `media_url`/`media_type` to `dev_logs`.

## [2026-04-02] Creative Logs Banner — visual ticker, not interactive
- **Context:** Marco wanted creative logs displayed independently below the SphereHUD as a holographic banner.
- **Decision:** Pure visual component — auto-scrolling, no click interaction. Shows ALL creative logs (all projects, not just sphere-visible). Speed configurable from admin via `sphere_config` JSON blob (no migration needed).

## [2026-03-28] Category filters — show all vs dynamic
- **Context:** Category filter buttons only showed categories that existed in current projects. With 4 projects and 2 categories, the filter section looked empty despite having 49 categories defined in code.
- **Decision:** Show all 49 categories always, even if no projects match. A category with 0 results is better than a hidden category — the portfolio communicates "I do all of this" even before content fills in.
- **Trade-off:** Some categories return empty results when clicked. Acceptable — better than appearing limited.

## [2026-03-28] URL normalization — where to validate
- **Context:** External project URLs stored without `https://` were treated as relative paths by the browser (`marcomotion.com/apartalafecha.vip`).
- **Decision:** Normalize in 3 places: (1) frontend `window.open` for existing data, (2) API create, (3) API update. Belt-and-suspenders approach because existing D1 records can't be retroactively fixed without a migration.
- **Why not migration?** Only 4 projects, and the frontend fix handles it. A migration would be overkill for 4 rows.

## [2026-03-24] Mobile responsiveness — breakpoint strategy
- **Context:** 7+ sessions deferred. Partial coverage at 768px and 480px only, inconsistent across components. No 320px or 600px breakpoints. Filter buttons unreadable at 480px. CV section had only 768px coverage.
- **Decision:** 4 consistent breakpoints across all public pages: 768px (tablet), 600px (tablet portrait), 480px (mobile), 320px (small mobile). Progressive scaling — each breakpoint reduces proportionally, no abrupt jumps.
- **Why these breakpoints?** 768px is iPad portrait. 600px catches portrait tablets and large phones in landscape. 480px is standard mobile. 320px covers iPhone SE and smallest Androids. This covers 99%+ of real devices.
- **Tap targets:** All interactive elements (filter buttons, keyword tags, reset btn) get `min-height: 44px` on desktop, scaling down to 36px minimum on 320px. Follows Apple HIG and WCAG 2.5.5 (Target Size).
- **SphereHUD canvas:** Progressive height reduction (600px → 80vh → 70vh → 60vh → 55vh) instead of abrupt jumps. Keeps 3D scene visible but doesn't dominate small screens.
- **Admin pages deferred:** Only public-facing pages addressed. Admin responsive is lower priority since admin is desktop-primary workflow.

## [2026-03-05] CV System — data architecture
- **Context:** Professional Experience section is hardcoded in `locales/translations.js`. No way to update from admin. Need admin-managed CV with downloadable PDF.
- **Decision:** Two new D1 tables: `cv_meta` (personal info per language) and `cv_sections` (typed entries: experience, freelance, education, skill_group, award). Each entry has `section_type`, `sort_order`, and `lang` fields. Skills and bullets stored as JSON arrays.
- **Why not a single JSON blob?** Granular entries allow per-item CRUD, reordering, and filtering by type/language without parsing a monolithic JSON. Also enables future features like "highlight specific experience" or "export subset".
- **PDF generation:** Client-side with jspdf (existing pattern). ATS-friendly format: single column, plain text, standard section headers, no images/decorations. Separate from the visual web section.
- **Professional Log connection:** Not merged into CV data — remains a separate table. The public page shows last 3-5 logs as "Recent Activity" block after formal CV sections. Different data, different update cadence, different purpose.

## [2026-03-05] React hooks order — critical rule
- **Context:** ProjectDetailPanel had `useMemo` hooks AFTER `if (!project) return null`. First render (null project) registered 3 hooks, second render (project selected) registered 5 hooks. React requires same hook count every render.
- **Decision:** ALL hooks (useState, useEffect, useMemo, useCallback) MUST be called before any conditional return. useMemo guards handle null with `if (!project) return []` internally.
- **Rule:** Never place hooks after early returns. This is non-negotiable in React.

## [2026-03-05] Modal animation pattern — CSS keyframes + closing state
- **Context:** Instant modal open/close felt abrupt. Needed smooth entry/exit animations.
- **Decision:** Pure CSS `@keyframes` for animations (no Framer Motion dependency). JS manages a `closing` boolean state — when close is triggered, `closing=true` applies exit animation classes, then a 350ms timeout calls the actual `onClose`. This pattern avoids unmounting the component before the animation completes.
- **Trade-off:** 350ms hardcoded matches CSS animation duration. If CSS changes, JS must too. Acceptable for this scope.

## [2026-03-05] Sphere HUD modal redesign — IMPLEMENTED
- **Context:** Clicking hexagon crashed (useMemo client exception). Detail panel was a simple DOM overlay.
- **Decision:** Full rewrite of ProjectDetailPanel as `position: fixed` modal with `backdrop-filter: blur(8px)`. Desktop: horizontal (media left, info+logs right). Mobile: vertical stack. Neon orange `#ff6b00` / `#ffa742` theme.
- **show_in_sphere:** Editorial control — projects exist in DB but can be hidden from 3D sphere. `useProjectData` now exports `sphereProjects` (filtered) alongside `projects` (all).
- **Professional logs → projects:** `project_id TEXT` column links diary entries to specific projects. Public API supports `?projectId=xxx` filter. Modal fetches per-project professional logs on hexagon click.
- **Migration 0009:** Applied to production D1 on 2026-03-05.

## [2026-03-05] Professional Logs as strategic document
- **Context:** Professional logs in D1 are individual entries. But Marco needs a higher-level narrative document tracking direction, decisions, and growth across sessions.
- **Decision:** Created `docs/professional_logs.md` as a cumulative strategic log. Updated every `/done`. Not implementation details — only direction, strategy, areas of opportunity, and lessons.
- **Rule:** This is now a mandatory deliverable alongside session logs and changelog.

## [2026-03-05] Media delete fix — R2 key extraction was broken
- **Context:** Admin "Remove" button on media only removed from React state, never called API. Backend had wrong URL pattern check (`marcomotion-media` vs `.r2.dev/`), so even if called, R2 files were never deleted.
- **Decision:** Frontend now calls `DELETE /api/admin/media?id=xxx` with confirmation. Backend splits on `.r2.dev/` to extract correct R2 key.

## [2026-03-05] CV System — implementation choices
- **Context:** Spec from session 007 defined 5 phases. This session executed all 5.
- **Seed via API, not SQL:** Seed data was inserted via admin API calls (not raw SQL INSERTs). This validates the full stack (API auth, validation, D1 writes) and ensures the seed process is reproducible from the admin UI button.
- **CV_LABELS constant instead of translations.js:** CV section headers (PROFESSIONAL EXPERIENCE, SKILLS, etc.) added as a local `CV_LABELS` object in `pages/index.js` rather than extending the existing `translations.js`. Reasoning: these labels are tightly coupled to the CV section logic, not generic UI labels. Keeps the CV self-contained.
- **Fallback to hardcoded data:** If `/api/cv` fails or returns empty, the experience section falls back to `t.experience` from `translations.js`. This ensures the section is never blank in production, even if D1 is temporarily unavailable.
- **PDF integrated into Phase 3 (not separate Phase 4):** The download button and jspdf generation logic were built directly into the public CV section component. No separate page or API endpoint needed — client-side generation follows the existing professional log PDF pattern.
- **marcomotion.com as freelance entry:** Marco's current work (Sphere HUD, Cloudflare stack, AI tools) was added as a freelance entry with `date_end: "Present"`, making the CV reflect current activity, not just historical roles.

## [2026-03-05] Project code generation — alias-based initials
- **Context:** Random codes like `PRJ-S9X` gave no reference to the actual project
- **Decision:** Generate codes from project alias using first 2-3 chars of first two words, separated by hyphen (e.g. `"SaaS-NavCon25-NextJS"` -> `SAA-NAV`)
- **Editable:** Admin can override auto-generated code via text input (max 10 chars)
- **Fallback:** If alias is empty, falls back to random `PRJ-XXX`
- **Files changed:** `pages/api/admin/projects/index.js`, `pages/api/admin/projects/[id].js`, `pages/admin/projects.js`
