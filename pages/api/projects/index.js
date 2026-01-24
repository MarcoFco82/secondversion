/**
 * Next.js API Route for Projects (Development)
 * GET /api/projects - List all projects
 * 
 * Combines static projects from data/projects.js with
 * dynamically created projects stored in global memory
 */

import { PROJECTS } from '../../../data/projects';

// Initialize global store if not exists
if (!global.devProjects) global.devProjects = [];

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
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
    // Dynamic projects (from admin) take precedence if same ID exists
    const dynamicIds = new Set(global.devProjects.map(p => p.id));
    const filteredStatic = staticProjects.filter(p => !dynamicIds.has(p.id));
    
    const allProjects = [...global.devProjects, ...filteredStatic];

    // Sort by created_at desc (newest first)
    allProjects.sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return dateB - dateA;
    });

    return res.status(200).json({
      success: true,
      data: allProjects,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
