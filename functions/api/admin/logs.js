/**
 * Admin API: Dev Logs
 * POST /api/admin/logs - Create dev log entry
 */

import { validateAuth, generateId, corsHeaders } from './_middleware.js';

// Handle OPTIONS for CORS
export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders });
}

// POST - Create new dev log
export async function onRequestPost(context) {
  const { env, request } = context;

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
    const required = ['projectId', 'entryType', 'oneLiner'];
    for (const field of required) {
      if (!body[field]) {
        return Response.json({ 
          success: false, 
          error: `Missing required field: ${field}` 
        }, { status: 400, headers: corsHeaders });
      }
    }

    // Validate entry type
    const validTypes = ['build', 'ship', 'experiment', 'polish', 'study', 'wire'];
    if (!validTypes.includes(body.entryType)) {
      return Response.json({ 
        success: false, 
        error: `Invalid entry type. Must be one of: ${validTypes.join(', ')}` 
      }, { status: 400, headers: corsHeaders });
    }

    // Verify project exists
    const project = await env.DB.prepare(
      'SELECT id FROM projects WHERE id = ?'
    ).bind(body.projectId).first();

    if (!project) {
      return Response.json({ 
        success: false, 
        error: 'Project not found' 
      }, { status: 404, headers: corsHeaders });
    }

    const id = generateId('log');

    // Insert log (trigger will auto-update activity_metrics)
    await env.DB.prepare(`
      INSERT INTO dev_logs (
        id, project_id, entry_type, 
        one_liner, challenge_abstract, mental_note
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      body.projectId,
      body.entryType,
      body.oneLiner,
      body.challengeAbstract || null,
      body.mentalNote || null
    ).run();

    return Response.json({
      success: true,
      data: { id },
      message: 'Dev log created successfully',
    }, { headers: corsHeaders });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    }, { status: 500, headers: corsHeaders });
  }
}
