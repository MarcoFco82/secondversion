-- ===========================================
-- MIGRATION: 0004_expand_categories.sql
-- Expand category options and add tags field
-- ===========================================

-- SQLite doesn't support ALTER COLUMN, so we need to:
-- 1. Create new table with updated constraints
-- 2. Copy data
-- 3. Drop old table
-- 4. Rename new table

-- Step 1: Create new projects table with expanded categories
CREATE TABLE IF NOT EXISTS projects_new (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    alias TEXT NOT NULL,
    display_name_en TEXT NOT NULL,
    display_name_es TEXT,
    description_en TEXT,
    description_es TEXT,
    accent_color TEXT DEFAULT '#ffa742',
    thumbnail_url TEXT,
    featured_media_url TEXT,
    featured_media_type TEXT CHECK(featured_media_type IN ('image', 'video', 'gif', 'vimeo', 'youtube')),
    category TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'completed', 'archived')),
    progress INTEGER DEFAULT 0 CHECK(progress >= 0 AND progress <= 100),
    tech_stack TEXT,
    tags TEXT,
    external_url TEXT,
    is_featured INTEGER DEFAULT 0,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Step 2: Copy existing data (keywords -> tags)
INSERT INTO projects_new 
SELECT 
    id, code, alias,
    display_name_en, display_name_es,
    description_en, description_es,
    accent_color, thumbnail_url,
    featured_media_url, featured_media_type,
    category, status, progress,
    tech_stack,
    keywords,
    external_url,
    is_featured, display_order,
    created_at, updated_at
FROM projects;

-- Step 3: Drop old table
DROP TABLE projects;

-- Step 4: Rename new table
ALTER TABLE projects_new RENAME TO projects;

-- Step 5: Recreate indices
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_code ON projects(code);

-- Step 6: Recreate trigger
CREATE TRIGGER IF NOT EXISTS update_projects_timestamp
AFTER UPDATE ON projects
BEGIN
    UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
