/**
 * Development API: Admin Projects
 * POST /api/admin/projects - Create project
 * 
 * This is for local development only.
 * In production, Cloudflare Functions handle this.
 */

import { PROJECTS as staticProjects } from '../../../../data/projects';

// Simple token validation for development
const validateAuth = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'Missing authorization header' };
  }
  // In dev, accept any token that was set during login
  return { valid: true };
};

// Generate unique ID
const generateId = (prefix = '') => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}-${timestamp}${random}` : `${timestamp}${random}`;
};

// Generate project code
const generateProjectCode = () => {
  const greekLetters = ['A', 'B', 'G', 'D', 'E', 'Z', 'H', 'Q', 'I', 'K', 'L', 'M', 'N', 'X', 'O', 'P', 'R', 'S', 'T', 'Y', 'F', 'C', 'Y', 'W'];
  const greek = greekLetters[Math.floor(Math.random() * greekLetters.length)];
  const num = Math.floor(Math.random() * 10);
  const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return `PRJ-${greek}${num}${letter}`;
};

// In-memory store for development (persists during dev session)
if (!global.devProjects) global.devProjects = [];
if (!global.devLogs) global.devLogs = [];

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Validate auth
  const auth = validateAuth(req);
  if (!auth.valid) {
    return res.status(401).json({ success: false, error: auth.error });
  }

  if (req.method === 'POST') {
    try {
      const body = req.body;

      // Validate required fields
      const required = ['alias', 'displayNameEn', 'category'];
      for (const field of required) {
        if (!body[field]) {
          return res.status(400).json({
            success: false,
            error: `Missing required field: ${field}`,
          });
        }
      }

      const id = generateId('proj');
      const code = body.code || generateProjectCode();

      const newProject = {
        id,
        code,
        alias: body.alias,
        display_name_en: body.displayNameEn,
        display_name_es: body.displayNameEs || null,
        description_en: body.descriptionEn || null,
        description_es: body.descriptionEs || null,
        accent_color: body.accentColor || '#ffa742',
        thumbnail_url: body.thumbnailUrl || null,
        featured_media_url: body.featuredMediaUrl || null,
        featured_media_type: body.featuredMediaType || null,
        category: body.category,
        status: body.status || 'active',
        progress: body.progress || 0,
        tech_stack: JSON.stringify(body.techStack || []),
        tags: JSON.stringify(body.tags || []),
        external_url: body.externalUrl || null,
        is_featured: body.isFeatured ? 1 : 0,
        display_order: body.displayOrder || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      global.devProjects.push(newProject);

      // Handle logs if provided
      if (body.logs && Array.isArray(body.logs)) {
        for (const log of body.logs) {
          if (log.oneLiner && log.oneLiner.trim()) {
            const logId = generateId('log');
            global.devLogs.push({
              id: logId,
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

      return res.status(200).json({
        success: true,
        data: { id, code },
        message: 'Project created successfully',
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
