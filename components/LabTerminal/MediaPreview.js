import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './MediaPreview.module.css';

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
}

function formatShortDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric'
  });
}

/**
 * Detect media type from URL
 */
function detectMediaType(url) {
  if (!url) return 'unknown';
  if (url.includes('vimeo.com')) return 'vimeo';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.match(/\.(mp4|webm|mov)$/i)) return 'video';
  if (url.match(/\.gif$/i)) return 'gif';
  if (url.match(/\.(jpg|jpeg|png|webp|svg)$/i)) return 'image';
  return 'image'; // default
}

/**
 * Get embed URL for video platforms
 */
function getEmbedUrl(url, type) {
  if (type === 'vimeo') {
    // Already an embed URL
    if (url.includes('player.vimeo.com')) return url;
    // Extract video ID and convert
    const match = url.match(/vimeo\.com\/(\d+)/);
    if (match) return `https://player.vimeo.com/video/${match[1]}`;
    return url;
  }
  if (type === 'youtube') {
    // Already an embed URL
    if (url.includes('youtube.com/embed')) return url;
    // Extract video ID and convert
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
    return url;
  }
  return url;
}

// ===========================================
// TIMELINE THUMBNAIL COMPONENT
// ===========================================

function TimelineThumbnail({ 
  item, 
  index, 
  isActive, 
  onClick, 
  accentColor 
}) {
  const effectiveType = item.type || detectMediaType(item.url);
  const isEmbed = effectiveType === 'vimeo' || effectiveType === 'youtube';

  return (
    <motion.button
      className={`${styles.timelineThumb} ${isActive ? styles.timelineThumbActive : ''}`}
      onClick={() => onClick(index)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      style={isActive ? { borderColor: accentColor } : {}}
    >
      {isEmbed ? (
        <div className={styles.thumbVideoIcon}>
          <span>{effectiveType === 'vimeo' ? '▶' : '▶'}</span>
          <span className={styles.thumbPlatform}>
            {effectiveType.toUpperCase()}
          </span>
        </div>
      ) : effectiveType === 'video' ? (
        <div className={styles.thumbVideoIcon}>
          <span>▶</span>
        </div>
      ) : (
        <img 
          src={item.url} 
          alt={item.caption || `Media ${index + 1}`}
          className={styles.thumbImage}
        />
      )}
      <div className={styles.thumbDate}>{formatShortDate(item.date)}</div>
      {isActive && (
        <motion.div 
          className={styles.thumbIndicator}
          layoutId="activeThumb"
          style={{ backgroundColor: accentColor }}
        />
      )}
    </motion.button>
  );
}

// ===========================================
// MEDIA VIEWER COMPONENT (Expanded)
// ===========================================

function MediaViewer({ item, accentColor, onLoad }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const effectiveType = item?.type || detectMediaType(item?.url);

  useEffect(() => {
    if (effectiveType === 'video' && videoRef.current) {
      const video = videoRef.current;
      const updateProgress = () => {
        if (video.duration) {
          setProgress((video.currentTime / video.duration) * 100);
        }
      };
      video.addEventListener('timeupdate', updateProgress);
      return () => video.removeEventListener('timeupdate', updateProgress);
    }
  }, [effectiveType]);

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  if (!item) return null;

  switch (effectiveType) {
    case 'vimeo':
    case 'youtube':
      return (
        <div className={styles.embedContainer}>
          <iframe
            src={getEmbedUrl(item.url, effectiveType)}
            className={styles.embedIframe}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            onLoad={onLoad}
          />
          <div className={styles.embedBadge} style={{ backgroundColor: accentColor }}>
            {effectiveType.toUpperCase()}
          </div>
        </div>
      );

    case 'video':
      return (
        <div className={styles.videoContainer}>
          <video
            ref={videoRef}
            src={item.url}
            className={styles.mainVideo}
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={onLoad}
            onClick={togglePlay}
          />
          <div className={styles.videoControls}>
            <button 
              className={styles.playBtn}
              onClick={togglePlay}
            >
              {isPlaying ? '❚❚' : '▶'}
            </button>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ 
                  width: `${progress}%`,
                  backgroundColor: accentColor 
                }}
              />
            </div>
          </div>
        </div>
      );
    
    case 'gif':
      return (
        <img 
          src={item.url} 
          alt={item.caption || 'GIF'} 
          className={styles.mainImage}
          onLoad={onLoad}
        />
      );
    
    case 'image':
    default:
      return (
        <img 
          src={item.url} 
          alt={item.caption || 'Image'} 
          className={styles.mainImage}
          onLoad={onLoad}
        />
      );
  }
}

// ===========================================
// MAIN COMPONENT
// ===========================================

export default function MediaPreview({ 
  mediaUrl, 
  mediaType, 
  projectCode,
  projectAlias,
  projectName,
  accentColor = '#ffa742',
  mediaHistory = [],
  lang = 'en'
}) {
  const [frameCount, setFrameCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Detect effective media type
  const effectiveMediaType = mediaType || detectMediaType(mediaUrl);
  const isEmbed = effectiveMediaType === 'vimeo' || effectiveMediaType === 'youtube';

  // Combine media history (no need to add current separately, it should be in mediaHistory)
  const allMedia = useMemo(() => {
    if (mediaHistory.length > 0) {
      return mediaHistory.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
    }
    // Fallback: create single item from props if no history
    if (mediaUrl) {
      return [{
        type: effectiveMediaType,
        url: mediaUrl,
        caption: projectName || 'Current',
        date: new Date().toISOString(),
      }];
    }
    return [];
  }, [mediaUrl, effectiveMediaType, mediaHistory, projectName]);

  const activeMedia = allMedia[activeIndex];

  // Simulate frame counter for videos/gifs
  useEffect(() => {
    if (effectiveMediaType === 'video' || effectiveMediaType === 'gif') {
      const interval = setInterval(() => {
        setFrameCount(prev => (prev + 1) % 120);
      }, 1000 / 24);
      return () => clearInterval(interval);
    }
  }, [effectiveMediaType]);

  // Keyboard navigation in expanded mode
  useEffect(() => {
    if (!isExpanded) return;
    
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setIsExpanded(false);
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveIndex(prev => Math.min(allMedia.length - 1, prev + 1));
      }
    };
    
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isExpanded, allMedia.length]);

  // Translations
  const t = {
    en: {
      noPreview: 'NO PREVIEW',
      awaitingMedia: 'AWAITING MEDIA',
      previewActive: 'PREVIEW ACTIVE',
      items: 'items',
      clickToExpand: 'Click to expand',
      mediaTimeline: 'MEDIA TIMELINE',
      navigate: '← → Navigate',
      closeHint: 'ESC or click outside to close',
    },
    es: {
      noPreview: 'SIN PREVIEW',
      awaitingMedia: 'ESPERANDO MEDIA',
      previewActive: 'PREVIEW ACTIVO',
      items: 'items',
      clickToExpand: 'Click para expandir',
      mediaTimeline: 'TIMELINE DE MEDIA',
      navigate: '← → Navegar',
      closeHint: 'ESC o click afuera para cerrar',
    }
  }[lang] || {
    noPreview: 'NO PREVIEW',
    awaitingMedia: 'AWAITING MEDIA',
    previewActive: 'PREVIEW ACTIVE',
    items: 'items',
    clickToExpand: 'Click to expand',
    mediaTimeline: 'MEDIA TIMELINE',
    navigate: '← → Navigate',
    closeHint: 'ESC or click outside to close',
  };

  // Placeholder cuando no hay media
  const renderPlaceholder = () => (
    <div className={styles.placeholder}>
      <div className={styles.placeholderGrid}>
        {[...Array(16)].map((_, i) => (
          <div 
            key={i} 
            className={styles.gridCell}
            style={{ 
              animationDelay: `${i * 0.1}s`,
              borderColor: accentColor 
            }}
          />
        ))}
      </div>
      <div className={styles.placeholderText}>
        <span style={{ color: accentColor }}>{projectCode}</span>
        <span className={styles.noPreview}>{t.noPreview}</span>
      </div>
    </div>
  );

  // Mini preview render
  const renderMedia = () => {
    if (!mediaUrl && allMedia.length === 0) return renderPlaceholder();

    const displayUrl = mediaUrl || allMedia[0]?.url;
    const displayType = effectiveMediaType || detectMediaType(displayUrl);

    switch (displayType) {
      case 'vimeo':
      case 'youtube':
        // Show thumbnail placeholder for embeds in mini view
        return (
          <div className={styles.embedPreview}>
            <div className={styles.embedPlayIcon}>▶</div>
            <span className={styles.embedLabel}>{displayType.toUpperCase()}</span>
          </div>
        );

      case 'image':
        return (
          <img 
            src={displayUrl} 
            alt={projectCode} 
            className={styles.mediaImage}
            onLoad={() => setIsLoaded(true)}
          />
        );
      
      case 'gif':
        return (
          <img 
            src={displayUrl} 
            alt={projectCode} 
            className={styles.mediaImage}
            onLoad={() => setIsLoaded(true)}
          />
        );
      
      case 'video':
        return (
          <video
            src={displayUrl}
            className={styles.mediaVideo}
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => setIsLoaded(true)}
          />
        );
      
      default:
        return renderPlaceholder();
    }
  };

  const hasMedia = mediaUrl || allMedia.length > 0;

  return (
    <>
      {/* Mini Version - Clickable */}
      <div 
        className={styles.previewContainer}
        onClick={() => setIsExpanded(true)}
        role="button"
        tabIndex={0}
        aria-label="Expand media preview"
      >
        {/* Corner Brackets - HUD style */}
        <div className={styles.bracketTL} style={{ borderColor: accentColor }} />
        <div className={styles.bracketTR} style={{ borderColor: accentColor }} />
        <div className={styles.bracketBL} style={{ borderColor: accentColor }} />
        <div className={styles.bracketBR} style={{ borderColor: accentColor }} />
        
        {/* Media Content */}
        <div className={styles.mediaWrapper}>
          {renderMedia()}
          
          {/* Scan effect on load */}
          {!isLoaded && hasMedia && !isEmbed && (
            <div className={styles.scanEffect} style={{ backgroundColor: accentColor }} />
          )}
        </div>

        {/* Frame Counter (for video/gif) */}
        {(effectiveMediaType === 'video' || effectiveMediaType === 'gif') && hasMedia && (
          <div className={styles.frameCounter}>
            <span className={styles.frameIcon}>▸</span>
            <span className={styles.frameNum}>
              frame {String(frameCount).padStart(3, '0')}/120
            </span>
          </div>
        )}

        {/* Status indicator */}
        <div className={styles.statusBar}>
          <span 
            className={styles.statusDot} 
            style={{ backgroundColor: hasMedia ? '#4ade80' : accentColor }}
          />
          <span className={styles.statusText}>
            {hasMedia ? t.previewActive : t.awaitingMedia}
          </span>
          {allMedia.length > 0 && (
            <span className={styles.mediaCount} style={{ color: accentColor }}>
              {allMedia.length} {t.items}
            </span>
          )}
        </div>

        {/* Expand hint */}
        <div className={styles.expandHint}>
          <span>{t.clickToExpand}</span>
        </div>
      </div>

      {/* Expanded Lightbox */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className={styles.lightboxOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              className={styles.lightboxModal}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* HUD Frame */}
              <div className={styles.hudFrame}>
                <div className={styles.hudCornerTL} style={{ borderColor: accentColor }} />
                <div className={styles.hudCornerTR} style={{ borderColor: accentColor }} />
                <div className={styles.hudCornerBL} style={{ borderColor: accentColor }} />
                <div className={styles.hudCornerBR} style={{ borderColor: accentColor }} />

                {/* Header */}
                <div className={styles.lightboxHeader}>
                  <div className={styles.headerInfo}>
                    <span className={styles.headerIcon} style={{ color: accentColor }}>◎</span>
                    <span className={styles.headerCode} style={{ color: accentColor }}>
                      {projectCode}
                    </span>
                    {projectAlias && (
                      <span className={styles.headerAlias}>{projectAlias}</span>
                    )}
                    {projectName && (
                      <span className={styles.headerName}>{projectName}</span>
                    )}
                  </div>
                  <div className={styles.headerControls}>
                    <span className={styles.mediaCounter}>
                      {activeIndex + 1} / {allMedia.length}
                    </span>
                    <button 
                      className={styles.closeBtn}
                      onClick={() => setIsExpanded(false)}
                    >
                      [ESC]
                    </button>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className={styles.lightboxContent}>
                  {/* Navigation Arrow Left */}
                  {activeIndex > 0 && (
                    <button 
                      className={`${styles.navArrow} ${styles.navArrowLeft}`}
                      onClick={() => setActiveIndex(prev => prev - 1)}
                    >
                      ‹
                    </button>
                  )}

                  {/* Main Viewer */}
                  <div className={styles.mainViewer}>
                    {/* Animated brackets */}
                    <div className={styles.viewerBracketTL} style={{ borderColor: accentColor }} />
                    <div className={styles.viewerBracketTR} style={{ borderColor: accentColor }} />
                    <div className={styles.viewerBracketBL} style={{ borderColor: accentColor }} />
                    <div className={styles.viewerBracketBR} style={{ borderColor: accentColor }} />

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeIndex}
                        className={styles.mediaContainer}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        {allMedia.length > 0 ? (
                          <MediaViewer 
                            item={activeMedia}
                            accentColor={accentColor}
                            onLoad={() => {}}
                          />
                        ) : (
                          <div className={styles.emptyViewer}>
                            <span className={styles.emptyIcon}>◇</span>
                            <p>No media available</p>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>

                    {/* Scan lines */}
                    <div className={styles.scanLines} />
                  </div>

                  {/* Navigation Arrow Right */}
                  {activeIndex < allMedia.length - 1 && (
                    <button 
                      className={`${styles.navArrow} ${styles.navArrowRight}`}
                      onClick={() => setActiveIndex(prev => prev + 1)}
                    >
                      ›
                    </button>
                  )}
                </div>

                {/* Media Info */}
                {activeMedia && (
                  <div className={styles.mediaInfo}>
                    <div className={styles.infoLeft}>
                      {activeMedia.caption && (
                        <span className={styles.infoCaption}>{activeMedia.caption}</span>
                      )}
                      {activeMedia.date && (
                        <span className={styles.infoDate}>
                          {formatDate(activeMedia.date)}
                        </span>
                      )}
                    </div>
                    <div className={styles.infoRight}>
                      <span className={styles.infoType}>
                        {(activeMedia.type || detectMediaType(activeMedia.url))?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Timeline Gallery */}
                {allMedia.length > 1 && (
                  <div className={styles.timeline}>
                    <div className={styles.timelineLabel}>
                      <span className={styles.timelineIcon}>◈</span>
                      <span>{t.mediaTimeline}</span>
                    </div>
                    <div className={styles.timelineTrack}>
                      {/* Timeline line */}
                      <div className={styles.timelineLine} style={{ backgroundColor: accentColor }} />
                      
                      {/* Thumbnails */}
                      <div className={styles.timelineThumbs}>
                        {allMedia.map((item, index) => (
                          <TimelineThumbnail
                            key={index}
                            item={item}
                            index={index}
                            isActive={index === activeIndex}
                            onClick={setActiveIndex}
                            accentColor={accentColor}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className={styles.lightboxFooter}>
                  <span>{t.navigate}</span>
                  <span>{t.closeHint}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
