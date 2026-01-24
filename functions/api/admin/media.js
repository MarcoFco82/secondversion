/**
 * Admin API: Media Upload
 * POST /api/admin/media - Upload media to R2 and create record
 */

import { validateAuth, generateId, corsHeaders } from './_middleware.js';

// Handle OPTIONS for CORS
export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders });
}

// POST - Upload media
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
    const formData = await request.formData();
    
    const projectId = formData.get('projectId');
    const file = formData.get('file');
    const captionEn = formData.get('captionEn');
    const captionEs = formData.get('captionEs');
    const displayOrder = parseInt(formData.get('displayOrder') || '0');
    const mediaType = formData.get('mediaType'); // For URL-based media (vimeo, youtube)
    const mediaUrl = formData.get('mediaUrl'); // For URL-based media

    // Validate project exists
    const project = await env.DB.prepare(
      'SELECT id FROM projects WHERE id = ?'
    ).bind(projectId).first();

    if (!project) {
      return Response.json({ 
        success: false, 
        error: 'Project not found' 
      }, { status: 404, headers: corsHeaders });
    }

    let finalMediaUrl = mediaUrl;
    let finalMediaType = mediaType;

    // If file is provided, upload to R2
    if (file && file.size > 0) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
      if (!allowedTypes.includes(file.type)) {
        return Response.json({ 
          success: false, 
          error: 'Invalid file type. Allowed: jpeg, png, gif, webp, mp4, webm' 
        }, { status: 400, headers: corsHeaders });
      }

      // Generate unique filename
      const ext = file.name.split('.').pop();
      const filename = `${projectId}/${generateId()}_.${ext}`;

      // Upload to R2
      await env.MEDIA_BUCKET.put(filename, file.stream(), {
        httpMetadata: {
          contentType: file.type,
        },
      });

      // Construct public URL (adjust based on your R2 public access setup)
      finalMediaUrl = `/media/${filename}`;
      
      // Determine media type from file
      if (file.type.startsWith('image/gif')) {
        finalMediaType = 'gif';
      } else if (file.type.startsWith('image/')) {
        finalMediaType = 'image';
      } else if (file.type.startsWith('video/')) {
        finalMediaType = 'video';
      }
    }

    if (!finalMediaUrl) {
      return Response.json({ 
        success: false, 
        error: 'No file or media URL provided' 
      }, { status: 400, headers: corsHeaders });
    }

    // Create database record
    const id = generateId('media');

    await env.DB.prepare(`
      INSERT INTO project_media (
        id, project_id, media_url, media_type,
        caption_en, caption_es, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      projectId,
      finalMediaUrl,
      finalMediaType,
      captionEn || null,
      captionEs || null,
      displayOrder
    ).run();

    return Response.json({
      success: true,
      data: { 
        id, 
        url: finalMediaUrl,
        type: finalMediaType,
      },
      message: 'Media uploaded successfully',
    }, { headers: corsHeaders });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    }, { status: 500, headers: corsHeaders });
  }
}
