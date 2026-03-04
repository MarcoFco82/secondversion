/**
 * API: Admin Professional Logs - Single entry
 * PUT /api/admin/professional-logs/[id] - Update entry
 * DELETE /api/admin/professional-logs/[id] - Delete entry
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
  res.setHeader('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const auth = validateAuth(req);
  if (!auth.valid) {
    return res.status(401).json({ success: false, error: auth.error });
  }

  const { id } = req.query;

  try {
    let db = null;
    try {
      const { env } = await getCloudflareContext();
      db = env.DB;
    } catch (e) {
      return res.status(500).json({ success: false, error: 'Database not available' });
    }

    if (req.method === 'PUT') {
      const { content, category, mood, energy, media_url, media_type, log_date } = req.body;

      if (!content || !content.trim()) {
        return res.status(400).json({ success: false, error: 'Content is required' });
      }

      await db.prepare(`
        UPDATE professional_logs
        SET content = ?, category = ?, mood = ?, energy = ?, media_url = ?, media_type = ?, log_date = ?
        WHERE id = ?
      `).bind(
        content.trim(),
        category || 'general',
        mood || null,
        energy || null,
        media_url || null,
        media_type || null,
        log_date || new Date().toISOString().split('T')[0],
        id
      ).run();

      return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
      await db.prepare('DELETE FROM professional_logs WHERE id = ?').bind(id).run();
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Admin professional log error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
