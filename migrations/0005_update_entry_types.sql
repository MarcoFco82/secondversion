-- ===========================================
-- MIGRATION: 0005_update_entry_types.sql
-- Update dev_logs entry_type constraint for new types
-- Old: feature, bugfix, refactor, migration, deploy, research
-- New: build, ship, experiment, polish, study, wire
-- ===========================================

-- SQLite doesn't support ALTER COLUMN, so we need to recreate the table

-- Step 1: Create new dev_logs table with updated constraints
CREATE TABLE IF NOT EXISTS dev_logs_new (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    entry_type TEXT NOT NULL CHECK(entry_type IN ('build', 'ship', 'experiment', 'polish', 'study', 'wire', 'feature', 'bugfix', 'refactor', 'migration', 'deploy', 'research')),
    one_liner TEXT NOT NULL,
    challenge_abstract TEXT,
    mental_note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Step 2: Copy existing data
INSERT INTO dev_logs_new 
SELECT * FROM dev_logs;

-- Step 3: Drop old table
DROP TABLE dev_logs;

-- Step 4: Rename new table
ALTER TABLE dev_logs_new RENAME TO dev_logs;

-- Step 5: Recreate indices
CREATE INDEX IF NOT EXISTS idx_dev_logs_project ON dev_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_dev_logs_type ON dev_logs(entry_type);
CREATE INDEX IF NOT EXISTS idx_dev_logs_created ON dev_logs(created_at DESC);

-- Step 6: Recreate trigger for activity metrics
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
