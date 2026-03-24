/**
 * API: Admin CV Reorder
 * POST /api/admin/cv/reorder - Bulk update sort_order for sections
 * Body: { items: [{ id: "xxx", sort_order: 0 }, ...] }
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

  if (req.method === 'OPTIONS') return res.status(200).end();

  const auth = validateAuth(req);
  if (!auth.valid) {
    return res.status(401).json({ success: false, error: auth.error });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    let db = null;
    try {
      const { env } = await getCloudflareContext();
      db = env.DB;
    } catch (e) {
      return res.status(500).json({ success: false, error: 'Database not available' });
    }

    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'items array is required' });
    }

    const batch = items.map(({ id, sort_order }) =>
      db.prepare('UPDATE cv_sections SET sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .bind(sort_order, id)
    );

    await db.batch(batch);

    return res.status(200).json({ success: true, updated: items.length });
  } catch (error) {
    console.error('Admin CV reorder error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
