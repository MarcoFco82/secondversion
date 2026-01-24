/**
 * API Route for Dev Logs
 * GET /api/logs - List all dev logs
 * 
 * Uses D1 database in production, fallback for development
 */

import { getCloudflareContext } from '@opennextjs/cloudflare';
import { DEV_LOGS, getProjectById } from '../../../data/projects';

// In-memory store fallback
if (!global.devLogs) global.devLogs = [];

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    let logs = [];

    // Try to get D1 database
    let db = null;
    try {
      const { env } = await getCloudflareContext();
      db = env.DB;
    } catch (e) {
      console.log('D1 not available, using fallback');
    }

    if (db) {
      // === PRODUCTION: Use D1 ===
      const result = await db.prepare(`
        SELECT 
          dl.*,
          p.code as project_code,
          p.alias as project_alias,
          p.accent_color as project_color
        FROM dev_logs dl
        LEFT JOIN projects p ON dl.project_id = p.id
        ORDER BY dl.created_at DESC
      `).all();
      
      logs = result.results || [];
    } else {
      // === DEVELOPMENT: Use static + in-memory ===
      
      // Static logs
      const staticLogs = DEV_LOGS.map(log => {
        const project = getProjectById(log.projectId);
        return {
          id: log.id,
          project_id: log.projectId,
          entry_type: log.entryType,
          one_liner: log.oneLiner,
          challenge_abstract: log.challengeAbstract,
          mental_note: log.mentalNote,
          created_at: log.createdAt,
          project_code: project?.code,
          project_alias: project?.alias,
        };
      });

      // Combine with in-memory logs
      logs = [...global.devLogs, ...staticLogs];
      logs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    console.error('Get logs error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}