import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './LogDetailsPanel.module.css';

const ENTRY_TYPE_LABELS = {
  build: 'BUILD',
  ship: 'SHIP',
  experiment: 'EXPERIMENT',
  polish: 'POLISH',
  study: 'STUDY',
  wire: 'WIRE',
};

// Hook para auto-rotate con pausa en interacción
function useAutoRotate(length, interval = 8000, resumeDelay = 4000) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimeoutRef = useRef(null);
  const intervalRef = useRef(null);

  // Auto-rotate logic
  useEffect(() => {
    if (isPaused || length === 0) return;
    
    intervalRef.current = setInterval(() => {
      setIndex(prev => {
        const next = (prev + 1) % length;
        console.log('[AUTO-ROTATE] index:', prev, '→', next);
        return next;
      });
    }, interval);
    
    return () => clearInterval(intervalRef.current);
  }, [isPaused, length, interval]);

  // Pause function - pausa y programa resume
  const pause = useCallback(() => {
    setIsPaused(true);
    
    // Limpiar timeout anterior si existe
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    
    // Programar resume
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, resumeDelay);
  }, [resumeDelay]);

  // Manual set index
  const goTo = useCallback((newIndex) => {
    setIndex(newIndex);
    pause();
  }, [pause]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { index, isPaused, pause, goTo, setIndex };
}

// Componente de entrada de log individual
function LogEntry({ 
  log, 
  isActive, 
  isFaded, 
  onClick, 
  translations,
  showFull = false 
}) {
  const opacity = isFaded ? 0.4 : isActive ? 1 : 0.7;
  
  return (
    <motion.div
      className={`${styles.logEntry} ${isActive ? styles.logEntryActive : ''}`}
      style={{ 
        opacity,
        borderLeftColor: isActive ? log.accentColor : 'transparent'
      }}
      onClick={onClick}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity, x: 0 }}
      transition={{ duration: 0.3 }}
      layout
    >
      {/* Header */}
      <div className={styles.entryHeader}>
        <span 
          className={styles.entryCode}
          style={{ color: log.accentColor }}
        >
          {log.projectCode}
        </span>
        <span className={styles.entrySeparator}>|</span>
        <span className={styles.entryAlias}>{log.projectAlias}</span>
        <span className={styles.entryTimestamp}>[{log.timestamp}]</span>
      </div>

      {/* Details - expandido o resumido */}
      {(isActive || showFull) ? (
        <div className={styles.entryDetails}>
          <div className={styles.detailRow}>
            <span className={styles.detailPrefix}>├─</span>
            <span className={styles.detailLabel}>{translations.type}</span>
            <span className={styles.detailColon}>:</span>
            <span 
              className={styles.detailValue}
              style={{ color: log.accentColor }}
            >
              {ENTRY_TYPE_LABELS[log.entryType]}
            </span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.detailPrefix}>├─</span>
            <span className={styles.detailLabel}>{translations.stack}</span>
            <span className={styles.detailColon}>:</span>
            <span className={styles.detailValue}>
              {log.techStack?.map((tech, i) => (
                <span key={i}>
                  {tech}
                  {i < log.techStack.length - 1 && (
                    <span style={{ color: log.accentColor }}> • </span>
                  )}
                </span>
              ))}
            </span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.detailPrefix}>├─</span>
            <span className={styles.detailLabel}>{translations.build}</span>
            <span className={styles.detailColon}>:</span>
            <span className={styles.detailValue}>{log.oneLiner}</span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.detailPrefix}>├─</span>
            <span className={styles.detailLabel}>{translations.solved}</span>
            <span className={styles.detailColon}>:</span>
            <span className={styles.detailValueMuted}>{log.challengeAbstract}</span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.detailPrefix}>└─</span>
            <ProgressBar progress={log.progress} color={log.accentColor} />
          </div>

          {/* Mental Note */}
          {log.mentalNote && (
            <div className={styles.mentalNote}>
              <span className={styles.notePrefix}>//</span>
              "{log.mentalNote}"
            </div>
          )}
        </div>
      ) : (
        <div className={styles.entrySummary}>
          <span style={{ color: log.accentColor }}>
            {ENTRY_TYPE_LABELS[log.entryType]}
          </span>
          <span className={styles.summaryDivider}>→</span>
          <span>{log.oneLiner}</span>
        </div>
      )}
    </motion.div>
  );
}

// Progress bar component
function ProgressBar({ progress, color }) {
  const filled = Math.floor(progress / 4);
  const empty = 25 - filled;
  
  return (
    <span className={styles.progressBar}>
      <span className={styles.progressFilled} style={{ color }}>
        {'█'.repeat(filled)}
      </span>
      <span className={styles.progressEmpty}>{'░'.repeat(empty)}</span>
      <span className={styles.progressPercent} style={{ color }}>{progress}%</span>
    </span>
  );
}

export default function LogDetailsPanel({
  logs = [],
  activeProjectCode,
  onLogSelect,
  translations = {
    type: 'TYPE',
    stack: 'STACK',
    build: 'BUILD',
    solved: 'SOLVED',
    history: 'HISTORY',
    paused: 'PAUSED',
    autoRotate: 'AUTO',
  },
  autoRotateInterval = 8000,
  resumeDelay = 4000,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollContainerRef = useRef(null);
  const { index, isPaused, pause, goTo } = useAutoRotate(
    logs.length, 
    autoRotateInterval, 
    resumeDelay
  );

  const activeLog = logs[index];
  const lastNotifiedProjectRef = useRef(null);

  // Agrupar logs por proyecto
  const logsByProject = useMemo(() => {
    const grouped = new Map();
    logs.forEach(log => {
      if (!grouped.has(log.projectCode)) {
        grouped.set(log.projectCode, []);
      }
      grouped.get(log.projectCode).push(log);
    });
    return grouped;
  }, [logs]);

  // Logs del proyecto activo para historial
  const projectHistory = useMemo(() => {
    if (!activeLog) return [];
    return logsByProject.get(activeLog.projectCode) || [];
  }, [activeLog, logsByProject]);

  // Handle scroll - pausa auto-rotate
  const handleScroll = useCallback(() => {
    pause();
  }, [pause]);

  // Handle interaction - pausa auto-rotate
  const handleInteraction = useCallback(() => {
    pause();
  }, [pause]);

  // Handle log click
  const handleLogClick = useCallback((logIndex) => {
    goTo(logIndex);
    if (onLogSelect) {
      onLogSelect(logs[logIndex]);
    }
  }, [goTo, logs, onLogSelect]);

  // Sync solo con selección EXTERNA (radar click, no auto-rotate)
  useEffect(() => {
    if (activeProjectCode && logs.length > 0 && activeProjectCode !== lastNotifiedProjectRef.current) {
      const projectIndex = logs.findIndex(log => log.projectCode === activeProjectCode);
      if (projectIndex !== -1 && projectIndex !== index) {
        lastNotifiedProjectRef.current = activeProjectCode;
        goTo(projectIndex);
      }
    }
  }, [activeProjectCode, logs, index, goTo]);

  // Notify parent when activeLog changes (auto-rotate or manual)
  useEffect(() => {
    if (activeLog && onLogSelect) {
      console.log('[NOTIFY] firing for project:', activeLog.projectCode, 'index:', index);
      lastNotifiedProjectRef.current = activeLog.projectCode;
      onLogSelect(activeLog);
    }
  }, [activeLog, onLogSelect]);

  // ESC para cerrar expanded
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isExpanded]);

  if (!activeLog) return null;

  return (
    <>
      {/* Mini Version */}
      <div 
        className={styles.panelContainer}
        onMouseEnter={handleInteraction}
        onTouchStart={handleInteraction}
      >
        {/* Header */}
        <div className={styles.panelHeader}>
          <div className={styles.headerLeft}>
            <span 
              className={styles.projectCode}
              style={{ color: activeLog.accentColor }}
            >
              {activeLog.projectCode}
            </span>
            <span className={styles.separator}>|</span>
            <span className={styles.projectAlias}>{activeLog.projectAlias}</span>
          </div>
          <div className={styles.headerRight}>
            {isPaused && (
              <span className={styles.pausedIndicator}>
                <span className={styles.pauseIcon}>❚❚</span>
                {translations.paused}
              </span>
            )}
            <button 
              className={styles.expandBtn}
              onClick={() => setIsExpanded(true)}
              title="Expand history"
            >
              ⤢
            </button>
          </div>
        </div>

        {/* Active Log Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLog.id}
            className={styles.logContent}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.timestamp}>[{activeLog.timestamp}]</div>

            <div className={styles.logDetails}>
              <div className={styles.detailRow}>
                <span className={styles.detailPrefix}>├─</span>
                <span className={styles.detailLabel}>{translations.type}</span>
                <span className={styles.detailColon}>:</span>
                <span 
                  className={styles.detailValue}
                  style={{ color: activeLog.accentColor }}
                >
                  {ENTRY_TYPE_LABELS[activeLog.entryType]}
                </span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.detailPrefix}>├─</span>
                <span className={styles.detailLabel}>{translations.stack}</span>
                <span className={styles.detailColon}>:</span>
                <span className={styles.detailValue}>
                  {activeLog.techStack?.map((tech, i) => (
                    <span key={i}>
                      {tech}
                      {i < activeLog.techStack.length - 1 && (
                        <span style={{ color: activeLog.accentColor }}> • </span>
                      )}
                    </span>
                  ))}
                </span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.detailPrefix}>├─</span>
                <span className={styles.detailLabel}>{translations.build}</span>
                <span className={styles.detailColon}>:</span>
                <span className={styles.detailValue}>{activeLog.oneLiner}</span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.detailPrefix}>├─</span>
                <span className={styles.detailLabel}>{translations.solved}</span>
                <span className={styles.detailColon}>:</span>
                <span className={styles.detailValueMuted}>{activeLog.challengeAbstract}</span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.detailPrefix}>└─</span>
                <ProgressBar progress={activeLog.progress} color={activeLog.accentColor} />
              </div>
            </div>

            {/* Mental Note */}
            {activeLog.mentalNote && (
              <motion.div 
                className={styles.mentalNote}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className={styles.notePrefix}>//</span>
                "{activeLog.mentalNote}"
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Dots */}
        <div className={styles.navDots}>
          {logs.map((log, i) => (
            <button
              key={log.id}
              className={`${styles.navDot} ${i === index ? styles.navDotActive : ''}`}
              style={i === index ? { backgroundColor: log.accentColor } : {}}
              onClick={() => handleLogClick(i)}
              aria-label={`View ${log.projectAlias}`}
            />
          ))}
        </div>

        {/* Expand hint */}
        <div className={styles.expandHint}>
          Click ⤢ to view history
        </div>
      </div>

      {/* Expanded Modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className={styles.expandedOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              className={styles.expandedModal}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* HUD Frame */}
              <div className={styles.hudFrame}>
                <div className={styles.hudCornerTL} style={{ borderColor: activeLog.accentColor }} />
                <div className={styles.hudCornerTR} style={{ borderColor: activeLog.accentColor }} />
                <div className={styles.hudCornerBL} style={{ borderColor: activeLog.accentColor }} />
                <div className={styles.hudCornerBR} style={{ borderColor: activeLog.accentColor }} />

                {/* Header */}
                <div className={styles.expandedHeader}>
                  <div className={styles.expandedHeaderLeft}>
                    <span className={styles.expandedIcon} style={{ color: activeLog.accentColor }}>◉</span>
                    <span className={styles.expandedCode} style={{ color: activeLog.accentColor }}>
                      {activeLog.projectCode}
                    </span>
                    <span className={styles.expandedAlias}>{activeLog.projectAlias}</span>
                    <span className={styles.historyCount}>
                      {projectHistory.length} entries
                    </span>
                  </div>
                  <div className={styles.expandedHeaderRight}>
                    {isPaused ? (
                      <span className={styles.statusBadge} data-status="paused">
                        {translations.paused}
                      </span>
                    ) : (
                      <span className={styles.statusBadge} data-status="auto">
                        {translations.autoRotate}
                      </span>
                    )}
                    <button 
                      className={styles.closeBtn}
                      onClick={() => setIsExpanded(false)}
                    >
                      [ESC]
                    </button>
                  </div>
                </div>

                {/* Content Grid */}
                <div className={styles.expandedContent}>
                  {/* Left: Active Log Full Details */}
                  <div className={styles.activeLogPanel}>
                    <div className={styles.panelLabel}>
                      <span className={styles.labelIcon}>▸</span>
                      CURRENT ENTRY
                    </div>
                    <LogEntry
                      log={activeLog}
                      isActive={true}
                      isFaded={false}
                      translations={translations}
                      showFull={true}
                    />
                  </div>

                  {/* Right: Scrollable History */}
                  <div className={styles.historyPanel}>
                    <div className={styles.panelLabel}>
                      <span className={styles.labelIcon}>◈</span>
                      {translations.history} ({projectHistory.length})
                    </div>
                    
                    <div 
                      ref={scrollContainerRef}
                      className={styles.historyScroll}
                      onScroll={handleScroll}
                    >
                      {projectHistory.map((log, i) => {
                        const isActive = log.id === activeLog.id;
                        const isFaded = i > 2 && !isActive;
                        const globalIndex = logs.findIndex(l => l.id === log.id);
                        
                        return (
                          <LogEntry
                            key={log.id}
                            log={log}
                            isActive={isActive}
                            isFaded={isFaded}
                            onClick={() => handleLogClick(globalIndex)}
                            translations={translations}
                            showFull={false}
                          />
                        );
                      })}
                      
                      {/* Fade overlay at bottom */}
                      <div className={styles.scrollFade} />
                    </div>
                  </div>
                </div>

                {/* All Projects Quick Nav */}
                <div className={styles.projectsNav}>
                  <span className={styles.projectsNavLabel}>ALL PROJECTS:</span>
                  <div className={styles.projectsNavList}>
                    {Array.from(logsByProject.keys()).map(code => {
                      const projectLogs = logsByProject.get(code);
                      const firstLog = projectLogs[0];
                      const isCurrentProject = code === activeLog.projectCode;
                      
                      return (
                        <button
                          key={code}
                          className={`${styles.projectNavBtn} ${isCurrentProject ? styles.projectNavBtnActive : ''}`}
                          style={isCurrentProject ? { 
                            borderColor: firstLog.accentColor,
                            color: firstLog.accentColor 
                          } : {}}
                          onClick={() => {
                            const globalIndex = logs.findIndex(l => l.projectCode === code);
                            if (globalIndex !== -1) handleLogClick(globalIndex);
                          }}
                        >
                          <span className={styles.projectNavCode}>{code}</span>
                          <span className={styles.projectNavCount}>{projectLogs.length}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Footer */}
                <div className={styles.expandedFooter}>
                  <span>Scroll or click to browse • Auto-resumes after {resumeDelay/1000}s</span>
                  <span>ESC or click outside to close</span>
                </div>

                {/* Scan lines */}
                <div className={styles.scanLines} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
