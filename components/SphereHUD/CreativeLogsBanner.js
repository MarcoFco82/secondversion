import { useMemo, useRef, useState, useEffect } from 'react';
import styles from './CreativeLogsBanner.module.css';

/**
 * CreativeLogsBanner — Holographic ticker below the SphereHUD.
 * Shows all creative logs auto-scrolling upward.
 * Pauses on hover, manually scrollable.
 * Colors from sphereConfig (admin-defined).
 */
export default function CreativeLogsBanner({ logs, sphereConfig, lang = 'en' }) {
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [manualScroll, setManualScroll] = useState(false);
  const manualTimer = useRef(null);

  const scrollSpeed = sphereConfig?.bannerScrollSpeed || 18;
  const accentColor = sphereConfig?.strokeColor || '#38bdf8';

  // Filter only creative logs (from enrichedLogs which have projectCode)
  const creativeLogs = useMemo(() => {
    if (!logs || !Array.isArray(logs)) return [];
    return logs
      .filter(l => l.projectCode)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [logs]);

  // Resume auto-scroll after manual scroll stops
  useEffect(() => {
    return () => clearTimeout(manualTimer.current);
  }, []);

  const handleScroll = () => {
    if (!isHovered) return;
    setManualScroll(true);
    clearTimeout(manualTimer.current);
    manualTimer.current = setTimeout(() => setManualScroll(false), 3000);
  };

  if (creativeLogs.length === 0) return null;

  const formatDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Duration scales with number of logs
  const animDuration = Math.max(scrollSpeed, creativeLogs.length * 3);

  const renderLogItem = (log, i, keyPrefix = '') => (
    <div key={`${keyPrefix}${log.id || i}`} className={styles.bannerItem}>
      <span className={styles.bannerCode} style={{ color: log.accentColor || accentColor }}>
        {log.projectCode}
      </span>
      <span className={styles.bannerDate}>{formatDate(log.createdAt)}</span>
      <span className={styles.bannerText}>{log.oneLiner || log.one_liner}</span>
    </div>
  );

  return (
    <div
      className={styles.bannerContainer}
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setManualScroll(false); }}
      onScroll={handleScroll}
      style={{
        '--accent': accentColor,
        '--banner-speed': `${animDuration}s`,
      }}
    >
      {/* Scanline overlay */}
      <div className={styles.scanlines} />

      {/* Top/bottom fade edges */}
      <div className={styles.fadeTop} />
      <div className={styles.fadeBottom} />

      <div
        className={`${styles.bannerTrack} ${isHovered && !manualScroll ? styles.paused : ''} ${manualScroll ? styles.manualMode : ''}`}
        ref={trackRef}
      >
        {/* Render logs twice for seamless loop */}
        {creativeLogs.map((log, i) => renderLogItem(log, i, 'a-'))}
        {creativeLogs.map((log, i) => renderLogItem(log, i, 'b-'))}
      </div>
    </div>
  );
}
