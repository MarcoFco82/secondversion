-- Migration 0006: Sphere HUD Configuration
-- Stores sphere visual config as JSON blob, keyed by name

CREATE TABLE IF NOT EXISTS sphere_config (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  config_key TEXT NOT NULL UNIQUE DEFAULT 'default',
  config_json TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Seed with defaults
INSERT INTO sphere_config (config_key, config_json, updated_at) VALUES (
  'default',
  '{"hexCount":30,"bloomThreshold":0.6,"bloomIntensity":0.8,"bloomSmoothing":0.4,"particleColor":"#38bdf8","particleSize":0.008,"particleOpacity":0.6,"strokeColor":"#38bdf8","strokeOpacity":1.0,"ghostSphereColor":"#38bdf8","ghostSphereOpacity":0.06,"inactiveFillOpacity":0.02,"activeEmissiveBase":0.3,"activeEmissiveHover":0.8,"activeEmissiveSelected":2.0,"bgGradientTop":"#0f1923","bgGradientBottom":"#0a0a0a"}',
  datetime('now')
);
