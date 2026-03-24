/**
 * API: Admin CV Sections
 * GET /api/admin/cv/sections - List all sections (with auth)
 * POST /api/admin/cv/sections - Create a new section entry
 */

import { getCloudflareContext } from '@opennextjs/cloudflare';

const validateAuth = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'Missing authorization header' };
  }
  return { valid: true };
};

const generateId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `cv-${timestamp}${random}`;
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const auth = validateAuth(req);
  if (!auth.valid) {
    return res.status(401).json({ success: false, error: auth.error });
  }

  try {
    let db = null;
    try {
      const { env } = await getCloudflareContext();
      db = env.DB;
    } catch (e) {
      return res.status(500).json({ success: false, error: 'Database not available' });
    }

    if (req.method === 'GET') {
      const lang = req.query.lang || 'en';
      const result = await db.prepare(
        'SELECT * FROM cv_sections WHERE lang = ? ORDER BY section_type, sort_order ASC'
      ).bind(lang).all();

      return res.status(200).json({
        success: true,
        data: result.results || [],
      });
    }

    if (req.method === 'POST') {
      const {
        section_type, title, subtitle, location,
        date_start, date_end, description, bullets,
        skill_category, items, sort_order, lang
      } = req.body;

      if (!section_type) {
        return res.status(400).json({ success: false, error: 'section_type is required' });
      }

      const id = generateId();

      await db.prepare(`
        INSERT INTO cv_sections (id, section_type, title, subtitle, location, date_start, date_end, description, bullets, skill_category, items, sort_order, lang)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id,
        section_type,
        title || null,
        subtitle || null,
        location || null,
        date_start || null,
        date_end || null,
        description || null,
        bullets ? JSON.stringify(bullets) : null,
        skill_category || null,
        items ? JSON.stringify(items) : null,
        sort_order ?? 0,
        lang || 'en'
      ).run();

      return res.status(201).json({
        success: true,
        data: { id, section_type, title },
      });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Admin CV sections error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
