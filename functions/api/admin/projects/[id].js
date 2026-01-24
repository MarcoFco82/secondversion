/**
 * Admin API: Project Update/Delete
 * GET /api/admin/projects/[id] - Get project with logs and media
 * PUT /api/admin/projects/[id] - Update project
 * DELETE /api/admin/projects/[id] - Delete project
 */

import { validateAuth, generateId, corsHeaders } from '../_middleware.js';

// Handle OPTIONS for CORS
export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders });
}

// GET - Get project with related data
export async function onRequestGet(context) {
  const { env, request, params } = context;
  const { id } = params;

  const auth = await validateAuth(request, env);
  if (!auth.valid) {
    return Response.json({ success: false, error: auth.error }, { 
      status: 401, 
      headers: corsHeaders 
    });
  }

  try {
    // Get project
    const project = await env.DB.prepare(
      'SELECT * FROM projects WHERE id = ?'
    ).bind(id).first();

    if (!project) {
      return Response.json({ 
        success: false, 
        error: 'Project not found' 
      }, { status: 404, headers: corsHeaders });
    }

    // Get logs for this project
    const logsResult = await env.DB.prepare(
      'SELECT * FROM dev_logs WHERE project_id = ? ORDER BY created_at DESC'
    ).bind(id).all();

    // Get media for this project
    const mediaResult = await env.DB.prepare(
      'SELECT * FROM project_media WHERE project_id = ? ORDER BY display_order ASC'
    ).bind(id).all();

    return Response.json({
      success: true,
      data: {
        ...project,
        logs: logsResult.results || [],
        media: mediaResult.results || [],
      },
    }, { headers: corsHeaders });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    }, { status: 500, headers: corsHeaders });
  }
}

// PUT - Update project
export async function onRequestPut(context) {
  const { env, request, params } = context;
  const { id } = params;

  const auth = await validateAuth(request, env);
  if (!auth.valid) {
    return Response.json({ success: false, error: auth.error }, { 
      status: 401, 
      headers: corsHeaders 
    });
  }

  try {
    const body = await request.json();

    // Check project exists
    const existing = await env.DB.prepare(
      'SELECT id FROM projects WHERE id = ?'
    ).bind(id).first();

    if (!existing) {
      return Response.json({ 
        success: false, 
        error: 'Project not found' 
      }, { status: 404, headers: corsHeaders });
    }

    // Build dynamic update query
    const updates = [];
    const values = [];

    const fieldMap = {
      alias: 'alias',
      displayNameEn: 'display_name_en',
      displayNameEs: 'display_name_es',
      descriptionEn: 'description_en',
      descriptionEs: 'description_es',
      accentColor: 'accent_color',
      thumbnailUrl: 'thumbnail_url',
      featuredMediaUrl: 'featured_media_url',
      featuredMediaType: 'featured_media_type',
      category: 'category',
      status: 'status',
      progress: 'progress',
      externalUrl: 'external_url',
      displayOrder: 'display_order',
    };

    for (const [jsField, dbField] of Object.entries(fieldMap)) {
      if (body[jsField] !== undefined) {
        updates.push(`${dbField} = ?`);
        values.push(body[jsField]);
      }
    }

    // Handle JSON fields
    if (body.techStack !== undefined) {
      updates.push('tech_stack = ?');
      values.push(JSON.stringify(body.techStack));
    }
    if (body.tags !== undefined) {
      updates.push('tags = ?');
      values.push(JSON.stringify(body.tags));
    }
    if (body.isFeatured !== undefined) {
      updates.push('is_featured = ?');
      values.push(body.isFeatured ? 1 : 0);
    }

    if (updates.length === 0) {
      return Response.json({ 
        success: false, 
        error: 'No fields to update' 
      }, { status: 400, headers: corsHeaders });
    }

    values.push(id);
    
    await env.DB.prepare(`
      UPDATE projects SET ${updates.join(', ')} WHERE id = ?
    `).bind(...values).run();

    // Handle new logs if provided
    if (body.newLogs && Array.isArray(body.newLogs) && body.newLogs.length > 0) {
      for (const log of body.newLogs) {
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
      message: 'Project updated successfully',
    }, { headers: corsHeaders });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    }, { status: 500, headers: corsHeaders });
  }
}

// DELETE - Delete project
export async function onRequestDelete(context) {
  const { env, request, params } = context;
  const { id } = params;

  const auth = await validateAuth(request, env);
  if (!auth.valid) {
    return Response.json({ success: false, error: auth.error }, { 
      status: 401, 
      headers: corsHeaders 
    });
  }

  try {
    // Check project exists
    const existing = await env.DB.prepare(
      'SELECT id FROM projects WHERE id = ?'
    ).bind(id).first();

    if (!existing) {
      return Response.json({ 
        success: false, 
        error: 'Project not found' 
      }, { status: 404, headers: corsHeaders });
    }

    // Delete project (cascades to dev_logs and project_media)
    await env.DB.prepare('DELETE FROM projects WHERE id = ?').bind(id).run();

    return Response.json({
      success: true,
      message: 'Project deleted successfully',
    }, { headers: corsHeaders });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    }, { status: 500, headers: corsHeaders });
  }
}
