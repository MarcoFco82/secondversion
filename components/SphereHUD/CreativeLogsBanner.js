import { useMemo, useRef, useState, useEffect } from 'react';
import styles from './CreativeLogsBanner.module.css';

/**
 * CreativeLogsBanner — HUD-styled professional logs panel below SphereHUD.
 * Features: expandable panel, filter by project, sort toggle, links, glow FX.
 * Colors from sphereConfig (admin-defined).
 */
export default function CreativeLogsBanner({ sphereConfig, lang = 'en' }) {
  const [professionalLogs, setProfessionalLogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [filterProject, setFilterProject] = useState('all');
  const [sortNewest, setSortNewest] = useState(true);

  const accentColor = sphereConfig?.strokeColor || '#38bdf8';

  useEffect(() => {
    Promise.all([
      fetch('/api/professional-logs').then(r => r.json()),
      fetch('/api/projects').then(r => r.json()),
    ]).then(([logsData, projData]) => {
      if (logsData.success) setProfessionalLogs(logsData.data || []);
      if (projData.success) setProjects(projData.data || []);
    }).catch(() => {});
  }, []);

  const getProject = (projectId) => {
    if (!projectId) return null;
    return projects.find(p => p.id === projectId) || null;
  };

  const displayLogs = useMemo(() => {
    let filtered = professionalLogs;
    if (filterProject !== 'all') {
      filtered = filtered.filter(l => l.project_id === filterProject);
    }
    return [...filtered].sort((a, b) => {
      const da = new Date(a.log_date || a.created_at);
      const db = new Date(b.log_date || b.created_at);
      return sortNewest ? db - da : da - db;
    });
  }, [professionalLogs, filterProject, sortNewest]);

  const logProjectIds = useMemo(() => {
    const ids = new Set(professionalLogs.map(l => l.project_id).filter(Boolean));
    return projects.filter(p => ids.has(p.id));
  }, [professionalLogs, projects]);

  if (professionalLogs.length === 0) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div
      className={styles.bannerContainer}
      style={{
        '--accent': accentColor,
        borderColor: `${accentColor}25`,
        boxShadow: `0 0 20px ${accentColor}10, 0 0 40px ${accentColor}08, inset 0 1px 0 ${accentColor}15`,
      }}
    >
      <div className={styles.glowLine} style={{ background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)` }} />
      <div className={styles.scanlines} />

      {/* Header bar */}
      <div className={styles.headerBar}>
        <span className={styles.bannerLabel} style={{ color: accentColor }}>
          ACTIVITY LOG
        </span>

        <div className={styles.controls}>
          {logProjectIds.length > 0 && (
            <select
              className={styles.filterSelect}
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              style={{ borderColor: `${accentColor}30`, color: accentColor }}
            >
              <option value="all">All Projects ▾</option>
              {logProjectIds.map(p => (
                <option key={p.id} value={p.id}>{p.code}</option>
              ))}
            </select>
          )}

          <button
            className={styles.sortBtn}
            onClick={() => setSortNewest(!sortNewest)}
            style={{ borderColor: `${accentColor}30`, color: accentColor }}
          >
            {sortNewest ? '↓ Latest' : '↑ Oldest'}
          </button>

          {/* Expand/collapse entire panel */}
          <button
            className={styles.expandPanelBtn}
            onClick={() => setExpanded(!expanded)}
            style={{
              color: accentColor,
              borderColor: `${accentColor}40`,
              textShadow: `0 0 6px ${accentColor}50`,
              boxShadow: expanded ? `0 0 10px ${accentColor}25` : 'none',
            }}
          >
            {expanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {/* Scrollable logs area */}
      <div className={`${styles.logsScroll} ${expanded ? styles.logsExpanded : ''}`}>
        {displayLogs.map((log) => {
          const proj = getProject(log.project_id);
          return (
            <div key={log.id} className={styles.logEntry}>
              <div className={styles.logRow}>
                {proj && (
                  <span
                    className={styles.projectCode}
                    style={{
                      color: accentColor,
                      textShadow: `0 0 8px ${accentColor}60, 0 0 16px ${accentColor}30`,
                    }}
                  >
                    {proj.code}
                  </span>
                )}
                <span className={styles.logDate}>{formatDate(log.log_date)}</span>
                <span className={styles.logText}>{log.content}</span>
                {log.media_url && (
                  <a
                    href={log.media_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkBtn}
                    style={{
                      color: accentColor,
                      textShadow: `0 0 6px ${accentColor}50`,
                      borderColor: `${accentColor}40`,
                    }}
                  >
                    LINK ↗
                  </a>
                )}
              </div>
            </div>
          );
        })}

        {displayLogs.length === 0 && (
          <div className={styles.emptyState}>
            {lang === 'es' ? 'Sin logs para este filtro' : 'No logs for this filter'}
          </div>
        )}
      </div>
    </div>
  );
}
