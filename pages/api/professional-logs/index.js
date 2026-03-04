/**
 * API Route for Professional Logs (public)
 * GET /api/professional-logs - List professional logs
 * Query params: ?category=general&from=2026-01-01&to=2026-12-31
 */

import { getCloudflareContext } from '@opennextjs/cloudflare';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    let db = null;
    try {
      const { env } = await getCloudflareContext();
      db = env.DB;
    } catch (e) {
      console.log('D1 not available');
    }

    if (!db) {
      return res.status(200).json({ success: true, data: [] });
    }

    const { category, from, to } = req.query;

    let sql = 'SELECT * FROM professional_logs';
    const conditions = [];
    const params = [];

    if (category && category !== 'all') {
      conditions.push('category = ?');
      params.push(category);
    }
    if (from) {
      conditions.push('log_date >= ?');
      params.push(from);
    }
    if (to) {
      conditions.push('log_date <= ?');
      params.push(to);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY log_date DESC, created_at DESC';

    const stmt = db.prepare(sql);
    const result = params.length > 0 ? await stmt.bind(...params).all() : await stmt.all();

    return res.status(200).json({
      success: true,
      data: result.results || [],
    });
  } catch (error) {
    console.error('Get professional logs error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
