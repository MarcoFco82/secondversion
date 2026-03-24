-- Migration 0010: CV System tables
-- cv_sections: typed entries for experience, freelance, education, skills, awards
-- cv_meta: personal info (one record per language)

CREATE TABLE IF NOT EXISTS cv_sections (
    id TEXT PRIMARY KEY,
    section_type TEXT NOT NULL,
    title TEXT,
    subtitle TEXT,
    location TEXT,
    date_start TEXT,
    date_end TEXT,
    description TEXT,
    bullets TEXT,
    skill_category TEXT,
    items TEXT,
    sort_order INTEGER DEFAULT 0,
    lang TEXT DEFAULT 'en',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cv_meta (
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
