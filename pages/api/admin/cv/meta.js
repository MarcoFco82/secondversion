/**
 * API: Admin CV Meta
 * POST /api/admin/cv/meta - Create or update CV personal info
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

    if (req.method === 'POST') {
      const { full_name, professional_title, email, phone, location, website, bio, lang } = req.body;

      if (!full_name || !full_name.trim()) {
        return res.status(400).json({ success: false, error: 'Full name is required' });
      }

      const langVal = lang || 'en';
      const id = `cv-meta-${langVal}`;

      await db.prepare(`
        INSERT INTO cv_meta (id, full_name, professional_title, email, phone, location, website, bio, lang, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET
          full_name = excluded.full_name,
          professional_title = excluded.professional_title,
          email = excluded.email,
          phone = excluded.phone,
          location = excluded.location,
          website = excluded.website,
          bio = excluded.bio,
          updated_at = CURRENT_TIMESTAMP
      `).bind(
        id,
        full_name.trim(),
        professional_title || null,
        email || null,
        phone || null,
        location || null,
        website || null,
        bio || null,
        langVal
      ).run();

      return res.status(200).json({
        success: true,
        data: { id, full_name: full_name.trim(), lang: langVal },
      });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Admin CV meta error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
