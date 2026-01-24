/**
 * Development API: Admin Projects [id]
 * GET /api/admin/projects/[id] - Get project with logs/media
 * PUT /api/admin/projects/[id] - Update project
 * DELETE /api/admin/projects/[id] - Delete project
 */

import { projects as staticProjects } from '../../../../data/projects';

const validateAuth = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'Missing authorization header' };
  }
  return { valid: true };
};

const generateId = (prefix = '') => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}-${timestamp}${random}` : `${timestamp}${random}`;
};

// In-memory stores for development
if (!global.devProjects) global.devProjects = [];
if (!global.devLogs) global.devLogs = [];
if (!global.devMedia) global.devMedia = [];

export default async function handler(req, res) {
  const { id } = req.query;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const auth = validateAuth(req);
  if (!auth.valid) {
    return res.status(401).json({ success: false, error: auth.error });
  }

  // GET - Fetch project with logs and media
  if (req.method === 'GET') {
    try {
      let project = global.devProjects.find(p => p.id === id);
      
      if (!project) {
        const staticProject = staticProjects.find(p => p.id === id);
        if (staticProject) {
          project = {
            id: staticProject.id,
            code: staticProject.code || `PRJ-${staticProject.id.toUpperCase().slice(0, 3)}`,
            alias: staticProject.alias || staticProject.id,
            display_name_en: staticProject.title?.en || staticProject.title,
            display_name_es: staticProject.title?.es || null,
            description_en: staticProject.description?.en || staticProject.description,
            description_es: staticProject.description?.es || null,
            accent_color: staticProject.accentColor || '#ffa742',
            category: staticProject.category,
            status: staticProject.status || 'active',
            progress: staticProject.progress || 0,
            tech_stack: JSON.stringify(staticProject.techStack || []),
            tags: JSON.stringify(staticProject.tags || staticProject.keywords || []),
            external_url: staticProject.externalUrl || null,
            is_featured: staticProject.isFeatured ? 1 : 0,
          };
        }
      }

      if (!project) {
        return res.status(404).json({ success: false, error: 'Project not found' });
      }

      const logs = global.devLogs.filter(l => l.project_id === id);
      const media = global.devMedia.filter(m => m.project_id === id);

      return res.status(200).json({
        success: true,
        data: { ...project, logs, media },
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // PUT - Update project
  if (req.method === 'PUT') {
    try {
      const body = req.body;
      let projectIndex = global.devProjects.findIndex(p => p.id === id);
      
      if (projectIndex === -1) {
        const staticProject = staticProjects.find(p => p.id === id);
        if (staticProject) {
          global.devProjects.push({
            id: staticProject.id,
            code: staticProject.code || `PRJ-${staticProject.id.toUpperCase().slice(0, 3)}`,
            alias: staticProject.alias || staticProject.id,
            display_name_en: staticProject.title?.en || staticProject.title,
            display_name_es: staticProject.title?.es || null,
            description_en: staticProject.description?.en || staticProject.description,
            description_es: staticProject.description?.es || null,
            accent_color: staticProject.accentColor || '#ffa742',
            category: staticProject.category,
            status: staticProject.status || 'active',
            progress: staticProject.progress || 0,
            tech_stack: JSON.stringify(staticProject.techStack || []),
            tags: JSON.stringify(staticProject.tags || staticProject.keywords || []),
            external_url: staticProject.externalUrl || null,
            is_featured: staticProject.isFeatured ? 1 : 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
          projectIndex = global.devProjects.length - 1;
        } else {
          return res.status(404).json({ success: false, error: 'Project not found' });
        }
      }

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
          global.devProjects[projectIndex][dbField] = body[jsField];
        }
      }

      if (body.techStack !== undefined) {
        global.devProjects[projectIndex].tech_stack = JSON.stringify(body.techStack);
      }
      if (body.tags !== undefined) {
        global.devProjects[projectIndex].tags = JSON.stringify(body.tags);
      }
      if (body.isFeatured !== undefined) {
        global.devProjects[projectIndex].is_featured = body.isFeatured ? 1 : 0;
      }

      global.devProjects[projectIndex].updated_at = new Date().toISOString();

      if (body.newLogs && Array.isArray(body.newLogs)) {
        for (const log of body.newLogs) {
          if (log.oneLiner && log.oneLiner.trim()) {
            global.devLogs.push({
              id: generateId('log'),
              project_id: id,
              entry_type: log.entryType || 'build',
              one_liner: log.oneLiner,
              challenge_abstract: log.challengeAbstract || null,
              mental_note: log.mentalNote || null,
              created_at: new Date().toISOString(),
            });
          }
        }
      }

      return res.status(200).json({ success: true, message: 'Project updated successfully' });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // DELETE - Delete project
  if (req.method === 'DELETE') {
    try {
      const projectIndex = global.devProjects.findIndex(p => p.id === id);
      
      if (projectIndex === -1) {
        const staticProject = staticProjects.find(p => p.id === id);
        if (!staticProject) {
          return res.status(404).json({ success: false, error: 'Project not found' });
        }
      }

      if (projectIndex !== -1) {
        global.devProjects.splice(projectIndex, 1);
      }
      
      global.devLogs = global.devLogs.filter(l => l.project_id !== id);
      global.devMedia = global.devMedia.filter(m => m.project_id !== id);

      return res.status(200).json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
