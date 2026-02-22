import { useState, useCallback, useRef, useEffect } from 'react';

const FILTERS = ['All', 'Build', 'Ship', 'Experiment', 'Polish'];

/**
 * Hook: manages sphere interaction state — selected node, filters, auto-rotate.
 */
export function useSphereInteraction() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [autoRotate, setAutoRotate] = useState(true);
  const resumeTimer = useRef(null);

  const handleNodeClick = useCallback((project) => {
    setSelectedProject((prev) => (prev?.id === project.id ? null : project));
    // Pause auto-rotate on click
    setAutoRotate(false);
    clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setAutoRotate(true), 8000);
  }, []);

  const handleNodeHover = useCallback((project) => {
    setHoveredProject(project);
  }, []);

  const handleNodeUnhover = useCallback(() => {
    setHoveredProject(null);
  }, []);

  const handleFilterChange = useCallback((filter) => {
    setActiveFilter(filter);
    setSelectedProject(null);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedProject(null);
    setAutoRotate(true);
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => clearTimeout(resumeTimer.current);
  }, []);

  return {
    selectedProject,
    hoveredProject,
    activeFilter,
    autoRotate,
    filters: FILTERS,
    handleNodeClick,
    handleNodeHover,
    handleNodeUnhover,
    handleFilterChange,
    handleCloseDetail,
  };
}
