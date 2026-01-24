import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ActivityPulse.module.css';

// Generar partículas para efecto vapor
function generateParticles(count = 3) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 1.5 + Math.random() * 1,
    size: 2 + Math.random() * 2,
  }));
}

// Componente de barra individual con todas las animaciones
function ActivityBar({ 
  height, 
  index, 
  isHovered, 
  isActive, 
  onHover, 
  onClick, 
  dayLabel,
  value,
  maxValue,
  accentColor,
  isExpanded 
}) {
  const particles = useMemo(() => generateParticles(height > 50 ? 4 : 2), [height]);
  const barRef = useRef(null);
  
  // Breathing animation intensity based on height
  const breathingIntensity = height > 70 ? 1.08 : height > 40 ? 1.04 : 1.02;
  
  return (
    <motion.div
      ref={barRef}
      className={`${styles.bar} ${isActive ? styles.barActive : ''} ${isHovered ? styles.barHovered : ''}`}
      initial={{ height: 0, opacity: 0 }}
      animate={{ 
        height: `${Math.max(height, 5)}%`,
        opacity: 1,
      }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.03,
        ease: 'easeOut'
      }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(index)}
      style={{ '--accent-color': accentColor }}
    >
      {/* Bar core con breathing */}
      <motion.div 
        className={styles.barCore}
        animate={{ 
          scaleY: [1, breathingIntensity, 1],
        }}
        transition={{
          duration: 2 + (index % 3) * 0.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: index * 0.1,
        }}
        style={{ backgroundColor: accentColor }}
      />
      
      {/* Glow dinámico basado en actividad */}
      {height > 40 && (
        <motion.div 
          className={styles.barGlow}
          animate={{ 
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.08,
          }}
          style={{ 
            background: accentColor,
            boxShadow: `0 0 ${height > 70 ? 12 : 8}px ${accentColor}`,
          }}
        />
      )}
      
      {/* Partículas de vapor ascendente */}
      {height > 30 && (
        <div className={styles.particlesContainer}>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className={styles.particle}
              style={{
                left: `${particle.x}%`,
                width: particle.size,
                height: particle.size,
                backgroundColor: accentColor,
              }}
              animate={{
                y: [-5, -25 - Math.random() * 15],
                opacity: [0, 0.7, 0],
                scale: [0.5, 1, 0.3],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      )}
      
      {/* Ripple effect on hover */}
      {isHovered && (
        <motion.div
          className={styles.ripple}
          initial={{ scale: 0.5, opacity: 0.8 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ borderColor: accentColor }}
        />
      )}
      
      {/* Tooltip expandido */}
      <AnimatePresence>
        {isHovered && isExpanded && (
          <motion.div
            className={styles.barTooltip}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <div className={styles.tooltipDay}>{dayLabel}</div>
            <div className={styles.tooltipValue}>
              <span style={{ color: accentColor }}>{value}</span>
              <span className={styles.tooltipUnit}>entries</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Línea de heartbeat conectando picos
function HeartbeatLine({ data, accentColor }) {
  const pathRef = useRef(null);
  
  const pathD = useMemo(() => {
    if (data.length === 0) return '';
    
    const width = 100;
    const height = 100;
    const stepX = width / (data.length - 1);
    
    let path = `M 0 ${100 - data[0]}`;
    
    for (let i = 1; i < data.length; i++) {
      const x = i * stepX;
      const y = 100 - data[i];
      // Curva suave entre puntos
      const prevX = (i - 1) * stepX;
      const cpX = (prevX + x) / 2;
      path += ` Q ${cpX} ${100 - data[i-1]} ${x} ${y}`;
    }
    
    return path;
  }, [data]);
  
  return (
    <svg 
      className={styles.heartbeatSvg} 
      viewBox="0 0 100 100" 
      preserveAspectRatio="none"
    >
      {/* Línea de fondo con glow */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={accentColor}
        strokeWidth="0.8"
        strokeOpacity="0.3"
        filter="url(#glow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />
      
      {/* Línea principal animada */}
      <motion.path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke={accentColor}
        strokeWidth="0.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
      
      {/* Punto viajero */}
      <motion.circle
        r="1.5"
        fill={accentColor}
        filter="url(#glow)"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <animateMotion
          dur="3s"
          repeatCount="indefinite"
          path={pathD}
        />
      </motion.circle>
      
      {/* Filtro de glow */}
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

export default function ActivityPulse({ 
  data = [], 
  label = 'ACTIVITY',
  sublabel = '14-day pulse',
  onDaySelect,
  accentColor = 'var(--terminal-accent)',
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const containerRef = useRef(null);
  
  // Normalizar data a porcentajes (0-100)
  const normalizedData = useMemo(() => {
    const max = Math.max(...data, 1);
    return data.map(value => (value / max) * 100);
  }, [data]);
  
  // Generar labels de días (últimos 14 días)
  const dayLabels = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    return data.map((_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (data.length - 1 - i));
      return {
        short: days[date.getDay()],
        full: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        }),
      };
    });
  }, [data]);
  
  // Handle click en barra
  const handleBarClick = useCallback((index) => {
    setSelectedDay(selectedDay === index ? null : index);
    if (onDaySelect) {
      onDaySelect(index, data[index], dayLabels[index]);
    }
  }, [selectedDay, onDaySelect, data, dayLabels]);
  
  // Close expanded on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
        setSelectedDay(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isExpanded]);
  
  // Stats calculadas
  const stats = useMemo(() => {
    const total = data.reduce((a, b) => a + b, 0);
    const max = Math.max(...data);
    const avg = total / data.length;
    const maxDay = dayLabels[data.indexOf(max)]?.short || '';
    return { total, max, avg: avg.toFixed(1), maxDay };
  }, [data, dayLabels]);

  return (
    <>
      {/* Mini Version - Clickable */}
      <div 
        className={styles.pulseContainer}
        onClick={() => setIsExpanded(true)}
        role="button"
        tabIndex={0}
        aria-label="Expand activity pulse"
      >
        <div className={styles.pulseHeader}>
          <span className={styles.pulseLabel}>{label}</span>
          <span className={styles.pulseSublabel}>{sublabel}</span>
          <span className={styles.expandHint}>Click to expand</span>
        </div>
        
        <div className={styles.pulseWrapper}>
          {/* HUD corners */}
          <div className={styles.cornerTL} />
          <div className={styles.cornerTR} />
          <div className={styles.cornerBL} />
          <div className={styles.cornerBR} />
          
          {/* Fade gradients */}
          <div className={styles.fadeLeft} />
          <div className={styles.fadeRight} />
          
          {/* Heartbeat line */}
          <HeartbeatLine data={normalizedData} accentColor={accentColor} />
          
          {/* Bars */}
          <div className={styles.barsContainer}>
            {normalizedData.map((height, index) => (
              <ActivityBar
                key={index}
                height={height}
                index={index}
                isHovered={hoveredBar === index}
                isActive={selectedDay === index}
                onHover={setHoveredBar}
                onClick={() => {}}
                dayLabel={dayLabels[index]?.full}
                value={data[index]}
                maxValue={Math.max(...data)}
                accentColor={accentColor}
                isExpanded={false}
              />
            ))}
          </div>
          
          {/* Baseline */}
          <div className={styles.baseline} />
          
          {/* Scan effect */}
          <div className={styles.scanLine} />
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
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* HUD Frame */}
              <div className={styles.hudFrame}>
                <div className={styles.hudCornerTL} />
                <div className={styles.hudCornerTR} />
                <div className={styles.hudCornerBL} />
                <div className={styles.hudCornerBR} />
                
                {/* Header */}
                <div className={styles.expandedHeader}>
                  <div className={styles.headerLeft}>
                    <span className={styles.headerIcon}>◈</span>
                    <span className={styles.headerTitle}>{label}</span>
                    <span className={styles.headerSub}>{sublabel}</span>
                  </div>
                  <button 
                    className={styles.closeBtn}
                    onClick={() => setIsExpanded(false)}
                  >
                    [ESC]
                  </button>
                </div>
                
                {/* Stats Row */}
                <div className={styles.statsRow}>
                  <div className={styles.statItem}>
                    <span className={styles.statValue} style={{ color: accentColor }}>
                      {stats.total}
                    </span>
                    <span className={styles.statLabel}>Total Entries</span>
                  </div>
                  <div className={styles.statDivider} />
                  <div className={styles.statItem}>
                    <span className={styles.statValue} style={{ color: accentColor }}>
                      {stats.avg}
                    </span>
                    <span className={styles.statLabel}>Daily Avg</span>
                  </div>
                  <div className={styles.statDivider} />
                  <div className={styles.statItem}>
                    <span className={styles.statValue} style={{ color: accentColor }}>
                      {stats.max}
                    </span>
                    <span className={styles.statLabel}>Peak ({stats.maxDay})</span>
                  </div>
                </div>
                
                {/* Main Chart Area */}
                <div className={styles.chartArea}>
                  {/* Y-axis labels */}
                  <div className={styles.yAxis}>
                    <span>{Math.max(...data)}</span>
                    <span>{Math.round(Math.max(...data) / 2)}</span>
                    <span>0</span>
                  </div>
                  
                  {/* Chart */}
                  <div className={styles.chartWrapper}>
                    {/* Grid lines */}
                    <div className={styles.gridLines}>
                      <div className={styles.gridLine} />
                      <div className={styles.gridLine} />
                      <div className={styles.gridLine} />
                    </div>
                    
                    {/* Heartbeat line */}
                    <HeartbeatLine data={normalizedData} accentColor={accentColor} />
                    
                    {/* Bars */}
                    <div className={styles.expandedBars}>
                      {normalizedData.map((height, index) => (
                        <ActivityBar
                          key={index}
                          height={height}
                          index={index}
                          isHovered={hoveredBar === index}
                          isActive={selectedDay === index}
                          onHover={setHoveredBar}
                          onClick={handleBarClick}
                          dayLabel={dayLabels[index]?.full}
                          value={data[index]}
                          maxValue={Math.max(...data)}
                          accentColor={accentColor}
                          isExpanded={true}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* X-axis labels */}
                <div className={styles.xAxis}>
                  {dayLabels.map((day, i) => (
                    <span 
                      key={i} 
                      className={`${styles.xLabel} ${selectedDay === i ? styles.xLabelActive : ''}`}
                      style={selectedDay === i ? { color: accentColor } : {}}
                    >
                      {day.short}
                    </span>
                  ))}
                </div>
                
                {/* Footer hint */}
                <div className={styles.expandedFooter}>
                  <span>Click bar to filter logs by day</span>
                  <span>ESC or click outside to close</span>
                </div>
                
                {/* Scan lines overlay */}
                <div className={styles.scanLines} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
