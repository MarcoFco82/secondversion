/**
 * GET /api/logs
 * List dev logs with project data (public)
 * 
 * Query params:
 * - project_id: filter by project
 * - entry_type: filter by type (feature, bugfix, etc.)
 * - limit: number of results (default 20)
 */

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  
  const projectId = url.searchParams.get('project_id');
  const entryType = url.searchParams.get('entry_type');
  const limit = parseInt(url.searchParams.get('limit') || '20');

  try {
    let query = `
      SELECT 
        l.id,
        l.project_id,
        l.entry_type,
        l.one_liner,
        l.challenge_abstract,
        l.mental_note,
        l.created_at,
        p.code as project_code,
        p.alias as project_alias,
        p.accent_color,
        p.tech_stack,
        p.progress,
        p.category
      FROM dev_logs l
      JOIN projects p ON l.project_id = p.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (projectId) {
      query += ` AND l.project_id = ?`;
      params.push(projectId);
    }
    
    if (entryType) {
      query += ` AND l.entry_type = ?`;
      params.push(entryType);
    }
    
    query += ` ORDER BY l.created_at DESC LIMIT ?`;
    params.push(limit);

    const { results } = await env.DB.prepare(query).bind(...params).all();

    // Format logs
    const logs = results.map(log => ({
      id: log.id,
      projectId: log.project_id,
      projectCode: log.project_code,
      projectAlias: log.project_alias,
      entryType: log.entry_type,
      oneLiner: log.one_liner,
      challengeAbstract: log.challenge_abstract,
      mentalNote: log.mental_note,
      accentColor: log.accent_color,
      techStack: JSON.parse(log.tech_stack || '[]'),
      progress: log.progress,
      category: log.category,
      createdAt: log.created_at,
    }));

    return Response.json({
      success: true,
      data: logs,
      count: logs.length,
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
