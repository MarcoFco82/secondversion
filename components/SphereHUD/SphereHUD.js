import { useMemo } from 'react';
import styles from './SphereHUD.module.css';
import SphereIntro from './SphereIntro';
import SphereScene from './SphereScene';
import ProjectDetailPanel from './ProjectDetailPanel';
import { useProjectData } from './hooks/useProjectData';
import { useSphereInteraction } from './hooks/useSphereInteraction';
import { useMobileDetect } from './hooks/useMobileDetect';

/**
 * SphereHUD — Orchestrator component.
 * Replaces LabTerminalHUD with a 3D holographic sphere visualization.
 *
 * Fetches project data from existing APIs and renders an interactive
 * sphere with project nodes, particles, and activity ring.
 */
export default function SphereHUD({ lang = 'en' }) {
  const { projects, enrichedLogs, activityArray, loading } = useProjectData();
  const performanceConfig = useMobileDetect();
  const {
    selectedProject,
    hoveredProject,
    activeFilter,
    autoRotate,
    filters,
    handleNodeClick,
    handleNodeHover,
    handleNodeUnhover,
    handleFilterChange,
    handleCloseDetail,
  } = useSphereInteraction();

  // Filter projects by category
  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return projects;
    return projects.filter((p) => {
      const cat = (p.category || '').toLowerCase();
      return cat === activeFilter.toLowerCase();
    });
  }, [projects, activeFilter]);

  if (loading) {
    return (
      <>
        <SphereIntro lang={lang} />
        <div className={styles.sphereWrapper}>
          <div className={styles.loadingState}>Initializing 3D environment...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <SphereIntro lang={lang} />

      <div className={styles.sphereWrapper}>
        <div className={styles.sphereContainer}>
          {/* Canvas */}
          <div className={styles.canvasWrapper}>
            <SphereScene
              projects={filteredProjects}
              activityData={activityArray}
              selectedProject={selectedProject}
              hoveredProject={hoveredProject}
              onNodeClick={handleNodeClick}
              onNodeHover={handleNodeHover}
              onNodeUnhover={handleNodeUnhover}
              autoRotate={autoRotate}
              performanceConfig={performanceConfig}
            />

            {/* HUD overlay */}
            <div className={styles.hudOverlay}>
              <div className={styles.hudHeader}>
                <span className={styles.hudTitle}>SPHERE HUD</span>
                <span className={styles.hudVersion}>v2.0</span>
                <span className={styles.liveIndicator}>
                  <span className={styles.liveDot} />
                  LIVE
                </span>
              </div>

              <div className={styles.filterBar}>
                {filters.map((filter) => (
                  <button
                    key={filter}
                    className={`${styles.filterBtn} ${
                      activeFilter === filter ? styles.filterActive : ''
                    }`}
                    onClick={() => handleFilterChange(filter)}
                  >
                    [{filter}]
                  </button>
                ))}
              </div>
            </div>

            {/* Project count */}
            <div className={styles.projectCount}>
              {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} loaded
            </div>

            {/* Detail panel */}
            <ProjectDetailPanel
              project={selectedProject}
              logs={enrichedLogs}
              onClose={handleCloseDetail}
              lang={lang}
            />
          </div>
        </div>
      </div>
    </>
  );
}
