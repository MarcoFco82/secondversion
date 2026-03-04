import { useState, useEffect, useRef, useCallback } from 'react';

export default function ProjectCard({ project, language, slideshowInterval = 4, onProjectClick, onMediaSelect }) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);

  // Filter only images and gifs for slideshow
  const slideshowMedia = (project.media || []).filter(
    m => m.type === 'image' || m.type === 'gif'
  );

  const hasSlideshow = slideshowMedia.length > 1;

  // Auto-rotate slideshow
  useEffect(() => {
    if (!hasSlideshow || isHovered) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentMediaIndex(prev => (prev + 1) % slideshowMedia.length);
    }, slideshowInterval * 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [hasSlideshow, isHovered, slideshowInterval, slideshowMedia.length]);

  const displayName = project.displayName?.[language] || project.displayName?.en || 'Untitled';
  const description = project.description?.[language] || project.description?.en || [];

  // Determine what to show as cover
  const hasFeaturedVideo = project.featuredMediaType === 'video' && project.featuredMediaUrl;

  // Current slideshow image URL
  const currentImageUrl = hasSlideshow
    ? slideshowMedia[currentMediaIndex]?.url
    : (project.thumbnailUrl || (project.media?.length > 0 ? project.media[0].url : null));

  const handleClick = useCallback(() => {
    if (project.externalUrl) {
      window.open(project.externalUrl, '_blank', 'noopener,noreferrer');
    } else if (onProjectClick) {
      onProjectClick(project, displayName);
    }
  }, [project, displayName, onProjectClick]);

  return (
    <div className="project-item">
      <div
        className={`project-image ${!currentImageUrl && !hasFeaturedVideo ? 'project-image-empty' : ''}`}
        style={{
          borderColor: project.accentColor,
        }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && handleClick()}
      >
        {/* Video cover */}
        {hasFeaturedVideo ? (
          <video
            src={project.featuredMediaUrl}
            autoPlay
            muted
            loop
            playsInline
            className="slideshow-video-cover"
          />
        ) : currentImageUrl ? (
          /* Slideshow images */
          <div className="slideshow-container">
            {hasSlideshow ? (
              slideshowMedia.map((media, idx) => (
                <div
                  key={media.id || idx}
                  className="slideshow-image"
                  style={{
                    backgroundImage: `url(${media.url})`,
                    opacity: idx === currentMediaIndex ? 1 : 0,
                  }}
                />
              ))
            ) : (
              <div
                className="slideshow-image"
                style={{
                  backgroundImage: `url(${currentImageUrl})`,
                  opacity: 1,
                }}
              />
            )}
          </div>
        ) : (
          /* No thumbnail placeholder */
          <div className="project-image-placeholder">
            <span style={{ color: project.accentColor }}>{project.code || project.alias}</span>
          </div>
        )}

        {/* Progress indicator */}
        {project.status === 'active' && project.progress > 0 && (
          <div
            className="project-progress-badge"
            style={{ backgroundColor: project.accentColor }}
          >
            {project.progress}%
          </div>
        )}

        {/* Media count badge */}
        {project.media?.length > 1 && (
          <div
            className="project-media-count"
            style={{ backgroundColor: project.accentColor }}
          >
            {project.media.length}
          </div>
        )}

        {/* Slideshow dots */}
        {hasSlideshow && !hasFeaturedVideo && (
          <div className="slideshow-dots">
            {slideshowMedia.map((_, idx) => (
              <span
                key={idx}
                className={`slideshow-dot ${idx === currentMediaIndex ? 'active' : ''}`}
                style={idx === currentMediaIndex ? { backgroundColor: project.accentColor } : {}}
              />
            ))}
          </div>
        )}
      </div>

      <div className="project-info">
        <h3 style={{ color: project.accentColor }}>{displayName}</h3>
        <div className="project-description">
          {description.map((line, idx) => (
            <p key={idx} className="description-line">{line}</p>
          ))}
        </div>
        <div className="project-keywords">
          {project.keywords?.map((keyword, idx) => (
            <span
              key={idx}
              className="keyword-badge"
              style={{ borderColor: project.accentColor }}
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
