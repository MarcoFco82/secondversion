/**
 * API Route for Projects
 * GET /api/projects - List all projects
 * 
 * Uses D1 database in production (Cloudflare)
 * Falls back to in-memory store for local development
 */

import { getCloudflareContext } from '@opennextjs/cloudflare';
import { PROJECTS } from '../../../data/projects';

// Initialize global store if not exists (fallback for local dev)
if (!global.devProjects) global.devProjects = [];

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    let projects = [];

    // Try to get D1 database from Cloudflare context
    let db = null;
    try {
      const { env } = await getCloudflareContext();
      db = env.DB;
    } catch (e) {
      // Not in Cloudflare environment
      console.log('D1 not available, using fallback');
    }

    if (db) {
      // === PRODUCTION: Use D1 Database ===
      const result = await db.prepare(`
        SELECT * FROM projects ORDER BY created_at DESC
      `).all();
      
      projects = result.results || [];
    } else {
      // === DEVELOPMENT: Use in-memory + static data ===
      
      // Transform static projects to D1 format
      const staticProjects = PROJECTS.map(p => ({
        id: p.id,
        code: p.code,
        alias: p.alias,
        display_name_en: p.displayName?.en || p.displayName,
        display_name_es: p.displayName?.es || null,
        description_en: Array.isArray(p.description?.en) ? p.description.en.join(' ') : p.description?.en,
        description_es: Array.isArray(p.description?.es) ? p.description.es.join(' ') : p.description?.es,
        accent_color: p.accentColor,
        thumbnail_url: p.thumbnailUrl,
        featured_media_url: p.featuredMediaUrl,
        featured_media_type: p.featuredMediaType,
        category: p.category,
        status: p.status,
        progress: p.progress,
        tech_stack: JSON.stringify(p.techStack || []),
        tags: JSON.stringify(p.tags || []),
        external_url: p.externalUrl,
        is_featured: p.isFeatured ? 1 : 0,
        display_order: p.displayOrder,
        created_at: p.createdAt,
        updated_at: p.updatedAt,
      }));

      // Combine static + dynamic projects
      const dynamicIds = new Set(global.devProjects.map(p => p.id));
      const filteredStatic = staticProjects.filter(p => !dynamicIds.has(p.id));
      
      projects = [...global.devProjects, ...filteredStatic];

      // Sort by created_at desc
      projects.sort((a, b) => {
        const dateA = new Date(a.created_at || 0);
        const dateB = new Date(b.created_at || 0);
        return dateB - dateA;
      });
    }

    return res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error('Get projects error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
