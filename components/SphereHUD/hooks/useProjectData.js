import { useState, useEffect, useMemo } from 'react';

/**
 * Hook: fetches projects, logs, and activity data from APIs.
 * Extracted from LabTerminalHUD data fetching logic.
 */
export function useProjectData() {
  const [projects, setProjects] = useState([]);
  const [logs, setLogs] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, logsRes, activityRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/logs'),
          fetch('/api/activity'),
        ]);

        const [projectsData, logsData, activityData] = await Promise.all([
          projectsRes.json(),
          logsRes.json(),
          activityRes.json(),
        ]);

        if (projectsData.success) setProjects(projectsData.data || []);
        if (logsData.success) setLogs(logsData.data || []);
        if (activityData.success) setActivity(activityData.data || []);
      } catch (error) {
        console.error('Error fetching sphere data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Enrich logs with project data (same logic as LabTerminalHUD)
  const enrichedLogs = useMemo(() => {
    return logs
      .map((log) => {
        const project = projects.find((p) => p.id === log.project_id);
        return {
          ...log,
          projectId: log.project_id,
          entryType: log.entry_type,
          oneLiner: log.one_liner,
          createdAt: log.created_at,
          projectCode: log.project_code || project?.code,
          projectAlias: log.project_alias || project?.alias,
          accentColor: log.project_color || project?.accent_color,
          techStack: (() => {
            try {
              return JSON.parse(log.project_tech_stack || project?.tech_stack || '[]');
            } catch {
              return [];
            }
          })(),
          progress: log.project_progress ?? project?.progress ?? 0,
          category: log.project_category || project?.category,
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [logs, projects]);

  // Activity as simple number array
  const activityArray = useMemo(() => {
    return activity.map((a) => a.entry_count || 0);
  }, [activity]);

  return { projects, enrichedLogs, activity, activityArray, loading };
}
