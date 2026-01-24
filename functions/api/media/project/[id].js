/**
 * GET /api/media/project/[id]
 * Get all media for a project (public)
 */

export async function onRequestGet(context) {
  const { env, params } = context;
  const { id } = params;

  try {
    // First get project to validate it exists
    const project = await env.DB.prepare(`
      SELECT id, code, display_name_en, accent_color
      FROM projects
      WHERE id = ? OR code = ?
    `).bind(id, id).first();

    if (!project) {
      return Response.json({
        success: false,
        error: 'Project not found',
      }, { status: 404 });
    }

    // Get all media for project
    const { results } = await env.DB.prepare(`
      SELECT 
        id, 
        media_url, 
        media_type, 
        caption_en, 
        caption_es, 
        display_order, 
        created_at
      FROM project_media
      WHERE project_id = ?
      ORDER BY display_order ASC, created_at DESC
    `).bind(project.id).all();

    const media = results.map(m => ({
      id: m.id,
      url: m.media_url,
      type: m.media_type,
      caption: {
        en: m.caption_en,
        es: m.caption_es,
      },
      displayOrder: m.display_order,
      createdAt: m.created_at,
    }));

    return Response.json({
      success: true,
      data: media,
      project: {
        id: project.id,
        code: project.code,
        name: project.display_name_en,
        accentColor: project.accent_color,
      },
      count: media.length,
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
