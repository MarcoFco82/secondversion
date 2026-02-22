import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './LabTerminalHUD.module.css';
import LabTerminalIntro from './LabTerminalIntro';
import MediaPreview from './MediaPreview';
import ActivityPulse from './ActivityPulse';
import ProjectRadarExpanded from './ProjectRadarExpanded';
import LogDetailsPanel from './LogDetailsPanel';

const FILTERS = ['All', 'Build', 'Ship', 'Experiment', 'Polish'];

export default function LabTerminalHUD({ lang = 'en' }) {
  // State for API data
  const [projects, setProjects] = useState([]);
  const [logs, setLogs] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI state
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeProjectCode, setActiveProjectCode] = useState(null);
  const [isLive, setIsLive] = useState(true);
  const [selectedDayFilter, setSelectedDayFilter] = useState(null);

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch projects
        const projectsRes = await fetch('/api/projects');
        const projectsData = await projectsRes.json();
        if (projectsData.success) {
          setProjects(projectsData.data || []);
        }

        // Fetch logs
        const logsRes = await fetch('/api/logs');
        const logsData = await logsRes.json();
        if (logsData.success) {
          setLogs(logsData.data || []);
        }

        // Fetch activity
        const activityRes = await fetch('/api/activity');
        const activityData = await activityRes.json();
        if (activityData.success) {
          setActivity(activityData.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Live indicator blink
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLive(prev => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Enrich logs with project data
  const enrichedLogs = useMemo(() => {
    return logs.map(log => {
      const project = projects.find(p => p.id === log.project_id);
      return {
        ...log,
        projectId: log.project_id,
        entryType: log.entry_type,
        oneLiner: log.one_liner,
        challengeAbstract: log.challenge_abstract,
        mentalNote: log.mental_note,
        createdAt: log.created_at,
        projectCode: log.project_code || project?.code,
        projectAlias: log.project_alias || project?.alias,
        accentColor: log.project_color || project?.accent_color,
        techStack: (() => { try { return JSON.parse(log.project_tech_stack || project?.tech_stack || '[]'); } catch { return []; } })(),
        progress: log.project_progress ?? project?.progress ?? 0,
        category: log.project_category || project?.category,
      };
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [logs, projects]);

  // Filter logs
  const filteredLogs = useMemo(() => {
    return enrichedLogs.filter(log => {
      if (activeFilter === 'All') return true;
      if (activeFilter === 'Build') return log.entryType === 'build';
      if (activeFilter === 'Ship') return log.entryType === 'ship';
      if (activeFilter === 'Experiment') return log.entryType === 'experiment';
      if (activeFilter === 'Polish') return log.entryType === 'polish';
      return true;
    });
  }, [enrichedLogs, activeFilter]);

  // Active log (first filtered or by selected project)
  const activeLog = useMemo(() => {
    if (activeProjectCode) {
      return filteredLogs.find(log => log.projectCode === activeProjectCode) || filteredLogs[0];
    }
    return filteredLogs[0];
  }, [filteredLogs, activeProjectCode]);

  // Log-driven: activeProject derives from the active log
  const activeProject = useMemo(() => {
    if (!activeLog?.projectId) return null;
    return projects.find(p => p.id === activeLog.projectId);
  }, [activeLog, projects]);

  // Fallback for projects without logs (clicked from radar)
  const fallbackProject = useMemo(() => {
    if (!activeProjectCode) return null;
    const hasLogs = filteredLogs.some(log => log.projectCode === activeProjectCode);
    if (hasLogs) return null;
    return projects.find(p => p.code === activeProjectCode) || null;
  }, [activeProjectCode, filteredLogs, projects]);

  // State for active project media
  const [activeProjectMedia, setActiveProjectMedia] = useState([]);

  // Fetch media when active project changes (log-driven with fallback)
  useEffect(() => {
    const fetchProjectMedia = async () => {
      const projectId = activeLog?.projectId || fallbackProject?.id;
      if (!projectId) {
        setActiveProjectMedia([]);
        return;
      }

      try {
        const res = await fetch(`/api/media?projectId=${projectId}`);
        const data = await res.json();

        if (data.success && data.data) {
          // Transform to format expected by MediaPreview
          const mediaItems = data.data.map(m => ({
            id: m.id,
            type: m.media_type,
            url: m.media_url,
            caption: m.caption_en || m.caption_es || '',
            date: m.created_at,
          }));
          setActiveProjectMedia(mediaItems);
        } else {
          setActiveProjectMedia([]);
        }
      } catch (error) {
        console.error('Error fetching project media:', error);
        setActiveProjectMedia([]);
      }
    };

    fetchProjectMedia();
  }, [activeLog?.projectId, fallbackProject?.id]);

  // All projects for radar (not just those with logs)
  const uniqueProjects = useMemo(() => {
    return projects.map(project => ({
      id: project.id,
      code: project.code,
      alias: project.alias,
      color: project.accent_color,
      progress: project.progress,
      category: project.category,
      status: project.status,
    }));
  }, [projects]);

  // Activity array for chart
  const activityArray = useMemo(() => {
    return activity.map(a => a.entry_count || 0);
  }, [activity]);

  // Handle log selection from LogDetailsPanel
  const handleLogSelect = useCallback((log) => {
    setActiveProjectCode(log.projectCode);
  }, []);

  // Handle project selection from Radar
  const handleProjectSelect = useCallback((code) => {
    setActiveProjectCode(code);
  }, []);

  // Handle day selection from ActivityPulse
  const handleDaySelect = useCallback((dayIndex, value, dayLabel) => {
    setSelectedDayFilter(dayIndex);
    console.log('Filter by day:', dayLabel, 'with', value, 'entries');
  }, []);

  // Format timestamp for display
  const formatTimestamp = useCallback((isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).replace(',', '');
  }, []);

  // Transform logs for LogDetailsPanel
  const transformedLogs = useMemo(() => {
    return filteredLogs.map(log => ({
      ...log,
      timestamp: formatTimestamp(log.createdAt),
    }));
  }, [filteredLogs, formatTimestamp]);

  const translations = {
    en: {
      title: 'LAB TERMINAL',
      live: 'LIVE',
      type: 'TYPE',
      stack: 'STACK',
      build: 'BUILD',
      solved: 'SOLVED',
      activity: 'ACTIVITY',
      weeklyPulse: '14-day pulse',
      viewArchive: 'View archive',
      projects: 'PROJECTS',
      history: 'HISTORY',
      paused: 'PAUSED',
      autoRotate: 'AUTO',
      noData: 'No data yet. Create projects in Admin Console.',
    },
    es: {
      title: 'LAB TERMINAL',
      live: 'EN VIVO',
      type: 'TIPO',
      stack: 'STACK',
      build: 'BUILD',
      solved: 'RESUELTO',
      activity: 'ACTIVIDAD',
      weeklyPulse: 'pulso 14 días',
      viewArchive: 'Ver archivo',
      projects: 'PROYECTOS',
      history: 'HISTORIAL',
      paused: 'PAUSADO',
      autoRotate: 'AUTO',
      noData: 'Sin datos aún. Crea proyectos en Admin Console.',
    }
  };

  const t = translations[lang] || translations.en;

  // Show loading state
  if (loading) {
    return (
      <>
        <LabTerminalIntro lang={lang} />
        <div className={styles.terminalWrapper}>
          <div className={styles.terminal}>
            <div className={styles.loadingState}>Loading...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <LabTerminalIntro lang={lang} />
      
      <div className={styles.terminalWrapper}>
        <div className={styles.terminal}>
          {/* Scan line overlay */}
          <div className={styles.scanLines} />
          
          {/* Header */}
          <div className={styles.terminalHeader}>
            <div className={styles.terminalTitle}>
              <span className={styles.terminalIcon}>►</span>
              {t.title}
              <span className={styles.terminalVersion}>v3.2.0</span>
            </div>
            <div className={styles.terminalControls}>
              <span className={`${styles.liveIndicator} ${isLive ? styles.liveActive : ''}`}>
                {t.live}
              </span>
              <div className={styles.windowButtons}>
                <span className={styles.windowBtn} />
                <span className={styles.windowBtn} />
                <span className={styles.windowBtn} />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className={styles.terminalContent}>
            {projects.length === 0 && logs.length === 0 ? (
              <div className={styles.emptyState}>
                <p>{t.noData}</p>
              </div>
            ) : (
              <>
                <div className={styles.hudGrid}>
                  
                  {/* Left Column: Media Preview + Radar */}
                  <div className={styles.leftColumn}>
                    <MediaPreview
                      key={activeLog?.projectCode || fallbackProject?.code}
                      mediaUrl={activeProject?.featured_media_url || fallbackProject?.featured_media_url}
                      mediaType={activeProject?.featured_media_type || fallbackProject?.featured_media_type}
                      projectCode={activeLog?.projectCode || fallbackProject?.code}
                      projectAlias={activeLog?.projectAlias || fallbackProject?.alias}
                      accentColor={activeLog?.accentColor || fallbackProject?.accent_color}
                      projectName={activeProject?.display_name_en || fallbackProject?.display_name_en}
                      mediaHistory={activeProjectMedia}
                      lang={lang}
                    />

                    <ProjectRadarExpanded
                      projects={uniqueProjects}
                      activeProject={activeLog?.projectCode || fallbackProject?.code}
                      onProjectSelect={handleProjectSelect}
                      label={t.projects}
                    />
                  </div>

                  {/* Right Column: Log Details Panel */}
                  <div className={styles.rightColumn}>
                    <LogDetailsPanel
                      logs={transformedLogs}
                      activeProjectCode={activeProjectCode}
                      onLogSelect={handleLogSelect}
                      translations={{
                        type: t.type,
                        stack: t.stack,
                        build: t.build,
                        solved: t.solved,
                        history: t.history,
                        paused: t.paused,
                        autoRotate: t.autoRotate,
                      }}
                      autoRotateInterval={4000}
                      resumeDelay={3000}
                    />
                  </div>
                </div>

                {/* Activity Pulse */}
                <ActivityPulse 
                  data={activityArray} 
                  label={t.activity}
                  sublabel={t.weeklyPulse}
                  onDaySelect={handleDaySelect}
                  accentColor={activeLog?.accentColor || fallbackProject?.accent_color || 'var(--terminal-accent)'}
                />
              </>
            )}

            {/* Footer: Filters */}
            <div className={styles.terminalFooter}>
              <div className={styles.filterButtons}>
                {FILTERS.map(filter => (
                  <button
                    key={filter}
                    className={`${styles.filterBtn} ${activeFilter === filter ? styles.filterActive : ''}`}
                    onClick={() => {
                      setActiveFilter(filter);
                      setActiveProjectCode(null);
                    }}
                  >
                    [{filter}]
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
