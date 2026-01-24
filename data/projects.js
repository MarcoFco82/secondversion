/**
 * DEVLOG PIPELINE - Unified Data Model
 * 
 * Single source of truth for projects, logs, and media
 * Following Data Model v1 schema
 * 
 * Data is now managed via Admin Console
 */

// ===========================================
// UNIFIED CATEGORIES (shared Lab Hub + Apps & Projects)
// ===========================================

export const CATEGORIES = {
  // Development & Engineering
  saas: { slug: 'saas', label: 'SaaS Platform', labelEs: 'Plataforma SaaS', group: 'dev' },
  web: { slug: 'web', label: 'Web App', labelEs: 'Aplicación Web', group: 'dev' },
  apps: { slug: 'apps', label: 'Apps', labelEs: 'Apps', group: 'dev' },
  frontend: { slug: 'frontend', label: 'Frontend', labelEs: 'Frontend', group: 'dev' },
  backend: { slug: 'backend', label: 'Backend', labelEs: 'Backend', group: 'dev' },
  fullstack: { slug: 'fullstack', label: 'Full Stack', labelEs: 'Full Stack', group: 'dev' },
  api: { slug: 'api', label: 'API', labelEs: 'API', group: 'dev' },
  tool: { slug: 'tool', label: 'Dev Tool', labelEs: 'Herramienta Dev', group: 'dev' },
  automation: { slug: 'automation', label: 'Automation', labelEs: 'Automatización', group: 'dev' },
  scripting: { slug: 'scripting', label: 'Scripting', labelEs: 'Scripting', group: 'dev' },
  
  // Design & UX
  uiux: { slug: 'uiux', label: 'UI/UX', labelEs: 'UI/UX', group: 'design' },
  design: { slug: 'design', label: 'Design', labelEs: 'Diseño', group: 'design' },
  branding: { slug: 'branding', label: 'Branding', labelEs: 'Branding', group: 'design' },
  typography: { slug: 'typography', label: 'Typography', labelEs: 'Tipografía', group: 'design' },
  illustration: { slug: 'illustration', label: 'Illustration', labelEs: 'Ilustración', group: 'design' },
  
  // Motion & Animation
  motion: { slug: 'motion', label: 'Motion Graphics', labelEs: 'Motion Graphics', group: 'motion' },
  animation: { slug: 'animation', label: 'Animation', labelEs: 'Animación', group: 'motion' },
  vfx: { slug: 'vfx', label: 'VFX', labelEs: 'VFX', group: 'motion' },
  compositing: { slug: 'compositing', label: 'Compositing', labelEs: 'Compositing', group: 'motion' },
  kinetic: { slug: 'kinetic', label: 'Kinetic Type', labelEs: 'Tipografía Cinética', group: 'motion' },
  transitions: { slug: 'transitions', label: 'Transitions', labelEs: 'Transiciones', group: 'motion' },
  
  // Video & Film
  editing: { slug: 'editing', label: 'Editing', labelEs: 'Edición', group: 'video' },
  colorGrading: { slug: 'color-grading', label: 'Color Grading', labelEs: 'Colorización', group: 'video' },
  storytelling: { slug: 'storytelling', label: 'Storytelling', labelEs: 'Narrativa', group: 'video' },
  documentary: { slug: 'documentary', label: 'Documentary', labelEs: 'Documental', group: 'video' },
  commercial: { slug: 'commercial', label: 'Commercial', labelEs: 'Comercial', group: 'video' },
  musicVideo: { slug: 'music-video', label: 'Music Video', labelEs: 'Video Musical', group: 'video' },
  shortFilm: { slug: 'short-film', label: 'Short Film', labelEs: 'Cortometraje', group: 'video' },
  
  // Interactive & Web
  interactiveMotion: { slug: 'interactive-motion', label: 'Interactive Motion', labelEs: 'Motion Interactivo', group: 'interactive' },
  creativeCoding: { slug: 'creative-coding', label: 'Creative Coding', labelEs: 'Código Creativo', group: 'interactive' },
  threejs: { slug: 'threejs', label: '3D / WebGL', labelEs: '3D / WebGL', group: 'interactive' },
  generative: { slug: 'generative', label: 'Generative Art', labelEs: 'Arte Generativo', group: 'interactive' },
  dataViz: { slug: 'data-viz', label: 'Data Visualization', labelEs: 'Visualización de Datos', group: 'interactive' },
  
  // AI & Emerging Tech
  aiImage: { slug: 'ai-image', label: 'AI Image', labelEs: 'Imagen IA', group: 'ai' },
  aiVideo: { slug: 'ai-video', label: 'AI Video', labelEs: 'Video IA', group: 'ai' },
  aiAudio: { slug: 'ai-audio', label: 'AI Audio', labelEs: 'Audio IA', group: 'ai' },
  promptEngineering: { slug: 'prompt-engineering', label: 'Prompt Engineering', labelEs: 'Ingeniería de Prompts', group: 'ai' },
  
  // 3D & Realtime
  threeD: { slug: '3d', label: '3D', labelEs: '3D', group: '3d' },
  modeling: { slug: 'modeling', label: '3D Modeling', labelEs: 'Modelado 3D', group: '3d' },
  shaders: { slug: 'shaders', label: 'Shaders', labelEs: 'Shaders', group: '3d' },
  realtime: { slug: 'realtime', label: 'Real-time', labelEs: 'Tiempo Real', group: '3d' },
  
  // Audio & Sound
  soundDesign: { slug: 'sound-design', label: 'Sound Design', labelEs: 'Diseño de Sonido', group: 'audio' },
  audioVisual: { slug: 'audio-visual', label: 'Audio Visual', labelEs: 'Audio Visual', group: 'audio' },
  
  // Content Type
  experiment: { slug: 'experiment', label: 'Experiment', labelEs: 'Experimento', group: 'content' },
  product: { slug: 'product', label: 'Product', labelEs: 'Producto', group: 'content' },
  prototype: { slug: 'prototype', label: 'Prototype', labelEs: 'Prototipo', group: 'content' },
  template: { slug: 'template', label: 'Template', labelEs: 'Plantilla', group: 'content' },
  plugin: { slug: 'plugin', label: 'Plugin', labelEs: 'Plugin', group: 'content' },
  tutorial: { slug: 'tutorial', label: 'Tutorial', labelEs: 'Tutorial', group: 'content' },
};

// Category groups for UI organization
export const CATEGORY_GROUPS = {
  dev: { label: 'Development', labelEs: 'Desarrollo', color: '#3b82f6' },
  design: { label: 'Design', labelEs: 'Diseño', color: '#a78bfa' },
  motion: { label: 'Motion', labelEs: 'Motion', color: '#ffa742' },
  video: { label: 'Video', labelEs: 'Video', color: '#ef4444' },
  interactive: { label: 'Interactive', labelEs: 'Interactivo', color: '#06b6d4' },
  ai: { label: 'AI & ML', labelEs: 'IA & ML', color: '#10b981' },
  '3d': { label: '3D & Realtime', labelEs: '3D & Tiempo Real', color: '#f59e0b' },
  audio: { label: 'Audio', labelEs: 'Audio', color: '#ec4899' },
  content: { label: 'Content Type', labelEs: 'Tipo de Contenido', color: '#6b7280' },
};

// Helper: Get all categories as array
export function getAllCategories() {
  return Object.values(CATEGORIES);
}

// Helper: Get categories by group
export function getCategoriesByGroup(group) {
  return Object.values(CATEGORIES).filter(cat => cat.group === group);
}

// Helper: Get category by slug
export function getCategoryBySlug(slug) {
  return Object.values(CATEGORIES).find(cat => cat.slug === slug);
}

// ===========================================
// TAGS (multiple per project)
// ===========================================

export const TAGS = {
  // Development
  apps: { slug: 'apps', label: 'Apps', group: 'dev' },
  frontend: { slug: 'frontend', label: 'Frontend', group: 'dev' },
  backend: { slug: 'backend', label: 'Backend', group: 'dev' },
  fullstack: { slug: 'fullstack', label: 'Full Stack', group: 'dev' },
  api: { slug: 'api', label: 'API', group: 'dev' },
  automation: { slug: 'automation', label: 'Automation', group: 'dev' },
  scripting: { slug: 'scripting', label: 'Scripting', group: 'dev' },
  
  // Design
  uiux: { slug: 'uiux', label: 'UI/UX', group: 'design' },
  branding: { slug: 'branding', label: 'Branding', group: 'design' },
  typography: { slug: 'typography', label: 'Typography', group: 'design' },
  illustration: { slug: 'illustration', label: 'Illustration', group: 'design' },
  
  // Motion
  motionGraphics: { slug: 'motion-graphics', label: 'Motion Graphics', group: 'motion' },
  animation: { slug: 'animation', label: 'Animation', group: 'motion' },
  vfx: { slug: 'vfx', label: 'VFX', group: 'motion' },
  compositing: { slug: 'compositing', label: 'Compositing', group: 'motion' },
  kinetic: { slug: 'kinetic', label: 'Kinetic Type', group: 'motion' },
  
  // Video
  editing: { slug: 'editing', label: 'Editing', group: 'video' },
  colorGrading: { slug: 'color-grading', label: 'Color Grading', group: 'video' },
  storytelling: { slug: 'storytelling', label: 'Storytelling', group: 'video' },
  commercial: { slug: 'commercial', label: 'Commercial', group: 'video' },
  musicVideo: { slug: 'music-video', label: 'Music Video', group: 'video' },
  
  // Interactive
  interactiveMotion: { slug: 'interactive-motion', label: 'Interactive Motion', group: 'interactive' },
  creativeCoding: { slug: 'creative-coding', label: 'Creative Coding', group: 'interactive' },
  webgl: { slug: 'webgl', label: 'WebGL', group: 'interactive' },
  generative: { slug: 'generative', label: 'Generative Art', group: 'interactive' },
  dataViz: { slug: 'data-viz', label: 'Data Visualization', group: 'interactive' },
  
  // AI
  aiImage: { slug: 'ai-image', label: 'AI Image', group: 'ai' },
  aiVideo: { slug: 'ai-video', label: 'AI Video', group: 'ai' },
  aiAudio: { slug: 'ai-audio', label: 'AI Audio', group: 'ai' },
  promptEngineering: { slug: 'prompt-engineering', label: 'Prompt Engineering', group: 'ai' },
  
  // 3D
  threeD: { slug: '3d', label: '3D', group: '3d' },
  modeling: { slug: 'modeling', label: '3D Modeling', group: '3d' },
  shaders: { slug: 'shaders', label: 'Shaders', group: '3d' },
  realtime: { slug: 'realtime', label: 'Real-time', group: '3d' },
  
  // Audio
  soundDesign: { slug: 'sound-design', label: 'Sound Design', group: 'audio' },
  audioVisual: { slug: 'audio-visual', label: 'Audio Visual', group: 'audio' },
  
  // Content
  product: { slug: 'product', label: 'Product', group: 'content' },
  prototype: { slug: 'prototype', label: 'Prototype', group: 'content' },
  template: { slug: 'template', label: 'Template', group: 'content' },
  plugin: { slug: 'plugin', label: 'Plugin', group: 'content' },
  tutorial: { slug: 'tutorial', label: 'Tutorial', group: 'content' },
};

// Tag groups for UI
export const TAG_GROUPS = {
  dev: { label: 'Development', color: '#3b82f6' },
  design: { label: 'Design', color: '#a78bfa' },
  motion: { label: 'Motion', color: '#ffa742' },
  video: { label: 'Video', color: '#ef4444' },
  interactive: { label: 'Interactive', color: '#06b6d4' },
  ai: { label: 'AI & ML', color: '#10b981' },
  '3d': { label: '3D & Realtime', color: '#f59e0b' },
  audio: { label: 'Audio', color: '#ec4899' },
  content: { label: 'Content', color: '#6b7280' },
};

// Helper functions for tags
export function getAllTags() {
  return Object.values(TAGS);
}

export function getTagsByGroup(group) {
  return Object.values(TAGS).filter(tag => tag.group === group);
}

export function getTagBySlug(slug) {
  return Object.values(TAGS).find(tag => tag.slug === slug);
}

// ===========================================
// ENTRY TYPES (for dev logs)
// Motion Dev Artist focused
// ===========================================
export const ENTRY_TYPES = {
  build: { type: 'build', label: 'BUILD', color: '#ffa742' },
  ship: { type: 'ship', label: 'SHIP', color: '#4ade80' },
  experiment: { type: 'experiment', label: 'EXPERIMENT', color: '#06b6d4' },
  polish: { type: 'polish', label: 'POLISH', color: '#a78bfa' },
  study: { type: 'study', label: 'STUDY', color: '#3b82f6' },
  wire: { type: 'wire', label: 'WIRE', color: '#f59e0b' },
};

// ===========================================
// DATA TABLES (managed via Admin Console)
// ===========================================

export const PROJECTS = [];
export const PROJECT_MEDIA = [];
export const DEV_LOGS = [];
export const ACTIVITY_METRICS = [];

// ===========================================
// HELPER FUNCTIONS
// ===========================================

export function getProjectById(projectId) {
  return PROJECTS.find(p => p.id === projectId);
}

export function getProjectByCode(code) {
  return PROJECTS.find(p => p.code === code);
}

export function getProjectMedia(projectId) {
  return PROJECT_MEDIA
    .filter(m => m.projectId === projectId)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getProjectLogs(projectId) {
  return DEV_LOGS
    .filter(l => l.projectId === projectId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getEnrichedLogs() {
  return DEV_LOGS.map(log => {
    const project = getProjectById(log.projectId);
    return {
      ...log,
      projectCode: project?.code,
      projectAlias: project?.alias,
      accentColor: project?.accentColor,
      techStack: project?.techStack,
      progress: project?.progress,
      category: project?.category,
    };
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getFeaturedProjects() {
  return PROJECTS
    .filter(p => p.isFeatured)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getProjectsByCategory(categorySlug) {
  if (!categorySlug || categorySlug === 'all') return PROJECTS;
  return PROJECTS.filter(p => p.category === categorySlug);
}

export function getUniqueProjectsFromLogs() {
  const projectMap = new Map();
  
  DEV_LOGS.forEach(log => {
    const project = getProjectById(log.projectId);
    if (project && !projectMap.has(project.id)) {
      projectMap.set(project.id, {
        id: project.id,
        code: project.code,
        alias: project.alias,
        color: project.accentColor,
        progress: project.progress,
        category: project.category,
        status: project.status,
      });
    }
  });
  
  return Array.from(projectMap.values());
}

export function getActivityArray() {
  return ACTIVITY_METRICS.map(m => m.entryCount);
}

export function getAllProjectTags() {
  const tagSet = new Set();
  PROJECTS.forEach(p => {
    p.tags?.forEach(t => tagSet.add(t));
  });
  return Array.from(tagSet);
}

export function filterProjectsByTags(tagSlugs) {
  if (!tagSlugs || tagSlugs.length === 0) return PROJECTS;
  return PROJECTS.filter(p => 
    p.tags?.some(t => tagSlugs.includes(t))
  );
}

export function filterProjectsByAllTags(tagSlugs) {
  if (!tagSlugs || tagSlugs.length === 0) return PROJECTS;
  return PROJECTS.filter(p => 
    tagSlugs.every(slug => p.tags?.includes(slug))
  );
}

export function getProjectsByTagGroup(group) {
  const groupTags = getTagsByGroup(group).map(t => t.slug);
  return filterProjectsByTags(groupTags);
}

// Backward compatibility
export const getAllKeywords = getAllProjectTags;
export const filterProjectsByKeywords = filterProjectsByTags;
