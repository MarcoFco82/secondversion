import { useMemo, useState, useEffect, useCallback } from 'react';
import styles from './ProjectDetailPanel.module.css';

/**
 * Detects media type from URL or media_type field.
 */
function getMediaKind(item) {
  const type = (item.media_type || '').toLowerCase();
  const url = (item.media_url || '').toLowerCase();

  if (type === 'vimeo' || url.includes('vimeo.com')) return 'vimeo';
  if (type === 'youtube' || url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (type === 'video' || url.match(/\.(mp4|webm|mov)(\?|$)/)) return 'video';
  if (type === 'gif' || url.match(/\.gif(\?|$)/)) return 'gif';
  return 'image';
}

/**
 * Extracts embed URL for Vimeo/YouTube.
 */
function getEmbedUrl(item) {
  const url = item.media_url || '';
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&loop=1&muted=1`;
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&loop=1&mute=1`;
  return url;
}

/**
 * DOM overlay panel showing project details when a node is selected.
 */
export default function ProjectDetailPanel({ project, logs, onClose, lang = 'en' }) {
  const [mediaIndex, setMediaIndex] = useState(0);

  // Reset media index when project changes
  useEffect(() => {
    setMediaIndex(0);
  }, [project?.id]);

  if (!project) return null;

  const color = project.accent_color || '#ffa742';
  const mediaItems = project.media || [];

  // Find latest log for this project
  const latestLog = useMemo(() => {
    return logs.find((l) => l.projectCode === project.code || l.projectId === project.id);
  }, [logs, project]);

  // Parse tech stack
  const techStack = useMemo(() => {
    if (Array.isArray(project.tech_stack)) return project.tech_stack;
    try {
      return JSON.parse(project.tech_stack || '[]');
    } catch {
      return [];
    }
  }, [project.tech_stack]);

  const formatDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const currentMedia = mediaItems[mediaIndex];
  const mediaKind = currentMedia ? getMediaKind(currentMedia) : null;

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.projectCode} style={{ color }}>
            {project.code}
          </span>
          <button className={styles.closeBtn} onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Name & category */}
        <h3 className={styles.projectAlias}>{project.alias || project.display_name_en}</h3>
        <div className={styles.category}>{project.category || 'project'}</div>

        {/* Media section */}
        {mediaItems.length > 0 && currentMedia && (
          <div className={styles.mediaSection}>
            <div className={styles.mediaContainer}>
              {mediaKind === 'video' && (
                <video
                  key={currentMedia.media_url}
                  className={styles.mediaVideo}
                  src={currentMedia.media_url}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              )}
              {(mediaKind === 'image' || mediaKind === 'gif') && (
                <img
                  className={styles.mediaImage}
                  src={currentMedia.media_url}
                  alt={currentMedia.caption_en || project.alias}
                />
              )}
              {mediaKind === 'vimeo' && (
                <iframe
                  className={styles.mediaEmbed}
                  src={getEmbedUrl(currentMedia)}
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  frameBorder="0"
                />
              )}
              {mediaKind === 'youtube' && (
                <iframe
                  className={styles.mediaEmbed}
                  src={getEmbedUrl(currentMedia)}
                  allow="autoplay; fullscreen; encrypted-media"
                  allowFullScreen
                  frameBorder="0"
                />
              )}
            </div>

            {/* Dot navigation */}
            {mediaItems.length > 1 && (
              <div className={styles.mediaDots}>
                {mediaItems.map((_, i) => (
                  <button
                    key={i}
                    className={`${styles.mediaDot} ${i === mediaIndex ? styles.mediaDotActive : ''}`}
                    onClick={() => setMediaIndex(i)}
                    style={i === mediaIndex ? { background: color } : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Progress */}
        <div className={styles.progressSection}>
          <div className={styles.progressLabel}>
            <span>PROGRESS</span>
            <span>{project.progress ?? 0}%</span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${project.progress ?? 0}%`,
                background: color,
              }}
            />
          </div>
        </div>

        {/* Tech stack */}
        {techStack.length > 0 && (
          <div className={styles.techStack}>
            {techStack.map((tech, i) => (
              <span key={i} className={styles.techTag}>
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Latest log entry */}
        {latestLog && (
          <div className={styles.latestLog}>
            <div className={styles.logLabel}>
              {lang === 'es' ? 'ÚLTIMO LOG' : 'LATEST LOG'}
            </div>
            <p className={styles.logEntry}>{latestLog.oneLiner || latestLog.one_liner}</p>
            <div className={styles.logDate}>
              {formatDate(latestLog.createdAt || latestLog.created_at)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
