/**
 * API: GET /api/sphere-config
 * Public endpoint — returns sphere HUD configuration
 */

import { getCloudflareContext } from '@opennextjs/cloudflare';

const DEFAULTS = {
  hexCount: 30,
  bloomThreshold: 0.6,
  bloomIntensity: 0.8,
  bloomSmoothing: 0.4,
  particleColor: '#38bdf8',
  particleSize: 0.008,
  particleOpacity: 0.6,
  strokeColor: '#38bdf8',
  strokeOpacity: 1.0,
  ghostSphereColor: '#38bdf8',
  ghostSphereOpacity: 0.06,
  inactiveFillOpacity: 0.02,
  activeEmissiveBase: 0.3,
  activeEmissiveHover: 0.8,
  activeEmissiveSelected: 2.0,
  bgGradientTop: '#0f1923',
  bgGradientBottom: '#0a0a0a',
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    let db = null;
    try {
      const { env } = await getCloudflareContext();
      db = env.DB;
    } catch {
      // Not in Cloudflare environment
    }

    if (db) {
      const row = await db.prepare(
        'SELECT config_json FROM sphere_config WHERE config_key = ? LIMIT 1'
      ).bind('default').first();

      if (row?.config_json) {
        const config = { ...DEFAULTS, ...JSON.parse(row.config_json) };
        return res.status(200).json({ success: true, data: config });
      }
    }

    // Fallback to defaults
    return res.status(200).json({ success: true, data: DEFAULTS });
  } catch (error) {
    console.error('Sphere config GET error:', error);
    return res.status(200).json({ success: true, data: DEFAULTS });
  }
}
