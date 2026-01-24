/**
 * Next.js API Route for Dev Logs (Development)
 * GET /api/logs - List all dev logs
 */

import { DEV_LOGS, getProjectById } from '../../../data/projects';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Transform to match D1 response format
    const logs = DEV_LOGS.map(log => {
      const project = getProjectById(log.projectId);
      return {
        id: log.id,
        project_id: log.projectId,
        entry_type: log.entryType,
        one_liner: log.oneLiner,
        challenge_abstract: log.challengeAbstract,
        mental_note: log.mentalNote,
        created_at: log.createdAt,
        // Include project info for convenience
        project_code: project?.code,
        project_alias: project?.alias,
      };
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}