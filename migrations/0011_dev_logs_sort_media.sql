-- Migration 0011: Add sort_order and media_id to dev_logs
-- sort_order: manual priority (lower = shown first, 0 = default)
-- media_id: links to project_media.id for displaying media when log is selected
ALTER TABLE dev_logs ADD COLUMN sort_order INTEGER DEFAULT 0;
ALTER TABLE dev_logs ADD COLUMN media_id TEXT;
