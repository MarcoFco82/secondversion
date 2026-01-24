/**
 * Local Dev API: Media Upload
 * POST /api/admin/media - Upload media (stores in public folder locally)
 * GET /api/admin/media?projectId=xxx - Get media for project
 */

import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// Initialize global store
if (!global.devMedia) global.devMedia = [];

export const config = {
  api: {
    bodyParser: false,
  },
};

function generateId(prefix = 'media') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default async function handler(req, res) {
  // Simple auth check
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const { projectId } = req.query;
    
    if (!projectId) {
      return res.status(400).json({ success: false, error: 'projectId required' });
    }

    const media = global.devMedia.filter(m => m.project_id === projectId);
    return res.status(200).json({ success: true, data: media });
  }

  if (req.method === 'POST') {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 50 * 1024 * 1024, // 50MB
    });

    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          res.status(500).json({ success: false, error: err.message });
          return resolve();
        }

        try {
          const projectId = Array.isArray(fields.projectId) ? fields.projectId[0] : fields.projectId;
          const captionEn = Array.isArray(fields.captionEn) ? fields.captionEn[0] : fields.captionEn;
          const captionEs = Array.isArray(fields.captionEs) ? fields.captionEs[0] : fields.captionEs;
          const displayOrder = parseInt(Array.isArray(fields.displayOrder) ? fields.displayOrder[0] : fields.displayOrder) || 0;
          const mediaType = Array.isArray(fields.mediaType) ? fields.mediaType[0] : fields.mediaType;
          const mediaUrl = Array.isArray(fields.mediaUrl) ? fields.mediaUrl[0] : fields.mediaUrl;

          let finalMediaUrl = mediaUrl;
          let finalMediaType = mediaType;

          // Handle file upload
          const file = files.file?.[0] || files.file;
          if (file && file.size > 0) {
            // Rename file to unique name
            const ext = path.extname(file.originalFilename || file.newFilename);
            const newFilename = `${generateId()}${ext}`;
            const newPath = path.join(uploadDir, newFilename);
            
            fs.renameSync(file.filepath, newPath);
            
            finalMediaUrl = `/uploads/${newFilename}`;
            
            // Determine type
            const mimeType = file.mimetype || '';
            if (mimeType.includes('gif')) {
              finalMediaType = 'gif';
            } else if (mimeType.startsWith('image/')) {
              finalMediaType = 'image';
            } else if (mimeType.startsWith('video/')) {
              finalMediaType = 'video';
            }
          }

          if (!finalMediaUrl) {
            res.status(400).json({ success: false, error: 'No file or URL provided' });
            return resolve();
          }

          const id = generateId();
          const mediaRecord = {
            id,
            project_id: projectId,
            media_url: finalMediaUrl,
            media_type: finalMediaType,
            caption_en: captionEn || null,
            caption_es: captionEs || null,
            display_order: displayOrder,
            created_at: new Date().toISOString(),
          };

          global.devMedia.push(mediaRecord);

          res.status(200).json({
            success: true,
            data: {
              id,
              url: finalMediaUrl,
              type: finalMediaType,
            },
            message: 'Media uploaded successfully',
          });
          resolve();
        } catch (error) {
          res.status(500).json({ success: false, error: error.message });
          resolve();
        }
      });
    });
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
