import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ProjectRadarExpanded.module.css';

// Categorías de proyectos
const PROJECT_CATEGORIES = {
  'threejs': { label: '3D / Three.js', icon: '◇', color: '#a78bfa' },
  'saas': { label: 'SaaS Platform', icon: '◈', color: '#4ade80' },
  'tool': { label: 'Personal Tool', icon: '◆', color: '#ffa742' },
  'motion': { label: 'Motion / Animation', icon: '◎', color: '#f472b6' },
  'web': { label: 'Web App', icon: '◉', color: '#38bdf8' },
  'experiment': { label: 'Experiment', icon: '✧', color: '#fb923c' }
};

// Hook para movimiento flotante sutil
function useFloatingPosition(baseX, baseY, range = 1.5, speed = 0.3) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const angleRef = useRef(Math.random() * Math.PI * 2);
  const speedRef = useRef(speed + Math.random() * 0.2);

  useEffect(() => {
    let animationId;
    const animate = () => {
      angleRef.current += 0.008 * speedRef.current;
      const newX = Math.sin(angleRef.current) * range;
      const newY = Math.cos(angleRef.current * 0.7) * range;
      setOffset({ x: newX, y: newY });
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [range]);

  return { x: baseX + offset.x, y: baseY + offset.y };
}

// Matrix Grid simple y optimizado - una sola capa con animaciones CSS
function MatrixGrid({ highlightColor, gridSize = 30 }) {
  const dots = useMemo(() => {
    const result = [];
    const spacing = 100 / (gridSize - 1);
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const x = i * spacing;
        const y = j * spacing;
        
        // 12% de puntos con glow animado
        const isGlow = Math.random() < 0.12;
        // Variedad de delays para efecto wave
        const animDelay = (i + j) * 0.05 + Math.random() * 2;
        
        result.push({ x, y, isGlow, animDelay });
      }
    }
    return result;
  }, [gridSize]);

  return (
    <div 
      className={styles.matrixGrid}
      style={{ '--highlight-color': highlightColor || 'var(--terminal-accent)' }}
    >
      {dots.map((dot, index) => (
        <div
          key={index}
          className={`${styles.matrixDot} ${dot.isGlow ? styles.matrixDotGlow : ''}`}
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            animationDelay: `${dot.animDelay}s`,
          }}
        />
      ))}
    </div>
  );
}

// Floating Dot con posición basada en progreso
function FloatingDot({ project, baseX, baseY, isActive, onClick, index, zoom }) {
  const position = useFloatingPosition(baseX, baseY, 1.2 / zoom, 0.3 + index * 0.05);
  const catConfig = PROJECT_CATEGORIES[project.category] || PROJECT_CATEGORIES.web;

  return (
    <motion.div
      className={`${styles.floatingDot} ${isActive ? styles.floatingDotActive : ''}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        '--dot-color': project.color,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      onClick={onClick}
    >
      <div className={styles.dotCoreWrapper}>
        <div 
          className={styles.dotCore}
          style={{ backgroundColor: project.color }}
        />
        
        {isActive && (
          <motion.div
            className={styles.dotPulse}
            style={{ borderColor: project.color }}
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ 
              duration: 1.8, 
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        )}
      </div>

      <div className={styles.dotLabel}>
        <span className={styles.dotIcon} style={{ color: project.color }}>
          {catConfig.icon}
        </span>
        <span className={styles.dotAlias}>{project.alias}</span>
        <span className={styles.dotProgress}>{project.progress}%</span>
      </div>
    </motion.div>
  );
}

// Media Gallery - Carousel with main view and thumbnails
function MediaGallery({ media = [], projectColor }) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  if (!media || media.length === 0) {
    return (
      <div className={styles.mediaGalleryEmpty}>
        <div className={styles.emptyIcon}>◇</div>
        <p>No media available</p>
        <span>Upload from admin panel</span>
      </div>
    );
  }

  const activeMedia = media[activeIndex];
  const canGoPrev = activeIndex > 0;
  const canGoNext = activeIndex < media.length - 1;

  const goNext = () => setActiveIndex(prev => Math.min(media.length - 1, prev + 1));
  const goPrev = () => setActiveIndex(prev => Math.max(0, prev - 1));

  return (
    <div className={styles.mediaGallery}>
      {/* Main viewer */}
      <div className={styles.mediaMainView}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            className={styles.mediaMainContent}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {(activeMedia.type === 'image' || activeMedia.type === 'gif') && (
              <img src={activeMedia.url} alt={activeMedia.caption || `Media ${activeIndex + 1}`} />
            )}
            {activeMedia.type === 'video' && (
              <video src={activeMedia.url} controls autoPlay muted loop playsInline />
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation arrows */}
        {canGoPrev && (
          <button className={`${styles.mediaNavBtn} ${styles.mediaNavPrev}`} onClick={goPrev}>
            ‹
          </button>
        )}
        {canGoNext && (
          <button className={`${styles.mediaNavBtn} ${styles.mediaNavNext}`} onClick={goNext}>
            ›
          </button>
        )}
        
        {/* Counter */}
        <div className={styles.mediaCounter} style={{ color: projectColor }}>
          {activeIndex + 1} / {media.length}
        </div>
      </div>
      
      {/* Thumbnail strip */}
      {media.length > 1 && (
        <div className={styles.mediaThumbnails}>
          {media.map((item, index) => (
            <button
              key={item.id || index}
              className={`${styles.mediaThumb} ${index === activeIndex ? styles.mediaThumbActive : ''}`}
              onClick={() => setActiveIndex(index)}
              style={index === activeIndex ? { borderColor: projectColor } : {}}
            >
              {(item.type === 'image' || item.type === 'gif') && (
                <img src={item.url} alt={item.caption || `Thumb ${index + 1}`} />
              )}
              {item.type === 'video' && (
                <div className={styles.mediaThumbVideo}>▶</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProjectRadarExpanded({ 
  projects = [], 
  activeProject,
  onProjectSelect,
  label = 'PROJECTS',
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjectMedia, setSelectedProjectMedia] = useState([]);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const radarRef = useRef(null);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const lastPinchDistRef = useRef(0);

  // Fetch media when selected project changes
  useEffect(() => {
    const fetchProjectMedia = async () => {
      if (!selectedProject?.id) {
        setSelectedProjectMedia([]);
        return;
      }
      
      try {
        const res = await fetch(`/api/media?projectId=${selectedProject.id}`);
        const data = await res.json();
        
        if (data.success && data.data) {
          const mediaItems = data.data.map(m => ({
            id: m.id,
            type: m.media_type,
            url: m.media_url,
            caption: m.caption_en || m.caption_es || '',
            date: m.created_at,
          }));
          setSelectedProjectMedia(mediaItems);
        } else {
          setSelectedProjectMedia([]);
        }
      } catch (error) {
        console.error('Error fetching project media:', error);
        setSelectedProjectMedia([]);
      }
    };

    fetchProjectMedia();
  }, [selectedProject?.id]);

  // Zoom limits
  const MIN_ZOOM = 0.6;
  const MAX_ZOOM = 2.5;

  // Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (selectedProject) {
          setSelectedProject(null);
        } else if (isExpanded) {
          setIsExpanded(false);
          setPanOffset({ x: 0, y: 0 });
          setZoom(1);
        }
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isExpanded, selectedProject]);

  // Calcular posición de proyectos basado en progreso
  const projectPositions = useMemo(() => {
    const centerX = 50;
    const centerY = 50;
    
    return projects.map((project, index) => {
      const progress = project.progress || 0;
      const angle = (index / projects.length) * 2 * Math.PI - Math.PI / 2;
      
      let radius;
      if (progress >= 100) {
        radius = 52;
      } else {
        radius = 8 + (progress / 100) * 34;
      }
      
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      return { ...project, baseX: x, baseY: y };
    });
  }, [projects]);

  // Mouse handlers
  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    lastPosRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastPosRef.current.x;
    const deltaY = e.clientY - lastPosRef.current.y;
    
    const maxPan = 300 * zoom;
    setPanOffset(prev => ({
      x: Math.max(-maxPan, Math.min(maxPan, prev.x + deltaX)),
      y: Math.max(-maxPan, Math.min(maxPan, prev.y + deltaY)),
    }));
    
    lastPosRef.current = { x: e.clientX, y: e.clientY };
  }, [isDragging, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch handlers con pinch zoom
  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      lastPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
      // Pinch start
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastPinchDistRef.current = Math.sqrt(dx * dx + dy * dy);
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      const deltaX = touch.clientX - lastPosRef.current.x;
      const deltaY = touch.clientY - lastPosRef.current.y;
      
      const maxPan = 300 * zoom;
      setPanOffset(prev => ({
        x: Math.max(-maxPan, Math.min(maxPan, prev.x + deltaX)),
        y: Math.max(-maxPan, Math.min(maxPan, prev.y + deltaY)),
      }));
      
      lastPosRef.current = { x: touch.clientX, y: touch.clientY };
    } else if (e.touches.length === 2) {
      // Pinch zoom
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (lastPinchDistRef.current > 0) {
        const scale = dist / lastPinchDistRef.current;
        setZoom(prev => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev * scale)));
      }
      
      lastPinchDistRef.current = dist;
    }
  }, [isDragging, zoom]);

  const handleTouchEnd = useCallback((e) => {
    if (e.touches.length === 0) {
      setIsDragging(false);
      lastPinchDistRef.current = 0;
    } else if (e.touches.length === 1) {
      lastPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      lastPinchDistRef.current = 0;
    }
  }, []);

  // Wheel zoom
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev * delta)));
  }, []);

  // Zoom controls
  const zoomIn = useCallback(() => {
    setZoom(prev => Math.min(MAX_ZOOM, prev * 1.2));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom(prev => Math.max(MIN_ZOOM, prev / 1.2));
  }, []);

  const resetView = useCallback(() => {
    setPanOffset({ x: 0, y: 0 });
    setZoom(1);
  }, []);

  const handleProjectClick = useCallback((project) => {
    setSelectedProject(prev => prev?.code === project.code ? null : project);
    onProjectSelect?.(project.code);
  }, [onProjectSelect]);

  const handleClose = useCallback(() => {
    setIsExpanded(false);
    setSelectedProject(null);
    setPanOffset({ x: 0, y: 0 });
    setZoom(1);
  }, []);

  const renderProgressBar = (progress, color) => (
    <div className={styles.progressContainer}>
      <div className={styles.progressTrack}>
        <motion.div 
          className={styles.progressFill}
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <span className={styles.progressValue}>{progress}%</span>
    </div>
  );

  const projectStats = useMemo(() => {
    const active = projects.filter(p => (p.progress || 0) < 100).length;
    const completed = projects.filter(p => (p.progress || 0) >= 100).length;
    return { active, completed, total: projects.length };
  }, [projects]);

  const hasViewChanges = panOffset.x !== 0 || panOffset.y !== 0 || zoom !== 1;

  return (
    <>
      {/* Collapsed Mini Radar */}
      <div 
        className={styles.miniRadarContainer}
        onClick={() => setIsExpanded(true)}
      >
        <div className={styles.miniRadarLabel}>
          {label}
          <span className={styles.expandHint}>[ expand ]</span>
        </div>
        
        <div className={styles.miniRadarScreen}>
          <div className={styles.radarCircle1} />
          <div className={styles.radarCircle2} />
          <div className={styles.radarCircle3} />
          <div className={styles.radarLineH} />
          <div className={styles.radarLineV} />
          <div className={styles.radarSweep} />
          
          {projects.map((project, index) => {
            const progress = project.progress || 0;
            const angle = (index / projects.length) * 2 * Math.PI - Math.PI / 2;
            const radius = progress >= 100 ? 48 : 8 + (progress / 100) * 32;
            const x = 50 + radius * Math.cos(angle);
            const y = 50 + radius * Math.sin(angle);
            const isActive = project.code === activeProject;
            
            return (
              <motion.div
                key={project.code}
                className={`${styles.miniDot} ${isActive ? styles.miniDotActive : ''}`}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  backgroundColor: project.color,
                }}
                animate={{ scale: isActive ? 1.4 : 1 }}
              />
            );
          })}
          
          <div className={styles.centerDot} />
        </div>
        
        <div className={styles.projectCount}>{projectStats.active} active</div>
      </div>

      {/* Expanded Fullscreen */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className={styles.expandedOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
          >
            <motion.div
              className={styles.expandedContainer}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* HUD Frame */}
              <div className={styles.hudFrame}>
                <div className={styles.hudCornerTL} />
                <div className={styles.hudCornerTR} />
                <div className={styles.hudCornerBL} />
                <div className={styles.hudCornerBR} />
              </div>

              {/* Header */}
              <div className={styles.expandedHeader}>
                <div className={styles.headerTitle}>
                  <span className={styles.headerIcon}>◈</span>
                  <h2>PROJECT RADAR</h2>
                  <span className={styles.headerVersion}>v3.0</span>
                </div>
                <div className={styles.headerStats}>
                  <span>{projectStats.active} ACTIVE</span>
                  <span className={styles.statDivider}>|</span>
                  <span>{projectStats.completed} COMPLETED</span>
                </div>
                <div className={styles.headerActions}>
                  {hasViewChanges && (
                    <button className={styles.resetBtn} onClick={resetView}>
                      [ RESET ]
                    </button>
                  )}
                  <button className={styles.closeBtn} onClick={handleClose}>
                    [ ESC ]
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className={styles.expandedContent}>
                
                {/* Radar Section */}
                <div 
                  className={styles.radarSection}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onWheel={handleWheel}
                >
                  <div className={styles.radarViewport}>
                    {/* Radar principal */}
                    <div 
                      ref={radarRef}
                      className={styles.expandedRadar}
                      style={{
                        transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
                        cursor: isDragging ? 'grabbing' : 'grab',
                      }}
                    >
                      {/* Matrix Grid única optimizada */}
                      <MatrixGrid
                        gridSize={28}
                        highlightColor={selectedProject?.color}
                      />
                      
                      {/* Radar circles */}
                      <div className={styles.radarCircle1} />
                      <div className={styles.radarCircle2} />
                      <div className={styles.radarCircle3} />
                      <div className={styles.radarCircle4} />
                      <div className={styles.radarCircle5} />
                      <div className={styles.radarLineH} />
                      <div className={styles.radarLineV} />
                      <div className={styles.radarLineDiag1} />
                      <div className={styles.radarLineDiag2} />
                      <div className={styles.radarSweep} />

                      {/* Zone labels */}
                      <div className={styles.zoneLabel} style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                        <span>START</span>
                      </div>
                      <div className={styles.zoneLabelOuter}>
                        <span>LAUNCH →</span>
                      </div>

                      {/* Floating project dots */}
                      {projectPositions.map((project, index) => (
                        <FloatingDot
                          key={project.code}
                          project={project}
                          baseX={project.baseX}
                          baseY={project.baseY}
                          isActive={selectedProject?.code === project.code}
                          onClick={() => handleProjectClick(project)}
                          index={index}
                          zoom={zoom}
                        />
                      ))}

                      {/* Center */}
                      <div className={styles.radarCenter}>
                        <div className={styles.centerDot} />
                        <div className={styles.centerLabel}>CORE</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Zoom Controls */}
                  <div className={styles.zoomControls}>
                    <button className={styles.zoomBtn} onClick={zoomIn} title="Zoom In">+</button>
                    <div className={styles.zoomLevel}>{Math.round(zoom * 100)}%</div>
                    <button className={styles.zoomBtn} onClick={zoomOut} title="Zoom Out">−</button>
                  </div>

                  {/* Pan hint */}
                  <div className={styles.panHint}>
                    Drag to pan • Scroll/Pinch to zoom • Click dot to select
                  </div>
                </div>

                {/* Right Side: Info + Media (50/50) */}
                <div className={styles.rightPanels}>
                  {selectedProject ? (
                    <>
                      {/* Info Panel */}
                      <div className={styles.infoPanel}>
                        <div className={styles.panelCornerTL} style={{ borderColor: selectedProject.color }} />
                        <div className={styles.panelCornerTR} style={{ borderColor: selectedProject.color }} />
                        <div className={styles.panelCornerBL} style={{ borderColor: selectedProject.color }} />
                        <div className={styles.panelCornerBR} style={{ borderColor: selectedProject.color }} />

                        <div className={styles.panelHeader}>
                          <div className={styles.panelCode} style={{ color: selectedProject.color }}>
                            {selectedProject.code}
                          </div>
                          <div className={styles.panelStatus} data-status={selectedProject.status || 'active'}>
                            {(selectedProject.status || 'active').toUpperCase()}
                          </div>
                        </div>

                        <h2 className={styles.panelAlias}>{selectedProject.alias}</h2>
                        
                        {selectedProject.name && (
                          <p className={styles.panelName}>{selectedProject.name}</p>
                        )}

                        <div className={styles.panelSection}>
                          <div className={styles.sectionLabel}>PROGRESS</div>
                          {renderProgressBar(selectedProject.progress, selectedProject.color)}
                        </div>

                        <div className={styles.panelSection}>
                          <div className={styles.sectionLabel}>CATEGORY</div>
                          <div className={styles.panelCategory}>
                            <span style={{ color: PROJECT_CATEGORIES[selectedProject.category]?.color }}>
                              {PROJECT_CATEGORIES[selectedProject.category]?.icon}
                            </span>
                            {PROJECT_CATEGORIES[selectedProject.category]?.label || selectedProject.category}
                          </div>
                        </div>

                        {selectedProject.techStack && selectedProject.techStack.length > 0 && (
                          <div className={styles.panelSection}>
                            <div className={styles.sectionLabel}>TECH STACK</div>
                            <div className={styles.techStack}>
                              {selectedProject.techStack.map((tech, i) => (
                                <span key={i} className={styles.techBadge}>{tech}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedProject.description && (
                          <div className={styles.panelSection}>
                            <div className={styles.sectionLabel}>DESCRIPTION</div>
                            <p className={styles.panelDescription}>{selectedProject.description}</p>
                          </div>
                        )}

                        {selectedProject.startDate && (
                          <div className={styles.panelSection}>
                            <div className={styles.sectionLabel}>STARTED</div>
                            <div className={styles.panelDate}>{selectedProject.startDate}</div>
                          </div>
                        )}

                        <button 
                          className={styles.panelClose}
                          onClick={() => setSelectedProject(null)}
                        >
                          [ CLOSE ]
                        </button>
                      </div>

                      {/* Media Panel */}
                      <div className={styles.mediaPanel}>
                        <div className={styles.mediaPanelHeader}>
                          <span className={styles.mediaPanelIcon}>◎</span>
                          <span>MEDIA HISTORY</span>
                        </div>
                        
                        <MediaGallery 
                          media={selectedProjectMedia} 
                          projectColor={selectedProject.color}
                        />
                      </div>
                    </>
                  ) : (
                    <div className={styles.placeholderPanel}>
                      <div className={styles.placeholderContent}>
                        <div className={styles.placeholderIcon}>◈</div>
                        <p>Select a project</p>
                        <span>Click on any dot in the radar</span>
                        <div className={styles.legendBox}>
                          <div className={styles.legendItem}>
                            <span className={styles.legendDot} style={{ background: 'var(--terminal-accent)' }} />
                            <span>Center = New project (0%)</span>
                          </div>
                          <div className={styles.legendItem}>
                            <span className={styles.legendDot} style={{ background: 'var(--color-success)' }} />
                            <span>Edge = Near completion</span>
                          </div>
                          <div className={styles.legendItem}>
                            <span className={styles.legendDot} style={{ background: 'var(--terminal-text-muted)' }} />
                            <span>Outside = Launched (100%)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className={styles.expandedFooter}>
                <span>Projects move from center (0%) to edge (100%) as they progress</span>
                <span>ESC or click outside to close</span>
              </div>

              <div className={styles.scanLines} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
