-- SEED: Project Media
INSERT INTO project_media (id, project_id, media_url, media_type, caption_en, caption_es, display_order) VALUES 
('media-001', 'proj-001', '/project_1.png', 'image', 'Main interface - Character builder', 'Interfaz principal - Constructor de personajes', 1),
('media-002', 'proj-002', '/project_2.jpg', 'image', 'Chart animation preview', 'Preview de animación de gráfica', 1),
('media-003', 'proj-002', 'https://player.vimeo.com/video/1086598671?h=5e6b68bdc7', 'vimeo', 'Full demo reel', 'Demo reel completo', 2),
('media-004', 'proj-003', '/project_3.jpg', 'image', 'Logo animation frame', 'Frame de animación de logo', 1),
('media-005', 'proj-003', 'https://player.vimeo.com/video/1086965653', 'vimeo', 'Complete logos reel', 'Reel completo de logos', 2),
('media-006', 'proj-004', '/project_4.jpg', 'image', 'Key frame - forest scene', 'Key frame - escena del bosque', 1),
('media-007', 'proj-004', 'https://player.vimeo.com/video/1106568526', 'vimeo', 'Full trailer', 'Trailer completo', 2);
