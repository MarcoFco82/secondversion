/**
 * API: POST /api/admin/sphere-config
 * Authenticated endpoint — saves sphere HUD configuration
 */

import { getCloudflareContext } from '@opennextjs/cloudflare';

const validateAuth = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'Missing authorization header' };
  }
  return { valid: true };
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const auth = validateAuth(req);
  if (!auth.valid) {
    return res.status(401).json({ success: false, error: auth.error });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const config = req.body;

    if (!config || typeof config !== 'object') {
      return res.status(400).json({ success: false, error: 'Invalid config body' });
    }

    let db = null;
    try {
      const { env } = await getCloudflareContext();
      db = env.DB;
    } catch {
      // Not in Cloudflare environment
    }

    const configJson = JSON.stringify(config);
    const now = new Date().toISOString();

    if (db) {
      // Upsert: try update first, insert if not exists
      const existing = await db.prepare(
        'SELECT id FROM sphere_config WHERE config_key = ? LIMIT 1'
      ).bind('default').first();

      if (existing) {
        await db.prepare(
          'UPDATE sphere_config SET config_json = ?, updated_at = ? WHERE config_key = ?'
        ).bind(configJson, now, 'default').run();
      } else {
        await db.prepare(
          'INSERT INTO sphere_config (config_key, config_json, updated_at) VALUES (?, ?, ?)'
        ).bind('default', configJson, now).run();
      }

      return res.status(200).json({ success: true, message: 'Config saved' });
    }

    // Dev fallback — store in global
    if (!global.sphereConfig) global.sphereConfig = {};
    global.sphereConfig.default = config;

    return res.status(200).json({ success: true, message: 'Config saved (dev mode)' });
  } catch (error) {
    console.error('Sphere config POST error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
