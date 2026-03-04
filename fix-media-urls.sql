-- Fix Media URLs: Change from broken proxy URLs to direct R2 URLs
-- Run with: npx wrangler d1 execute DB --remote --file=fix-media-urls.sql

-- First, let's see what needs fixing
SELECT
  id,
  project_id,
  media_url,
  REPLACE(media_url, 'https://marcomotion.com/api/media/', 'https://pub-53d4a6f5b3144ad7aaceddf9c6415871.r2.dev/') as new_url
FROM project_media
WHERE media_url LIKE '%marcomotion.com/api/media/%';

-- Update all broken proxy URLs to direct R2 URLs
UPDATE project_media
SET media_url = REPLACE(media_url, 'https://marcomotion.com/api/media/', 'https://pub-53d4a6f5b3144ad7aaceddf9c6415871.r2.dev/')
WHERE media_url LIKE '%marcomotion.com/api/media/%';

-- Verify the fix
SELECT
  COUNT(*) as total_media,
  SUM(CASE WHEN media_url LIKE '%marcomotion.com/api/media/%' THEN 1 ELSE 0 END) as still_broken,
  SUM(CASE WHEN media_url LIKE '%pub-53d4a6f5b3144ad7aaceddf9c6415871.r2.dev/%' THEN 1 ELSE 0 END) as fixed
FROM project_media;
