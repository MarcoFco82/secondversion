/**
 * GET /api/projects
 * List all projects (public)
 * 
 * Query params:
 * - category: filter by category
 * - status: filter by status
 * - featured: filter featured only (true/false)
 */

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  
  // Query params
  const category = url.searchParams.get('category');
  const status = url.searchParams.get('status');
  const featured = url.searchParams.get('featured');

  try {
    let query = `
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
      WHERE 1=1
    `;
    
    const params = [];
    
    if (category) {
      query += ` AND category = ?`;
      params.push(category);
    }
    
    if (status) {
      query += ` AND status = ?`;
      params.push(status);
    }
    
    if (featured === 'true') {
      query += ` AND is_featured = 1`;
    }
    
    query += ` ORDER BY display_order ASC, created_at DESC`;

    const { results } = await env.DB.prepare(query).bind(...params).all();

    // Parse JSON fields
    const projects = results.map(project => ({
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
    }));

    return Response.json({
      success: true,
      data: projects,
      count: projects.length,
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
