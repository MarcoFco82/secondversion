-- ===========================================
-- MIGRATION: 0008_professional_logs.sql
-- Professional Log — personal diary separate from projects
-- ===========================================

CREATE TABLE IF NOT EXISTS professional_logs (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'general' CHECK(category IN (
        'interactive', 'commercial', 'tools', 'experimental', 'storytelling', 'videogame', 'general'
    )),
    mood TEXT,
    energy INTEGER CHECK(energy >= 1 AND energy <= 5),
    media_url TEXT,
    media_type TEXT CHECK(media_type IN ('image', 'video', 'gif', NULL)),
    log_date DATE NOT NULL DEFAULT (DATE('now')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_professional_logs_date ON professional_logs(log_date DESC);
CREATE INDEX IF NOT EXISTS idx_professional_logs_category ON professional_logs(category);

CREATE TRIGGER IF NOT EXISTS update_professional_logs_timestamp
AFTER UPDATE ON professional_logs
BEGIN
    UPDATE professional_logs SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
