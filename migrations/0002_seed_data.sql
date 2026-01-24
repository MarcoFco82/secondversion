-- ===========================================
-- MARCOMOTION D1 SEED DATA
-- Migration: 0002_seed_data.sql
-- Initial data for testing
-- ===========================================

-- ===========================================
-- SEED: Projects
-- ===========================================
INSERT INTO projects (
    id, code, alias, 
    display_name_en, display_name_es,
    description_en, description_es,
    accent_color, thumbnail_url, 
    featured_media_url, featured_media_type,
    category, status, progress, 
    tech_stack, external_url, keywords,
    is_featured, display_order
) VALUES 
(
    'proj-001', 'PRJ-Ω9K', 'CHAR-GEN',
    'Character Prompt Generator', 'Generador de Prompts para Personajes',
    'Built to make character creation easy with total control over the look and feel, crafting unique, consistent styles.',
    'Diseñado para facilitar la creación de personajes con control total sobre la apariencia, creando estilos únicos y consistentes.',
    '#ffa742', '/project_1.png',
    '/project_1.png', 'image',
    'saas', 'active', 85,
    '["React", "TypeScript", "Zustand", "Tailwind", "Claude API"]',
    'https://chargen.marcomotion.com/',
    '["Apps", "Frontend", "UI/UX", "AI Image"]',
    1, 1
),
(
    'proj-002', 'PRJ-α7X', 'DATA-VIZ',
    'Scripts for Data Visualization in After Effects', 'Scripts para Visualización de Datos en After Effects',
    'Custom AE scripts to automate charts, graphs, and infographics.',
    'Scripts personalizados para AE que automatizan gráficas, charts e infografías.',
    '#4ade80', '/project_2.jpg',
    'https://player.vimeo.com/video/1086598671?h=5e6b68bdc7', 'vimeo',
    'tool', 'active', 92,
    '["ExtendScript", "After Effects", "JavaScript"]',
    NULL,
    '["Web", "Interactive Motion", "Creative Coding"]',
    1, 2
),
(
    'proj-003', 'PRJ-Δ3M', 'LOGO-REEL',
    'Intro Logos Reel', 'Reel de Logos Intro',
    'Animated logo intros and social reels designed for modern brands and creators, ready for instant use and customization.',
    'Intros de logos animados y reels sociales diseñados para marcas modernas y creadores, listos para uso inmediato y personalización.',
    '#a78bfa', '/project_3.jpg',
    'https://player.vimeo.com/video/1086965653', 'vimeo',
    'motion', 'completed', 100,
    '["After Effects", "Premiere", "Illustrator"]',
    NULL,
    '["Motion Graphics", "Vfx", "Design"]',
    1, 3
),
(
    'proj-004', 'PRJ-β2N', 'AI-SHORT',
    'AI Short: Book Trailer', 'Corto AI: Trailer de Libro',
    'Book Trailer no. 2 created for Monica Rojas'' book: In the Shadow of a Dead Tree.',
    'Book Trailer no. 2 creado para el libro de Monica Rojas: A la Sombra de un Árbol Muerto.',
    '#06b6d4', '/project_4.jpg',
    'https://player.vimeo.com/video/1106568526', 'vimeo',
    'motion', 'completed', 100,
    '["Runway", "Midjourney", "Premiere", "After Effects"]',
    NULL,
    '["AI Video", "Editing", "Storytelling"]',
    1, 4
);

-- ===========================================
-- SEED: Dev Logs
-- ===========================================
INSERT INTO dev_logs (id, project_id, entry_type, one_liner, challenge_abstract, mental_note, created_at) VALUES 
('log-001', 'proj-001', 'feature', 'Scroll-triggered animation pipeline', 'RAF throttling for 60fps on mobile', 'esto resolvió 3 bugs de golpe', '2025-01-21 14:32:07'),
('log-002', 'proj-002', 'migration', 'Real-time sync architecture', 'Optimistic updates with conflict resolution', '2am rabbit hole que terminó en feature', '2025-01-20 09:15:43'),
('log-003', 'proj-003', 'refactor', 'Procedural geometry engine', 'Memory leak in buffer disposal', NULL, '2025-01-19 22:08:12'),
('log-004', 'proj-001', 'bugfix', 'Fixed date picker timezone issues', 'UTC offset handling across regions', 'timezones son el infierno', '2025-01-18 16:45:22'),
('log-005', 'proj-001', 'feature', 'Page transition system', 'Smooth exit animations with data prefetch', NULL, '2025-01-17 11:20:33'),
('log-006', 'proj-004', 'deploy', 'Published trailer to Vimeo', 'Color grading adjustments for web', 'finalmente el color quedó bien', '2025-01-16 18:00:00'),
('log-007', 'proj-002', 'feature', 'Added pie chart generator', 'Dynamic segment animation timing', NULL, '2025-01-15 10:30:00');

-- ===========================================
-- SEED: Project Media
-- ===========================================
INSERT INTO project_media (id, project_id, media_url, media_type, caption_en, caption_es, display_order) VALUES 
-- Project 1: Character Generator
('media-001', 'proj-001', '/project_1.png', 'image', 'Main interface - Character builder', 'Interfaz principal - Constructor de personajes', 1),
-- Project 2: Data Viz Scripts  
('media-002', 'proj-002', '/project_2.jpg', 'image', 'Chart animation preview', 'Preview de animación de gráfica', 1),
('media-003', 'proj-002', 'https://player.vimeo.com/video/1086598671?h=5e6b68bdc7', 'vimeo', 'Full demo reel', 'Demo reel completo', 2),
-- Project 3: Logo Reel
('media-004', 'proj-003', '/project_3.jpg', 'image', 'Logo animation frame', 'Frame de animación de logo', 1),
('media-005', 'proj-003', 'https://player.vimeo.com/video/1086965653', 'vimeo', 'Complete logos reel', 'Reel completo de logos', 2),
-- Project 4: AI Short
('media-006', 'proj-004', '/project_4.jpg', 'image', 'Key frame - forest scene', 'Key frame - escena del bosque', 1),
('media-007', 'proj-004', 'https://player.vimeo.com/video/1106568526', 'vimeo', 'Full trailer', 'Trailer completo', 2);

-- ===========================================
-- SEED: Activity Metrics (last 14 days)
-- ===========================================
INSERT INTO activity_metrics (id, date, entry_count) VALUES 
('activity-2025-01-08', '2025-01-08', 2),
('activity-2025-01-09', '2025-01-09', 4),
('activity-2025-01-10', '2025-01-10', 6),
('activity-2025-01-11', '2025-01-11', 8),
('activity-2025-01-12', '2025-01-12', 10),
('activity-2025-01-13', '2025-01-13', 8),
('activity-2025-01-14', '2025-01-14', 5),
('activity-2025-01-15', '2025-01-15', 3),
('activity-2025-01-16', '2025-01-16', 4),
('activity-2025-01-17', '2025-01-17', 7),
('activity-2025-01-18', '2025-01-18', 9),
('activity-2025-01-19', '2025-01-19', 10),
('activity-2025-01-20', '2025-01-20', 8),
('activity-2025-01-21', '2025-01-21', 6);
