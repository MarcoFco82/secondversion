import { useMemo } from 'react';
import styles from './ProjectDetailPanel.module.css';

/**
 * DOM overlay panel showing project details when a node is selected.
 */
export default function ProjectDetailPanel({ project, logs, onClose, lang = 'en' }) {
  if (!project) return null;

  const color = project.accent_color || '#ffa742';

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
