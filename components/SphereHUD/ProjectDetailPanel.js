import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
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
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&loop=1&muted=1`;
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&loop=1&mute=1`;
  return url;
}

/**
 * Modal overlay showing project details when a hexagon is clicked.
 * Desktop: horizontal layout (media left, info right).
 * Mobile: vertical layout (media top, info bottom).
 * Theme: neon orange (#ff6b00 / #ffa742).
 */
export default function ProjectDetailPanel({ project, logs, onClose, lang = 'en' }) {
  const [mediaIndex, setMediaIndex] = useState(0);
  const [professionalLogs, setProfessionalLogs] = useState([]);
  const [closing, setClosing] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState(null);
  const [selectedCreativeLogId, setSelectedCreativeLogId] = useState(null);
  const closingTimer = useRef(null);

  // Reset state when project changes
  useEffect(() => {
    setMediaIndex(0);
    setProfessionalLogs([]);
    setClosing(false);
    setSelectedLogId(null);
    setSelectedCreativeLogId(null);

    if (project?.id) {
      fetch(`/api/professional-logs?projectId=${project.id}`)
        .then(r => r.json())
        .then(data => {
          if (data.success) setProfessionalLogs(data.data || []);
        })
        .catch(() => {});
    }
  }, [project?.id]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => clearTimeout(closingTimer.current);
  }, []);

  // ALL hooks MUST be before any conditional return (React rules of hooks)
  const projectLogs = useMemo(() => {
    if (!project || !logs || !Array.isArray(logs)) return [];
    return logs.filter(
      (l) => l.projectCode === project.code || l.projectId === project.id
    );
  }, [logs, project]);

  const techStack = useMemo(() => {
    if (!project?.tech_stack) return [];
    if (Array.isArray(project.tech_stack)) return project.tech_stack.map(String);
    try {
      return JSON.parse(project.tech_stack).map(String);
    } catch {
      return [];
    }
  }, [project?.tech_stack]);

  // Animated close — play exit animation, then call onClose
  const handleClose = useCallback(() => {
    if (closing) return;
    setClosing(true);
    closingTimer.current = setTimeout(() => {
      setClosing(false);
      onClose();
    }, 350);
  }, [closing, onClose]);

  // Early return AFTER all hooks
  if (!project) return null;

  const color = project.accent_color || '#ffa742';
  const mediaItems = Array.isArray(project.media) ? project.media : [];
  const currentMedia = mediaItems[mediaIndex];
  const mediaKind = currentMedia ? getMediaKind(currentMedia) : null;

  // Find selected professional log's media
  const selectedLogMedia = selectedLogId
    ? professionalLogs.find(l => l.id === selectedLogId)
    : null;
  const logMediaItem = selectedLogMedia?.media_url
    ? { media_url: selectedLogMedia.media_url, media_type: selectedLogMedia.media_type }
    : null;

  // Find selected creative log's media (linked to project_media via media_id)
  const selectedCreativeLog = selectedCreativeLogId
    ? projectLogs.find(l => (l.id || l.logId) === selectedCreativeLogId)
    : null;
  const creativeLogMediaItem = selectedCreativeLog?.mediaId
    ? mediaItems.find(m => m.id === selectedCreativeLog.mediaId) || null
    : null;

  // Active log media: creative log takes priority, then professional log
  const activeLogMediaItem = creativeLogMediaItem || logMediaItem;
  const activeLogMediaKind = activeLogMediaItem ? getMediaKind(activeLogMediaItem) : null;

  // Has any displayable media (project or log)?
  const hasProjectMedia = mediaItems.length > 0 && currentMedia;
  const showingLogMedia = !!activeLogMediaItem;

  const handleLogClick = (logId, mediaUrl) => {
    if (!mediaUrl) return;
    setSelectedLogId(selectedLogId === logId ? null : logId);
    setSelectedCreativeLogId(null);
  };

  const handleCreativeLogClick = (logId, mediaId) => {
    if (!mediaId) return;
    setSelectedCreativeLogId(selectedCreativeLogId === logId ? null : logId);
    setSelectedLogId(null);
  };

  const handleProjectMediaNav = (newIndex) => {
    setSelectedLogId(null);
    setSelectedCreativeLogId(null);
    setMediaIndex(newIndex);
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  return (
    <div
      className={`${styles.overlay} ${closing ? styles.overlayClosing : ''}`}
      onClick={handleBackdropClick}
    >
      <div className={`${styles.modal} ${closing ? styles.modalClosing : ''}`}>
        {/* Close button */}
        <button className={styles.closeBtn} onClick={handleClose}>
          &times;
        </button>

        {/* Media section (left on desktop, top on mobile) */}
        <div className={styles.mediaSection}>
          {showingLogMedia ? (
            /* Log media mode — single media from selected creative or professional log */
            <div className={styles.mediaContainer}>
              {activeLogMediaKind === 'video' && (
                <video
                  key={activeLogMediaItem.media_url}
                  className={styles.mediaContent}
                  src={activeLogMediaItem.media_url}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              )}
              {(activeLogMediaKind === 'image' || activeLogMediaKind === 'gif') && (
                <img
                  className={styles.mediaContent}
                  src={activeLogMediaItem.media_url}
                  alt="Log media"
                />
              )}
              {(activeLogMediaKind === 'vimeo' || activeLogMediaKind === 'youtube') && (
                <iframe
                  className={styles.mediaEmbed}
                  src={getEmbedUrl(activeLogMediaItem)}
                  allow="autoplay; fullscreen; encrypted-media"
                  allowFullScreen
                  frameBorder="0"
                />
              )}
            </div>
          ) : hasProjectMedia ? (
            <>
              <div className={styles.mediaContainer}>
                {mediaKind === 'video' && (
                  <video
                    key={currentMedia.media_url}
                    className={styles.mediaContent}
                    src={currentMedia.media_url}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                )}
                {(mediaKind === 'image' || mediaKind === 'gif') && (
                  <img
                    className={styles.mediaContent}
                    src={currentMedia.media_url}
                    alt={currentMedia.caption_en || project.alias}
                  />
                )}
                {(mediaKind === 'vimeo' || mediaKind === 'youtube') && (
                  <iframe
                    className={styles.mediaEmbed}
                    src={getEmbedUrl(currentMedia)}
                    allow="autoplay; fullscreen; encrypted-media"
                    allowFullScreen
                    frameBorder="0"
                  />
                )}
              </div>

              {mediaItems.length > 1 && (
                <div className={styles.mediaNav}>
                  <button
                    className={styles.mediaArrow}
                    onClick={() => handleProjectMediaNav((mediaIndex - 1 + mediaItems.length) % mediaItems.length)}
                    aria-label="Previous"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <div className={styles.mediaIndicators}>
                    {mediaItems.map((_, i) => (
                      <button
                        key={i}
                        className={`${styles.mediaIndicator} ${i === mediaIndex ? styles.mediaIndicatorActive : ''}`}
                        onClick={() => handleProjectMediaNav(i)}
                        aria-label={`Media ${i + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    className={styles.mediaArrow}
                    onClick={() => handleProjectMediaNav((mediaIndex + 1) % mediaItems.length)}
                    aria-label="Next"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className={styles.mediaPlaceholder}>
              <span className={styles.placeholderCode} style={{ color }}>{project.code}</span>
            </div>
          )}
        </div>

        {/* Info section (right on desktop, bottom on mobile) */}
        <div className={styles.infoSection}>
          {/* Header */}
          <div className={styles.infoHeader}>
            <span className={styles.projectCode} style={{ color }}>
              {project.code}
            </span>
            <span className={styles.category}>{project.category || 'project'}</span>
          </div>

          <h3 className={styles.projectName}>
            {lang === 'es' && project.display_name_es
              ? project.display_name_es
              : project.display_name_en || project.alias}
          </h3>

          {/* Progress */}
          <div className={styles.progressSection}>
            <div className={styles.progressLabel}>
              <span>PROGRESS</span>
              <span>{project.progress ?? 0}%</span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${project.progress ?? 0}%`, background: color }}
              />
            </div>
          </div>

          {/* Tech stack */}
          {techStack.length > 0 && (
            <div className={styles.techStack}>
              {techStack.map((tech, i) => (
                <span key={i} className={styles.techTag}>{tech}</span>
              ))}
            </div>
          )}

          {/* Logs area — 2/3 creative + 1/3 professional */}
          <div className={styles.logsArea}>
            <div className={styles.logsSplit}>
              {/* Creative logs — 2/3 */}
              <div className={styles.creativeLogs}>
                <div className={styles.logGroupTitle}>CREATIVE LOGS</div>
                <div className={styles.logsScroll}>
                  {projectLogs.map((log, i) => (
                    <div
                      key={log.id || i}
                      className={`${styles.logItem} ${log.mediaId ? styles.logClickable : ''} ${selectedCreativeLogId === (log.id || i) ? styles.logSelected : ''}`}
                      onClick={() => handleCreativeLogClick(log.id, log.mediaId)}
                      style={selectedCreativeLogId === log.id ? {
                        background: `${color}1A`,
                        borderColor: `${color}66`,
                      } : undefined}
                    >
                      <span className={styles.logDate}>
                        {formatDate(log.createdAt || log.created_at)}
                      </span>
                      <span className={styles.logText}>
                        {log.oneLiner || log.one_liner}
                      </span>
                      {log.mediaId && (
                        <span className={styles.logMediaIcon} style={{ color }}>
                          &#9654;
                        </span>
                      )}
                    </div>
                  ))}
                  {projectLogs.length === 0 && (
                    <div className={styles.noLogs}>
                      {lang === 'es' ? 'Sin creative logs' : 'No creative logs'}
                    </div>
                  )}
                </div>
              </div>

              {/* Professional logs — 1/3 */}
              <div className={styles.professionalLogs}>
                <div className={styles.logGroupTitle}>PROFESSIONAL LOGS</div>
                <div className={styles.logsScroll}>
                  {professionalLogs.map((log) => (
                    <div
                      key={log.id}
                      className={`${styles.logItem} ${log.media_url ? styles.logClickable : ''} ${selectedLogId === log.id ? styles.logSelected : ''}`}
                      onClick={() => handleLogClick(log.id, log.media_url)}
                      style={selectedLogId === log.id ? {
                        background: `${color}1A`,
                        borderColor: `${color}66`,
                      } : undefined}
                    >
                      <span className={styles.logDate}>
                        {formatDate(log.log_date)}
                      </span>
                      <span className={styles.logText}>{log.content}</span>
                      {log.media_url && (
                        <span className={styles.logMediaIcon} style={{ color }}>
                          &#9654;
                        </span>
                      )}
                    </div>
                  ))}
                  {professionalLogs.length === 0 && (
                    <div className={styles.noLogs}>
                      {lang === 'es' ? 'Sin professional logs' : 'No professional logs'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
