/**
 * API: Public Media
 * GET /api/media?projectId=xxx - Get all media for a project (public)
 * 
 * Uses D1 database in production
 */

import { getCloudflareContext } from '@opennextjs/cloudflare';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { projectId } = req.query;

  if (!projectId) {
    return res.status(400).json({ success: false, error: 'projectId required' });
  }

  try {
    let media = [];

    // Try to get D1 database
    let db = null;
    try {
      const { env } = await getCloudflareContext();
      db = env.DB;
    } catch (e) {
      console.log('D1 not available');
    }

    if (db) {
      const result = await db.prepare(`
        SELECT * FROM project_media 
        WHERE project_id = ? 
        ORDER BY display_order ASC, created_at DESC
      `).bind(projectId).all();
      
      media = result.results || [];
    }

    return res.status(200).json({
      success: true,
      data: media,
    });

  } catch (error) {
    console.error('Get media error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
