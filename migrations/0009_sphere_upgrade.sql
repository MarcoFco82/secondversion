-- Migration 0009: Sphere HUD Upgrade
-- Adds show_in_sphere toggle for projects
-- Adds project_id link for professional logs

-- Phase 1: Show in Sphere toggle
ALTER TABLE projects ADD COLUMN show_in_sphere INTEGER DEFAULT 1;

-- Phase 2: Professional Logs linked to projects
ALTER TABLE professional_logs ADD COLUMN project_id TEXT;
