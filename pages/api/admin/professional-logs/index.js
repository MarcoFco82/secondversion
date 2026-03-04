/**
 * API: Admin Professional Logs
 * POST /api/admin/professional-logs - Create professional log entry
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
  return `plog-${timestamp}${random}`;
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
      const { content, category, mood, energy, media_url, media_type, log_date } = req.body;

      if (!content || !content.trim()) {
        return res.status(400).json({ success: false, error: 'Content is required' });
      }

      const id = generateId();
      const date = log_date || new Date().toISOString().split('T')[0];

      await db.prepare(`
        INSERT INTO professional_logs (id, content, category, mood, energy, media_url, media_type, log_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id,
        content.trim(),
        category || 'general',
        mood || null,
        energy || null,
        media_url || null,
        media_type || null,
        date
      ).run();

      return res.status(201).json({
        success: true,
        data: { id, content: content.trim(), category: category || 'general', log_date: date },
      });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Admin professional logs error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
