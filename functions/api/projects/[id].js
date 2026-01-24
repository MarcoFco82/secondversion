/**
 * GET /api/projects/[id]
 * Get single project by ID (public)
 */

export async function onRequestGet(context) {
  const { env, params } = context;
  const { id } = params;

  try {
    const project = await env.DB.prepare(`
      SELECT 
        id, code, alias,
        display_name_en, display_name_es,
        description_en, description_es,
        accent_color, thumbnail_url,
        featured_media_url, featured_media_type,
        category, status, progress,
        tech_stack, external_url, keywords,
        is_featured, display_order,
        created_at, updated_at
      FROM projects
      WHERE id = ? OR code = ?
    `).bind(id, id).first();

    if (!project) {
      return Response.json({
        success: false,
        error: 'Project not found',
      }, { status: 404 });
    }

    // Get project media
    const { results: media } = await env.DB.prepare(`
      SELECT id, media_url, media_type, caption_en, caption_es, display_order, created_at
      FROM project_media
      WHERE project_id = ?
      ORDER BY display_order ASC
    `).bind(project.id).all();

    // Get project logs
    const { results: logs } = await env.DB.prepare(`
      SELECT id, entry_type, one_liner, challenge_abstract, mental_note, created_at
      FROM dev_logs
      WHERE project_id = ?
      ORDER BY created_at DESC
      LIMIT 10
    `).bind(project.id).all();

    // Format response
    const formattedProject = {
      ...project,
      techStack: JSON.parse(project.tech_stack || '[]'),
      keywords: JSON.parse(project.keywords || '[]'),
      isFeatured: Boolean(project.is_featured),
      displayName: {
        en: project.display_name_en,
        es: project.display_name_es,
      },
      description: {
        en: project.description_en,
        es: project.description_es,
      },
      media: media.map(m => ({
        ...m,
        caption: {
          en: m.caption_en,
          es: m.caption_es,
        },
      })),
      logs,
    };

    return Response.json({
      success: true,
      data: formattedProject,
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
