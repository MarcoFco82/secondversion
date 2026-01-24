/**
 * DEVLOG PIPELINE - Centralized Configuration
 * Single source of truth for all app settings
 */

// ===========================================
// BRAND COLORS
// ===========================================
export const COLORS = {
  accent: '#ffa742',
  dark: '#3b424c',
  light: '#e8e8e8',
  
  // Entry type colors
  feature: '#ffa742',
  bugfix: '#ef4444',
  refactor: '#a78bfa',
  migration: '#3b82f6',
  deploy: '#4ade80',
  research: '#06b6d4',
  
  // UI colors
  background: '#0a0a0a',
  surface: '#1a1a1a',
  border: '#2a2a2a',
  text: '#e8e8e8',
  textMuted: '#888888',
};

// ===========================================
// R2 STORAGE
// ===========================================
export const R2_CONFIG = {
  publicUrl: 'https://pub-53d4a6f5b3144ad7aaceddf9c6415871.r2.dev',
  bucketName: 'marcomotion-media',
};

// ===========================================
// API ENDPOINTS
// ===========================================
export const API = {
  // Public endpoints
  projects: '/api/projects',
  logs: '/api/logs',
  activity: '/api/activity',
  media: '/api/media',
  
  // Admin endpoints
  admin: {
    projects: '/api/admin/projects',
    logs: '/api/admin/logs',
    media: '/api/admin/media',
    auth: '/api/admin/auth',
  },
};

// ===========================================
// CATEGORIES (shared Lab Hub + Apps & Projects)
// ===========================================
export const CATEGORIES = [
  { slug: 'saas', label: 'SaaS Platform', labelEs: 'Plataforma SaaS' },
  { slug: 'web', label: 'Web App', labelEs: 'Aplicación Web' },
  { slug: 'threejs', label: '3D / WebGL', labelEs: '3D / WebGL' },
  { slug: 'tool', label: 'Dev Tool', labelEs: 'Herramienta Dev' },
  { slug: 'motion', label: 'Motion Graphics', labelEs: 'Motion Graphics' },
  { slug: 'experiment', label: 'Experiment', labelEs: 'Experimento' },
];

// ===========================================
// ENTRY TYPES (for dev logs)
// ===========================================
export const ENTRY_TYPES = [
  { type: 'feature', label: 'FEATURE', color: COLORS.feature },
  { type: 'bugfix', label: 'BUGFIX', color: COLORS.bugfix },
  { type: 'refactor', label: 'REFACTOR', color: COLORS.refactor },
  { type: 'migration', label: 'MIGRATION', color: COLORS.migration },
  { type: 'deploy', label: 'DEPLOY', color: COLORS.deploy },
  { type: 'research', label: 'RESEARCH', color: COLORS.research },
];

// ===========================================
// PROJECT STATUS OPTIONS
// ===========================================
export const PROJECT_STATUS = [
  { value: 'active', label: 'Active', labelEs: 'Activo' },
  { value: 'completed', label: 'Completed', labelEs: 'Completado' },
  { value: 'archived', label: 'Archived', labelEs: 'Archivado' },
];

// ===========================================
// MEDIA TYPES
// ===========================================
export const MEDIA_TYPES = [
  { value: 'image', label: 'Image', accept: 'image/*' },
  { value: 'video', label: 'Video', accept: 'video/*' },
  { value: 'gif', label: 'GIF', accept: 'image/gif' },
  { value: 'vimeo', label: 'Vimeo', accept: null },
  { value: 'youtube', label: 'YouTube', accept: null },
];

// ===========================================
// HELPER: Get R2 public URL for a file
// ===========================================
export function getMediaUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) return path; // Local public folder
  return `${R2_CONFIG.publicUrl}/${path}`;
}

// ===========================================
// HELPER: Get entry type config
// ===========================================
export function getEntryTypeConfig(type: string) {
  return ENTRY_TYPES.find(t => t.type === type) || ENTRY_TYPES[0];
}

// ===========================================
// HELPER: Get category config
// ===========================================
export function getCategoryConfig(slug: string) {
  return CATEGORIES.find(c => c.slug === slug) || CATEGORIES[0];
}
