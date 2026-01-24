import { useState, useEffect, useRef } from 'react';
import styles from './LabTerminal.module.css';
import LabTerminalIntro from './LabTerminalIntro';

// Data now comes from API
const MOCK_LOGS = [];

const ENTRY_TYPE_LABELS = {
  build: 'BUILD',
  ship: 'SHIP',
  experiment: 'EXPERIMENT',
  polish: 'POLISH',
  study: 'STUDY',
  wire: 'WIRE',
};

const FILTERS = ['All', 'Build', 'Ship', 'Experiment', 'Polish'];

export default function LabTerminal({ lang = 'en' }) {
  const [logs, setLogs] = useState(MOCK_LOGS);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isLive, setIsLive] = useState(true);
  const terminalRef = useRef(null);

  // Simular indicador "LIVE" parpadeante
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLive(prev => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filtrar logs
  const filteredLogs = logs.filter(log => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Build') return log.entryType === 'build';
    if (activeFilter === 'Ship') return log.entryType === 'ship';
    if (activeFilter === 'Experiment') return log.entryType === 'experiment';
    if (activeFilter === 'Polish') return log.entryType === 'polish';
    return true;
  });

  // Renderizar barra de progreso
  const renderProgressBar = (progress) => {
    const filled = Math.floor(progress / 4);
    const empty = 25 - filled;
    return (
      <span className={styles.progressBar}>
        <span className={styles.progressFilled}>{'█'.repeat(filled)}</span>
        <span className={styles.progressEmpty}>{'░'.repeat(empty)}</span>
        <span className={styles.progressPercent}>{progress}%</span>
      </span>
    );
  };

  const translations = {
    en: {
      title: 'LAB TERMINAL',
      live: 'LIVE',
      latestBuilds: 'LATEST BUILDS',
      type: 'TYPE',
      stack: 'STACK',
      build: 'BUILD',
      solved: 'SOLVED',
      viewMore: 'View more',
      systemLine: 'Streaming development activity from {count} active projects...',
    },
    es: {
      title: 'LAB TERMINAL',
      live: 'EN VIVO',
      latestBuilds: 'ÚLTIMOS BUILDS',
      type: 'TIPO',
      stack: 'STACK',
      build: 'BUILD',
      solved: 'RESUELTO',
      viewMore: 'Ver más',
      systemLine: 'Transmitiendo actividad de desarrollo de {count} proyectos activos...',
    }
  };

  const t = translations[lang] || translations.en;

  // Contar proyectos únicos
  const uniqueProjects = new Set(logs.map(log => log.projectCode)).size;

  return (
    <>
      {/* Intro contextual */}
      <LabTerminalIntro lang={lang} />
      
      {/* Terminal */}
      <div className={styles.terminalWrapper}>
        <div className={styles.terminal} ref={terminalRef}>
          {/* Header */}
          <div className={styles.terminalHeader}>
            <div className={styles.terminalTitle}>
              <span className={styles.terminalIcon}>&#9654;</span>
              {t.title}
              <span className={styles.terminalVersion}>v2.1.0</span>
            </div>
            <div className={styles.terminalControls}>
              <span className={`${styles.liveIndicator} ${isLive ? styles.liveActive : ''}`}>
                {t.live}
              </span>
              <div className={styles.windowButtons}>
                <span className={styles.windowBtn}></span>
                <span className={styles.windowBtn}></span>
                <span className={styles.windowBtn}></span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className={styles.terminalContent}>
            {/* System line - contextualiza internamente */}
            <div className={styles.systemLine}>
              <span className={styles.systemPrefix}>SYSTEM:</span>
              <span className={styles.systemText}>
                {t.systemLine.replace('{count}', uniqueProjects)}
              </span>
            </div>

            <div className={styles.sectionHeader}>
              <span className={styles.prompt}>&gt;</span>
              {t.latestBuilds}
              <span className={styles.cursor}>_</span>
            </div>

            <div className={styles.divider}></div>

            {/* Log entries */}
            <div className={styles.logsContainer}>
              {filteredLogs.map((log, index) => (
                <div 
                  key={log.id} 
                  className={styles.logEntry}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Timestamp and project info */}
                  <div className={styles.logHeader}>
                    <span className={styles.timestamp}>[{log.timestamp}]</span>
                    <span className={styles.projectCode}>{log.projectCode}</span>
                    <span className={styles.separator}>|</span>
                    <span className={styles.projectAlias}>{log.projectAlias}</span>
                  </div>

                  {/* Log details */}
                  <div className={styles.logDetails}>
                    <div className={styles.logLine}>
                      <span className={styles.linePrefix}>├─</span>
                      <span className={styles.lineLabel}>{t.type}</span>
                      <span className={styles.lineColon}>:</span>
                      <span className={styles.entryType}>
                        {ENTRY_TYPE_LABELS[log.entryType] || log.entryType.toUpperCase()}
                      </span>
                    </div>

                    <div className={styles.logLine}>
                      <span className={styles.linePrefix}>├─</span>
                      <span className={styles.lineLabel}>{t.stack}</span>
                      <span className={styles.lineColon}>:</span>
                      <span className={styles.techStack}>
                        {log.techStack.map((tech, i) => (
                          <span key={i}>
                            {tech}
                            {i < log.techStack.length - 1 && <span className={styles.techSeparator}> • </span>}
                          </span>
                        ))}
                      </span>
                    </div>

                    <div className={styles.logLine}>
                      <span className={styles.linePrefix}>├─</span>
                      <span className={styles.lineLabel}>{t.build}</span>
                      <span className={styles.lineColon}>:</span>
                      <span className={styles.oneLiner}>{log.oneLiner}</span>
                    </div>

                    <div className={styles.logLine}>
                      <span className={styles.linePrefix}>├─</span>
                      <span className={styles.lineLabel}>{t.solved}</span>
                      <span className={styles.lineColon}>:</span>
                      <span className={styles.challenge}>{log.challengeAbstract}</span>
                    </div>

                    <div className={styles.logLine}>
                      <span className={styles.linePrefix}>└─</span>
                      {renderProgressBar(log.progress)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.divider}></div>

            {/* Filters */}
            <div className={styles.filtersRow}>
              <div className={styles.filterButtons}>
                {FILTERS.map(filter => (
                  <button
                    key={filter}
                    className={`${styles.filterBtn} ${activeFilter === filter ? styles.filterActive : ''}`}
                    onClick={() => setActiveFilter(filter)}
                  >
                    [{filter}]
                  </button>
                ))}
              </div>
              <a href="/lab" className={styles.viewMoreLink}>
                {t.viewMore} <span className={styles.arrow}>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
