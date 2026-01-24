/**
 * Admin API: Projects CRUD
 * POST /api/admin/projects - Create project
 * 
 * All admin endpoints require Authorization header
 */

import { validateAuth, generateId, generateProjectCode, corsHeaders } from './_middleware.js';

// Handle OPTIONS for CORS
export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders });
}

// POST - Create new project
export async function onRequestPost(context) {
  const { env, request } = context;

  // Validate auth
  const auth = await validateAuth(request, env);
  if (!auth.valid) {
    return Response.json({ success: false, error: auth.error }, { 
      status: 401, 
      headers: corsHeaders 
    });
  }

  try {
    const body = await request.json();
    
    // Validate required fields
    const required = ['alias', 'displayNameEn', 'category'];
    for (const field of required) {
      if (!body[field]) {
        return Response.json({ 
          success: false, 
          error: `Missing required field: ${field}` 
        }, { status: 400, headers: corsHeaders });
      }
    }

    const id = generateId('proj');
    const code = body.code || generateProjectCode();

    await env.DB.prepare(`
      INSERT INTO projects (
        id, code, alias,
        display_name_en, display_name_es,
        description_en, description_es,
        accent_color, thumbnail_url,
        featured_media_url, featured_media_type,
        category, status, progress,
        tech_stack, tags, external_url,
        is_featured, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      code,
      body.alias,
      body.displayNameEn,
      body.displayNameEs || null,
      body.descriptionEn || null,
      body.descriptionEs || null,
      body.accentColor || '#ffa742',
      body.thumbnailUrl || null,
      body.featuredMediaUrl || null,
      body.featuredMediaType || null,
      body.category,
      body.status || 'active',
      body.progress || 0,
      JSON.stringify(body.techStack || []),
      JSON.stringify(body.tags || []),
      body.externalUrl || null,
      body.isFeatured ? 1 : 0,
      body.displayOrder || 0
    ).run();

    // If logs are provided, insert them
    if (body.logs && Array.isArray(body.logs) && body.logs.length > 0) {
      for (const log of body.logs) {
        if (log.oneLiner && log.oneLiner.trim()) {
          const logId = generateId('log');
          await env.DB.prepare(`
            INSERT INTO dev_logs (
              id, project_id, entry_type,
              one_liner, challenge_abstract, mental_note
            ) VALUES (?, ?, ?, ?, ?, ?)
          `).bind(
            logId,
            id,
            log.entryType || 'build',
            log.oneLiner,
            log.challengeAbstract || null,
            log.mentalNote || null
          ).run();
        }
      }
    }

    return Response.json({
      success: true,
      data: { id, code },
      message: 'Project created successfully',
    }, { headers: corsHeaders });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    }, { status: 500, headers: corsHeaders });
  }
}
