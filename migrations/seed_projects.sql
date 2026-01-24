-- SEED: Projects
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
