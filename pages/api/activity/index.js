/**
 * Next.js API Route for Activity Metrics (Development)
 * GET /api/activity - Get 14-day activity metrics
 */

import { ACTIVITY_METRICS } from '../../../data/projects';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Transform to match D1 response format
    const activity = ACTIVITY_METRICS.map(m => ({
      id: `activity-${m.date}`,
      date: m.date,
      entry_count: m.entryCount,
    }));

    return res.status(200).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}