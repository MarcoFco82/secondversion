-- ===========================================
-- MIGRATION: 0007_creative_terminology.sql
-- Update entry_types and categories to creative terminology
-- Old entry types: build, ship, experiment, polish, study, wire
-- New entry types: interactive, commercial, tools, experimental, storytelling, videogame
-- Old categories: 50+ granular → 6 simplified creative categories
-- ===========================================

-- ===== PART 1: Update dev_logs entry_type constraint =====

-- Step 1: Create new dev_logs table with all entry types (new + old for compatibility)
CREATE TABLE IF NOT EXISTS dev_logs_new (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    entry_type TEXT NOT NULL CHECK(entry_type IN (
        'interactive', 'commercial', 'tools', 'experimental', 'storytelling', 'videogame',
        'build', 'ship', 'experiment', 'polish', 'study', 'wire',
        'feature', 'bugfix', 'refactor', 'migration', 'deploy', 'research'
    )),
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

-- ===== PART 2: Update project categories =====

-- Map old categories to new 6 creative categories
-- interactive: motion, animation, interactive-motion, creative-coding, threejs, generative, data-viz, web, saas, apps, frontend, fullstack, uiux, design
-- commercial: commercial, branding, product
-- tools: tool, automation, plugin, template, scripting, api, backend
-- experimental: experiment, prototype, vfx, shaders, ai-image, ai-video, ai-audio, prompt-engineering, 3d, modeling, realtime, sound-design, audio-visual, compositing, kinetic, transitions, typography, illustration
-- storytelling: storytelling, documentary, editing, color-grading, short-film, music-video, tutorial
-- videogame: (no existing maps, future use)

UPDATE projects SET category = 'interactive' WHERE category IN ('motion', 'animation', 'interactive-motion', 'creative-coding', 'threejs', 'generative', 'data-viz', 'web', 'saas', 'apps', 'frontend', 'fullstack', 'uiux', 'design');
UPDATE projects SET category = 'commercial' WHERE category IN ('commercial', 'branding', 'product');
UPDATE projects SET category = 'tools' WHERE category IN ('tool', 'automation', 'plugin', 'template', 'scripting', 'api', 'backend');
UPDATE projects SET category = 'experimental' WHERE category IN ('experiment', 'prototype', 'vfx', 'shaders', 'ai-image', 'ai-video', 'ai-audio', 'prompt-engineering', '3d', 'modeling', 'realtime', 'sound-design', 'audio-visual', 'compositing', 'kinetic', 'transitions', 'typography', 'illustration');
UPDATE projects SET category = 'storytelling' WHERE category IN ('storytelling', 'documentary', 'editing', 'color-grading', 'short-film', 'music-video', 'tutorial');

-- Catch-all: anything not mapped goes to experimental
UPDATE projects SET category = 'experimental' WHERE category NOT IN ('interactive', 'commercial', 'tools', 'experimental', 'storytelling', 'videogame');
