-- ===========================================
-- MARCOMOTION D1 DATABASE SCHEMA
-- Migration: 0001_initial_schema.sql
-- Based on: DevLog_Pipeline_Data_Model_v1
-- ===========================================

-- ===========================================
-- 1. PROJECTS TABLE
-- Central table for both Lab Hub and Apps & Projects
-- ===========================================
CREATE TABLE IF NOT EXISTS projects (
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
    category TEXT NOT NULL CHECK(category IN ('saas', 'web', 'threejs', 'tool', 'motion', 'experiment')),
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'completed', 'archived')),
    progress INTEGER DEFAULT 0 CHECK(progress >= 0 AND progress <= 100),
    tech_stack TEXT,
    external_url TEXT,
    keywords TEXT,
    is_featured INTEGER DEFAULT 0,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_code ON projects(code);

-- ===========================================
-- 2. DEV_LOGS TABLE
-- Development log entries linked to projects
-- ===========================================
CREATE TABLE IF NOT EXISTS dev_logs (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    entry_type TEXT NOT NULL CHECK(entry_type IN ('feature', 'bugfix', 'refactor', 'migration', 'deploy', 'research')),
    one_liner TEXT NOT NULL,
    challenge_abstract TEXT,
    mental_note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_dev_logs_project ON dev_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_dev_logs_type ON dev_logs(entry_type);
CREATE INDEX IF NOT EXISTS idx_dev_logs_created ON dev_logs(created_at DESC);

-- ===========================================
-- 3. PROJECT_MEDIA TABLE
-- Media gallery for each project
-- ===========================================
CREATE TABLE IF NOT EXISTS project_media (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    media_url TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK(media_type IN ('image', 'video', 'gif', 'vimeo', 'youtube')),
    caption_en TEXT,
    caption_es TEXT,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_project_media_project ON project_media(project_id);
CREATE INDEX IF NOT EXISTS idx_project_media_order ON project_media(display_order);

-- ===========================================
-- 4. ACTIVITY_METRICS TABLE
-- Daily aggregated metrics for ActivityPulse
-- ===========================================
CREATE TABLE IF NOT EXISTS activity_metrics (
    id TEXT PRIMARY KEY,
    date DATE UNIQUE NOT NULL,
    entry_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for date queries
CREATE INDEX IF NOT EXISTS idx_activity_date ON activity_metrics(date DESC);

-- ===========================================
-- 5. ADMIN_USERS TABLE (for authentication)
-- ===========================================
CREATE TABLE IF NOT EXISTS admin_users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
);

-- ===========================================
-- TRIGGER: Auto-update activity_metrics on log insert
-- ===========================================
CREATE TRIGGER IF NOT EXISTS update_activity_on_log_insert
AFTER INSERT ON dev_logs
BEGIN
    INSERT INTO activity_metrics (id, date, entry_count)
    VALUES (
        'activity-' || DATE(NEW.created_at),
        DATE(NEW.created_at),
        1
    )
    ON CONFLICT(date) DO UPDATE SET
        entry_count = entry_count + 1;
END;

-- ===========================================
-- TRIGGER: Auto-update updated_at on projects
-- ===========================================
CREATE TRIGGER IF NOT EXISTS update_projects_timestamp
AFTER UPDATE ON projects
BEGIN
    UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
