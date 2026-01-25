/**
 * API: Media Upload
 * POST /api/admin/media - Upload media to R2
 * GET /api/admin/media?projectId=xxx - Get media for project
 * DELETE /api/admin/media?id=xxx - Delete media
 * 
 * Uses R2 storage in production, local fallback for development
 */

import { getCloudflareContext } from '@opennextjs/cloudflare';

// In-memory fallback for development
if (!global.devMedia) global.devMedia = [];

function generateId(prefix = 'media') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

async function parseFormData(req) {
  const contentType = req.headers['content-type'] || '';
  
  if (!contentType.includes('multipart/form-data')) {
    // Handle JSON body
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const body = Buffer.concat(chunks).toString();
    return { fields: JSON.parse(body || '{}'), file: null };
  }

  // Parse multipart form data manually
  const boundary = contentType.split('boundary=')[1];
  if (!boundary) {
    throw new Error('No boundary found in multipart form data');
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  const body = buffer.toString('binary');

  const parts = body.split(`--${boundary}`).filter(part => 
    part.trim() && part.trim() !== '--'
  );

  const fields = {};
  let file = null;

  for (const part of parts) {
    if (part.trim() === '--') continue;
    
    const headerEnd = part.indexOf('\r\n\r\n');
    if (headerEnd === -1) continue;
    
    const headers = part.slice(0, headerEnd);
    const content = part.slice(headerEnd + 4).replace(/\r\n$/, '');

    const nameMatch = headers.match(/name="([^"]+)"/);
    const filenameMatch = headers.match(/filename="([^"]+)"/);
    const contentTypeMatch = headers.match(/Content-Type:\s*([^\r\n]+)/i);

    if (nameMatch) {
      const name = nameMatch[1];
      
      if (filenameMatch && content.length > 0) {
        // This is a file
        file = {
          name: filenameMatch[1],
          type: contentTypeMatch ? contentTypeMatch[1].trim() : 'application/octet-stream',
          data: Buffer.from(content, 'binary'),
        };
      } else {
        // This is a regular field
        fields[name] = content.trim();
      }
    }
  }

  return { fields, file };
}

export default async function handler(req, res) {
  // Auth check
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  // Get Cloudflare context
  let db = null;
  let r2 = null;
  try {
    const { env } = await getCloudflareContext();
    db = env.DB;
    r2 = env.MEDIA_BUCKET;
  } catch (e) {
    console.log('Cloudflare context not available, using fallback');
  }

  // GET - Fetch media for project
  if (req.method === 'GET') {
    const { projectId } = req.query;
    
    if (!projectId) {
      return res.status(400).json({ success: false, error: 'projectId required' });
    }

    try {
      let media = [];

      if (db) {
        const result = await db.prepare(
          'SELECT * FROM project_media WHERE project_id = ? ORDER BY display_order ASC'
        ).bind(projectId).all();
        media = result.results || [];
      } else {
        media = global.devMedia.filter(m => m.project_id === projectId);
      }

      return res.status(200).json({ success: true, data: media });
    } catch (error) {
      console.error('Get media error:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // DELETE - Remove media
  if (req.method === 'DELETE') {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ success: false, error: 'id required' });
    }

    try {
      if (db) {
        // Get media record to find R2 key
        const media = await db.prepare(
          'SELECT media_url FROM project_media WHERE id = ?'
        ).bind(id).first();

        if (media && r2) {
          // Extract R2 key from URL
          const url = media.media_url;
          if (url && url.includes('marcomotion-media')) {
            const key = url.split('/').pop();
            try {
              await r2.delete(key);
            } catch (e) {
              console.log('R2 delete error (non-fatal):', e);
            }
          }
        }

        await db.prepare('DELETE FROM project_media WHERE id = ?').bind(id).run();
      } else {
        const index = global.devMedia.findIndex(m => m.id === id);
        if (index !== -1) {
          global.devMedia.splice(index, 1);
        }
      }

      return res.status(200).json({ success: true, message: 'Media deleted' });
    } catch (error) {
      console.error('Delete media error:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // POST - Upload media
  if (req.method === 'POST') {
    try {
      const { fields, file } = await parseFormData(req);

      const projectId = fields.projectId;
      const captionEn = fields.captionEn || null;
      const captionEs = fields.captionEs || null;
      const displayOrder = parseInt(fields.displayOrder) || 0;
      let mediaType = fields.mediaType || 'image';
      let mediaUrl = fields.mediaUrl || null;

      // Handle file upload to R2
      if (file && file.data && file.data.length > 0) {
        const ext = file.name.split('.').pop().toLowerCase();
        const key = `${generateId()}.${ext}`;

        // Determine media type from file
        if (file.type.includes('gif')) {
          mediaType = 'gif';
        } else if (file.type.startsWith('image/')) {
          mediaType = 'image';
        } else if (file.type.startsWith('video/')) {
          mediaType = 'video';
        }

        if (r2) {
          // Upload to R2
          await r2.put(key, file.data, {
            httpMetadata: {
              contentType: file.type,
            },
          });

          // Construct public URL
          // R2 public access URL pattern: https://pub-{hash}.r2.dev/{key}
          // Or custom domain if configured
          mediaUrl = `https://media.marcomotion.com/${key}`;
          
          // If no custom domain, use R2.dev URL (need to enable public access)
          // For now, store the key and we'll configure the URL later
          mediaUrl = `/api/media/${key}`;
        } else {
          // Development fallback - store base64
          mediaUrl = `data:${file.type};base64,${file.data.toString('base64')}`;
        }
      }

      // Handle external URLs (vimeo, youtube)
      if (!mediaUrl && fields.externalUrl) {
        mediaUrl = fields.externalUrl;
        if (mediaUrl.includes('vimeo.com')) {
          mediaType = 'vimeo';
        } else if (mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be')) {
          mediaType = 'youtube';
        }
      }

      if (!mediaUrl) {
        return res.status(400).json({ success: false, error: 'No file or URL provided' });
      }

      if (!projectId) {
        return res.status(400).json({ success: false, error: 'projectId required' });
      }

      const id = generateId();
      const now = new Date().toISOString();

      if (db) {
        await db.prepare(`
          INSERT INTO project_media (id, project_id, media_url, media_type, caption_en, caption_es, display_order, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(id, projectId, mediaUrl, mediaType, captionEn, captionEs, displayOrder, now).run();
      } else {
        global.devMedia.push({
          id,
          project_id: projectId,
          media_url: mediaUrl,
          media_type: mediaType,
          caption_en: captionEn,
          caption_es: captionEs,
          display_order: displayOrder,
          created_at: now,
        });
      }

      return res.status(200).json({
        success: true,
        data: { id, url: mediaUrl, type: mediaType },
        message: 'Media uploaded successfully',
      });

    } catch (error) {
      console.error('Upload media error:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
