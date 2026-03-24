# CV System — Implementation Spec

## Overview
Sistema completo de CV/Resume gestionado desde admin, conectado con la seccion publica Professional Experience, con generacion de PDF ATS-friendly descargable.

## Fuente de datos: CV de Marco (PDF actual)
Archivo: `/Users/markof/Desktop/Markof/Reel 2024/cv_marco_en.pdf`

### Personal Info
- **Name:** Marco Francisco Ramos Olvera
- **Title:** Sr. Motion Graphics Designer
- **Degree:** Communications, specialized in Advertising
- **Capoeira:** Green-yellow rank in Capoeira Regional
- **Location:** Guadalajara, Jalisco
- **Age:** 42
- **Languages:** Bilingual (Spanish/English)
- **Phone:** +52 5530738888
- **Email:** marcoramos82@zohomail.com
- **Website:** marcomotion.com

### Professional Experience (8 positions)
1. **ENVATO Mexico** — Feb 2018 - Jun 2024
   - Guadalajara, Col. Americana
   - Motion Graphics Designer
   - Development of commercial animations for the global market
   - Video Mockups Post-production

2. **ZU Media** — Feb 2015 - Jan 2018
   - CDMX, San Angel Inn
   - Production, Animation, and Post-Production Coordinator
   - Main accounts: HBO, Jim Beam Suntory, Natura Mexico, Tequila Hornitos

3. **ED Escuela Digital** — Oct 2013 - Aug 2014
   - CDMX, Paseo de la Reforma
   - Instructor: "Video Post-Production" and "Digital Animation"

4. **Donceles 66 Foro Cultural** — Jul 2012 - Jan 2013
   - CDMX, Centro
   - Webmaster - Audiovisual Producer

5. **ClickOnero Mexico** — Feb - Nov 2011
   - CDMX, Polanco
   - Motion Graphic Designer, Graphic Designer

6. **El Salon de la Franquicia** — Jun 2008 - Jan 2011
   - CDMX, Del Valle
   - Webmaster, design for billboards and magazines, audiovisual production

7. **Secretaria de Seguridad Publica y Transito Municipal** — Jun 2006 - Feb 2008
   - Puebla City
   - Photojournalist in the Department of Social Communication

### Freelance (3 entries)
1. **Fundacion UNETE** — CDMX, 2014
   - Animation, Web Design and Postproduction contractor

2. **Aluxes Ecoparque Palenque** — Palenque, Chiapas, 2011
   - Web Designer contractor

3. **PGR Delegacion Puebla** — Puebla, 2008
   - Corporate video producer and postproducer

### Education
1. **Render Farm Studios** — CDMX, 2011
   - Diploma in Composition for Post-production
   - Diploma in 3D Animation

2. **Benemerita Universidad Autonoma de Puebla** — 2000/2005
   - Bachelor's Degree in Communication Sciences, specializing in Advertising (Pending Graduation)

### Skills
**Hard Skills:**
- Motion Graphics Design
- Editing & Post-production
- Video & Photography
- Web Design

**Technical Skills:**
- After Effects, Premiere, Photoshop, Illustrator, Final Cut
- Cinema 4D, Fusion, Visual Studio, Three.js, Vercel
- MidJourney, Runway, DaVinci Resolve

**Creative Skills:**
- Concept development, Storytelling, Artistic design
- Abstract animation, Cinematic vision, Visual composition

**Soft Skills:**
- Creative problem-solving, Adaptability, Time management
- Collaboration, Attention to detail

### Awards (4)
- Envato Best Seller Award for Motion Graphics Design — 2020
- Envato Best Seller Award for Motion Graphics Design — 2021
- Envato Best Seller Award for Motion Graphics Design — 2022
- Envato Best Seller Award for Motion Graphics Design — 2023

---

## Architecture

### Phase 1: Database + API

**Migration 0010: `cv_sections` table**
```sql
CREATE TABLE cv_sections (
    id TEXT PRIMARY KEY,
    section_type TEXT NOT NULL,
    -- section_type values: 'personal_info', 'experience', 'freelance', 'education', 'skill_group', 'award'
    title TEXT,
    subtitle TEXT,
    location TEXT,
    date_start TEXT,
    date_end TEXT,
    description TEXT,
    bullets TEXT, -- JSON array of strings
    skill_category TEXT, -- for skill_group: 'hard', 'technical', 'creative', 'soft'
    items TEXT, -- JSON array (skills list, or sub-items)
    sort_order INTEGER DEFAULT 0,
    lang TEXT DEFAULT 'en', -- 'en' or 'es'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Also store CV metadata
CREATE TABLE cv_meta (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    professional_title TEXT,
    email TEXT,
    phone TEXT,
    location TEXT,
    website TEXT,
    bio TEXT,
    lang TEXT DEFAULT 'en',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**API Endpoints:**
- `GET /api/cv` — Public. Returns full CV data (meta + all sections), grouped by section_type. Query: `?lang=en`
- `GET /api/cv/pdf` — Public. Returns generated ATS-friendly PDF binary
- `POST /api/admin/cv/meta` — Auth. Create/update CV meta info
- `POST /api/admin/cv/sections` — Auth. Create a section entry
- `PUT /api/admin/cv/sections/[id]` — Auth. Update section entry
- `DELETE /api/admin/cv/sections/[id]` — Auth. Delete section entry
- `POST /api/admin/cv/reorder` — Auth. Bulk update sort_order

### Phase 2: Admin Page `/admin/cv`

**Layout:**
- Tab-based navigation: Personal Info | Experience | Freelance | Education | Skills | Awards
- Each tab shows list of entries + add/edit forms
- Drag-and-drop or up/down arrows for reordering
- Language toggle (EN/ES) — each entry has a `lang` field
- "Preview PDF" button — opens generated PDF in new tab
- Seed button to load initial data from this spec

**Personal Info tab:**
- Form: name, title, email, phone, location, website, bio
- One record per language

**Experience tab:**
- List of positions ordered by sort_order
- Each card: company, title, location, date range, bullets (editable list)
- Add/Edit/Delete/Reorder

**Skills tab:**
- 4 sub-groups: Hard, Technical, Creative, Soft
- Each group: editable list of skill strings
- Tags-style input (type + enter to add)

**Awards tab:**
- Simple list: title + year
- Add/Delete

### Phase 3: Public Section Redesign

**Current state:** `pages/index.js` lines 387-438, data hardcoded in `locales/translations.js`

**New design:**
- Fetches from `GET /api/cv?lang={currentLang}`
- Password gate "caputdraconis" remains
- Layout sections:
  1. **Header** — Name, title, contact (subtle, professional)
  2. **Experience Timeline** — Vertical timeline with company cards, expandable bullets
  3. **Freelance** — Compact list below experience
  4. **Skills** — Grid of 4 columns (hard/technical/creative/soft) with tag pills
  5. **Education** — Simple cards
  6. **Awards** — Horizontal row with trophy icons
  7. **Recent Activity** — Last 3-5 Professional Logs (from existing `/api/professional-logs`) as "What I'm working on now"
  8. **Download CV** button — calls `/api/cv/pdf?lang=en`, downloads ATS-friendly PDF

**Design language:**
- Consistent with site theme (dark, orange accents, monospace headers)
- Timeline line + dots for experience
- Responsive: single column on mobile

### Phase 4: ATS-Friendly PDF Generator

**ATS (Applicant Tracking System) requirements:**
- Single column layout (no tables, no multi-column)
- Plain text, fully parseable
- Standard section headers: "PROFESSIONAL EXPERIENCE", "EDUCATION", "SKILLS", "AWARDS"
- Reverse chronological order
- No images, no icons, no QR codes, no decorative elements
- Font: standard (Helvetica/Arial), 10-11pt body, 14pt name
- Contact info at top: name, email, phone, location, website
- Each position: Company | Title | Location | Date range, then bullet points
- Skills as comma-separated lists under labeled categories
- File format: PDF (not image-based — text must be selectable/searchable)

**Implementation:**
- Use `jspdf` (already in project for professional log PDF)
- Server-side generation at `/api/cv/pdf` (reads from D1, generates PDF, returns binary)
- OR client-side generation (dynamic import jspdf, fetch CV data, generate)
- Recommended: **client-side** (consistent with existing pattern, no server dependency)

**PDF structure:**
```
MARCO FRANCISCO RAMOS OLVERA
Sr. Motion Graphics Designer
marcoramos82@zohomail.com | +52 5530738888 | Guadalajara, Jalisco | marcomotion.com

────────────────────────────────────────

PROFESSIONAL EXPERIENCE

ENVATO Mexico                                              Feb 2018 - Jun 2024
Motion Graphics Designer | Guadalajara, Col. Americana
- Development of commercial animations for the global market
- Video Mockups Post-production

ZU Media                                                   Feb 2015 - Jan 2018
Production, Animation, and Post-Production Coordinator | CDMX, San Angel Inn
- Main accounts: HBO, Jim Beam Suntory, Natura Mexico, Tequila Hornitos

[... more positions ...]

────────────────────────────────────────

FREELANCE

Fundacion UNETE | CDMX, 2014
- Animation, Web Design and Postproduction contractor

[... more entries ...]

────────────────────────────────────────

EDUCATION

Render Farm Studios — CDMX, 2011
- Diploma in Composition for Post-production
- Diploma in 3D Animation

[... more entries ...]

────────────────────────────────────────

SKILLS

Hard Skills: Motion Graphics Design, Editing & Post-production, Video & Photography, Web Design
Technical: After Effects, Premiere, Photoshop, Illustrator, Final Cut, Cinema 4D, Fusion, ...
Creative: Concept development, Storytelling, Artistic design, Abstract animation, ...
Soft Skills: Creative problem-solving, Adaptability, Time management, ...

────────────────────────────────────────

AWARDS

- Envato Best Seller Award for Motion Graphics Design (2020)
- Envato Best Seller Award for Motion Graphics Design (2021)
- Envato Best Seller Award for Motion Graphics Design (2022)
- Envato Best Seller Award for Motion Graphics Design (2023)
```

### Phase 5: Seed Data + Deploy

- Run migration 0010 on production D1
- Seed all CV data from this spec (SQL INSERT statements)
- Update admin sidebar: enable CV Generator link
- Deploy via `npm run deploy`
- Test: admin CRUD, public section, PDF download

---

## Files to Create/Modify

### New Files
- `migrations/0010_cv_system.sql` — Tables + seed data
- `pages/admin/cv.js` — Admin CV management page
- `styles/AdminCV.module.css` — Admin CV styling
- `pages/api/cv/index.js` — Public GET (full CV JSON)
- `pages/api/admin/cv/meta.js` — Auth POST (meta info)
- `pages/api/admin/cv/sections/index.js` — Auth POST (create section)
- `pages/api/admin/cv/sections/[id].js` — Auth PUT/DELETE (section CRUD)
- `pages/api/admin/cv/reorder.js` — Auth POST (bulk reorder)
- `components/CVSection.js` — Public CV section component (or inline in index.js)

### Modified Files
- `components/Admin/AdminLayout.js` — Enable CV Generator nav link
- `pages/index.js` — Replace hardcoded experience section with API-driven CV section
- `locales/translations.js` — Add CV-related UI labels (keep experience data as fallback)

---

## Connection with Professional Log

The Professional Log (`professional_logs` table) complements the CV:
- CV = formal career history (static, updated occasionally)
- Professional Log = ongoing activity and growth (dynamic, updated frequently)

On the public page, after the formal CV sections, a "Recent Activity" block shows the last 3-5 professional logs. This tells recruiters/HRs: "this person is actively building, not just listing old jobs."

The Professional Log admin (`/admin/professional-log`) remains separate from CV admin. They are different data sources with different update frequencies.

---

## Password Gate
- Password: `caputdraconis` (already implemented in `pages/index.js` line 176)
- Unlocks the entire Professional Experience / CV section
- No changes needed to the password mechanism

---

## Estimated Effort
- Phase 1 (DB + API): ~30 min
- Phase 2 (Admin page): ~45 min
- Phase 3 (Public redesign): ~45 min
- Phase 4 (PDF generator): ~30 min
- Phase 5 (Seed + deploy): ~15 min
