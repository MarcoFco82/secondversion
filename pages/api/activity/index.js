/**
 * API Route for Activity Metrics
 * GET /api/activity - Get 14-day activity metrics
 * 
 * Uses D1 database in production
 */

import { getCloudflareContext } from '@opennextjs/cloudflare';
import { ACTIVITY_METRICS } from '../../../data/projects';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    let activity = [];

    // Try to get D1 database
    let db = null;
    try {
      const { env } = await getCloudflareContext();
      db = env.DB;
    } catch (e) {
      console.log('D1 not available, using fallback');
    }

    if (db) {
      // === PRODUCTION: Calculate from dev_logs ===
      const result = await db.prepare(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as entry_count
        FROM dev_logs
        WHERE created_at >= DATE('now', '-14 days')
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `).all();
      
      activity = (result.results || []).map(m => ({
        id: `activity-${m.date}`,
        date: m.date,
        entry_count: m.entry_count,
      }));
    } else {
      // === DEVELOPMENT: Use static data ===
      activity = ACTIVITY_METRICS.map(m => ({
        id: `activity-${m.date}`,
        date: m.date,
        entry_count: m.entryCount,
      }));
    }

    return res.status(200).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    console.error('Get activity error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}