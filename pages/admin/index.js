import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '../../components/Admin/AdminLayout';
import styles from '../../styles/AdminDashboard.module.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: { total: 0, active: 0 },
    logs: { total: 0, today: 0 },
    activity: [],
  });
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch projects
      const projectsRes = await fetch('/api/projects');
      const projectsData = await projectsRes.json();
      
      // Fetch logs
      const logsRes = await fetch('/api/logs');
      const logsData = await logsRes.json();
      
      // Fetch activity
      const activityRes = await fetch('/api/activity');
      const activityData = await activityRes.json();

      const projects = projectsData.data || [];
      const logs = logsData.data || [];
      const activity = activityData.data || [];

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const logsToday = logs.filter(l => l.created_at?.startsWith(today)).length;
      const activeProjects = projects.filter(p => p.status === 'active').length;

      setStats({
        projects: { total: projects.length, active: activeProjects },
        logs: { total: logs.length, today: logsToday },
        activity: activity.slice(-14),
      });

      setRecentLogs(logs.slice(0, 5));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const getEntryTypeColor = (type) => {
    const colors = {
      build: '#ffa742',
      ship: '#4ade80',
      experiment: '#06b6d4',
      polish: '#a78bfa',
      study: '#3b82f6',
      wire: '#f59e0b',
    };
    return colors[type] || '#888';
  };

  return (
    <>
      <Head>
        <title>Dashboard | Admin Console</title>
      </Head>

      <AdminLayout title="Dashboard">
        {loading ? (
          <div className={styles.loading}>Loading dashboard...</div>
        ) : (
          <div className={styles.dashboard}>
            {/* Stats Grid */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>◆</div>
                <div className={styles.statContent}>
                  <div className={styles.statValue}>{stats.projects.total}</div>
                  <div className={styles.statLabel}>Total Projects</div>
                  <div className={styles.statMeta}>
                    {stats.projects.active} active
                  </div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>▣</div>
                <div className={styles.statContent}>
                  <div className={styles.statValue}>{stats.logs.total}</div>
                  <div className={styles.statLabel}>Dev Logs</div>
                  <div className={styles.statMeta}>
                    {stats.logs.today} today
                  </div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>◩</div>
                <div className={styles.statContent}>
                  <div className={styles.statValue}>0</div>
                  <div className={styles.statLabel}>Social Posts</div>
                  <div className={styles.statMeta}>coming soon</div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>▧</div>
                <div className={styles.statContent}>
                  <div className={styles.statValue}>1</div>
                  <div className={styles.statLabel}>CV Version</div>
                  <div className={styles.statMeta}>coming soon</div>
                </div>
              </div>
            </div>

            {/* Activity Chart */}
            <div className={styles.activitySection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Activity (14 days)</h2>
              </div>
              <div className={styles.activityChart}>
                {stats.activity.map((day, i) => (
                  <div 
                    key={i} 
                    className={styles.activityBar}
                    style={{ 
                      height: `${Math.max(day.entry_count * 10, 4)}%`,
                      background: day.entry_count > 0 ? '#ffa742' : '#2a2a2a',
                    }}
                    title={`${day.date}: ${day.entry_count} entries`}
                  />
                ))}
              </div>
            </div>

            {/* Recent Logs & Quick Actions */}
            <div className={styles.bottomGrid}>
              {/* Recent Logs */}
              <div className={styles.recentSection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Recent Logs</h2>
                  <Link href="/admin/logs" className={styles.viewAllBtn}>
                    View all
                  </Link>
                </div>
                <div className={styles.logsList}>
                  {recentLogs.length === 0 ? (
                    <div className={styles.emptyState}>
                      No logs yet. Create your first dev log.
                    </div>
                  ) : (
                    recentLogs.map((log) => (
                      <div key={log.id} className={styles.logItem}>
                        <span 
                          className={styles.logType}
                          style={{ color: getEntryTypeColor(log.entry_type) }}
                        >
                          {log.entry_type?.toUpperCase()}
                        </span>
                        <span className={styles.logTitle}>{log.one_liner}</span>
                        <span className={styles.logDate}>
                          {new Date(log.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className={styles.quickActions}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Quick Actions</h2>
                </div>
                <div className={styles.actionsList}>
                  <Link href="/admin/logs?action=new" className={styles.actionBtn}>
                    <span className={styles.actionIcon}>+</span>
                    <span className={styles.actionText}>New Dev Log</span>
                  </Link>
                  <Link href="/admin/projects?action=new" className={styles.actionBtn}>
                    <span className={styles.actionIcon}>+</span>
                    <span className={styles.actionText}>New Project</span>
                  </Link>
                  <Link href="/admin/media" className={styles.actionBtn}>
                    <span className={styles.actionIcon}>↑</span>
                    <span className={styles.actionText}>Upload Media</span>
                  </Link>
                  <button className={styles.actionBtn} disabled>
                    <span className={styles.actionIcon}>◎</span>
                    <span className={styles.actionText}>Generate Social Post</span>
                    <span className={styles.actionSoon}>soon</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
