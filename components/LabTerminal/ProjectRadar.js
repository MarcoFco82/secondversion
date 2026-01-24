import { useMemo } from 'react';
import { motion } from 'framer-motion';
import styles from './ProjectRadar.module.css';

export default function ProjectRadar({ 
  projects = [], 
  activeProject,
  label = 'PROJECTS'
}) {
  // Posicionar proyectos en círculo
  const projectPositions = useMemo(() => {
    const radius = 35; // porcentaje del contenedor
    const centerX = 50;
    const centerY = 50;
    
    return projects.map((project, index) => {
      const angle = (index / projects.length) * 2 * Math.PI - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      return { ...project, x, y };
    });
  }, [projects]);

  return (
    <div className={styles.radarContainer}>
      <div className={styles.radarLabel}>{label}</div>
      
      <div className={styles.radarScreen}>
        {/* Radar circles */}
        <div className={styles.radarCircle1} />
        <div className={styles.radarCircle2} />
        <div className={styles.radarCircle3} />
        
        {/* Cross lines */}
        <div className={styles.radarLineH} />
        <div className={styles.radarLineV} />
        
        {/* Sweep animation */}
        <div className={styles.radarSweep} />
        
        {/* Project dots */}
        {projectPositions.map((project, index) => {
          const isActive = project.code === activeProject;
          return (
            <motion.div
              key={project.code}
              className={`${styles.projectDot} ${isActive ? styles.projectDotActive : ''}`}
              style={{
                left: `${project.x}%`,
                top: `${project.y}%`,
                backgroundColor: project.color,
                boxShadow: isActive ? `0 0 12px ${project.color}` : 'none',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: isActive ? 1.3 : 1, 
                opacity: 1 
              }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1 
              }}
              title={`${project.code} - ${project.alias}`}
            >
              {/* Pulse ring for active */}
              {isActive && (
                <motion.div
                  className={styles.pulseRing}
                  style={{ borderColor: project.color }}
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeOut'
                  }}
                />
              )}
            </motion.div>
          );
        })}
        
        {/* Center dot */}
        <div className={styles.centerDot} />
      </div>
      
      {/* Project count */}
      <div className={styles.projectCount}>
        {projects.length} active
      </div>
    </div>
  );
}
